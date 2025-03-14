import DateLib from "../../_dates/DateLib.ts";
import Schedule, {
  ScheduleCell,
  ScheduleRow,
  ScheduleTable,
} from "../entities/Schedule.ts";
import ShiftContextNote from "../entities/ShiftContextNote.ts";
import ShiftContextNoteRepository from "./ShiftContextNoteRepository.ts";
import ShiftContextRepository from "./ShiftContextRepository.ts";
import SubstituteRepository from "./SubstituteRepository.ts";
import TimeSlot from "../entities/TimeSlot.ts";
import TimeSlotRepository from "./TimeSlotRepository.ts";
import TeamMemberRepository from "./TeamMemberRepository.ts";
import Recommendation, {
  FieldName,
  FieldStatus,
} from "../entities/Recommendation.ts";
import TypicalAvailabilityRepository from "./TypicalAvailabilityRepository.ts";
import UnavailabilityRepository from "./UnavailabilityRepository.ts";
import ShiftContextPreferenceRepository from "./ShiftContextPreferenceRepository.ts";

export default class ScheduleRepository {
  private shiftContexts: ShiftContextRepository;
  private shiftContextNotes: ShiftContextNoteRepository;
  private shiftContextPreferences: ShiftContextPreferenceRepository;
  private substitutes: SubstituteRepository;
  private teamMembers: TeamMemberRepository;
  private timeSlots: TimeSlotRepository;
  private typicalAvailability: TypicalAvailabilityRepository;
  private unavailability: UnavailabilityRepository;

  constructor(
    shiftContexts: ShiftContextRepository,
    shiftContextNotes: ShiftContextNoteRepository,
    shiftContextPreferences: ShiftContextPreferenceRepository,
    substitutes: SubstituteRepository,
    teamMembers: TeamMemberRepository,
    timeSlots: TimeSlotRepository,
    typicalAvailability: TypicalAvailabilityRepository,
    unavailability: UnavailabilityRepository,
  ) {
    this.shiftContexts = shiftContexts;
    this.shiftContextNotes = shiftContextNotes;
    this.shiftContextPreferences = shiftContextPreferences;
    this.substitutes = substitutes;
    this.teamMembers = teamMembers;
    this.timeSlots = timeSlots;
    this.typicalAvailability = typicalAvailability;
    this.unavailability = unavailability;
  }

  public async getSchedule(start: Date, end: Date): Promise<Schedule> {
    const scheduleTable: ScheduleTable = [];
    const dateList = DateLib.getDatesInRange(start, end);

    // column headers
    scheduleTable.push([
      { type: "string", content: "" },
      ...dateList.map((
        date,
      ) => ({ type: "dateHeader", content: date } as ScheduleCell)),
    ]);

    const shiftContexts = await this.shiftContexts.list();
    for (const shiftContext of shiftContexts) {
      // Shift context header cell
      const row: ScheduleRow = [{
        type: "ShiftContext",
        content: shiftContext,
      }];

      // Shift context note cells
      for (const date of dateList) {
        let shiftContextNote = await this.shiftContextNotes.get(
          shiftContext.id,
          date,
        );

        if (shiftContextNote == null) {
          shiftContextNote = new ShiftContextNote(
            shiftContext.id,
            null,
            date,
            "",
            null,
            null,
          );
        }

        const cell: ScheduleCell = {
          type: "ShiftContextNote",
          content: shiftContextNote,
        };
        row.push(cell);
      }

      // Push shift context header row
      scheduleTable.push(row);

      // Time slot groups under shift context
      const groups = await this.timeSlots.getByGroups(
        shiftContext.id,
        start,
        end,
      );
      for (const group of groups) {
        const timeSlotGroup = group.timeSlotGroup;
        const timeSlotsByDay = group.timeSlotsByDay as (TimeSlot | null)[][];

        const rowCount = timeSlotsByDay.length;
        const colCount = Math.max(
          ...timeSlotsByDay.map((array) => array.length),
        );

        // fill the array with nulls to convert it from jagged to rectangular
        for (let i = 0; i < timeSlotsByDay.length; i++) {
          while (timeSlotsByDay[i].length < colCount) {
            timeSlotsByDay[i].push(null);
          }
        }

        // build a new array to transpose the old one into
        const targetArray: (ScheduleCell | null)[][] = [];
        for (let i = 0; i < colCount; i++) {
          const row: (ScheduleCell | null)[] = [];
          for (let j = 0; j < rowCount; j++) {
            row.push(null);
          }
          targetArray.push(row);
        }

        // transpose old array into new array
        for (let rowNum = 0; rowNum < rowCount; rowNum++) {
          for (let colNum = 0; colNum < colCount; colNum++) {
            const timeSlot = timeSlotsByDay[rowNum][colNum];

            let newCell: ScheduleCell = { type: "string", content: "" };
            if (timeSlot) {
              newCell = { type: "TimeSlot", content: timeSlot };
            }

            // Swapped row and column to transpose array
            targetArray[colNum][rowNum] = newCell;
          }
        }

        // Insert header cell at start of each row
        for (let i = 0; i < targetArray.length; i++) {
          targetArray[i].unshift(
            { type: "TimeSlotGroup", content: timeSlotGroup },
          );
        }

        scheduleTable.push(...(targetArray as ScheduleTable));
      }
    }

    // Substitutes row
    const substitutesRow: ScheduleRow = [{
      type: "header",
      content: "Substitutes",
    }];
    for (const date of dateList) {
      const substituteList = await this.substitutes.getSubstituteList(date);
      const cell: ScheduleCell = {
        type: "SubstituteList",
        content: substituteList,
      };
      substitutesRow.push(cell);
    }
    scheduleTable.push(substitutesRow);

    return new Schedule("", start, end, scheduleTable);
  }

  public async getRecommendations(
    timeSlot: TimeSlot,
  ): Promise<Recommendation[]> {
    const teamMembers = await this.teamMembers.list();

    const recommendations: Recommendation[] = [];
    for (const teamMember of teamMembers) {
      const recommendation = new Recommendation(
        teamMember,
        new Map<FieldName, FieldStatus>(),
      );

      // Age restriction

      if (!timeSlot.requiresAdult) {
        recommendation.fields.set("adult", "neutral");
      } else if (
        teamMember.birthDate == null || timeSlot.startDateTime == null
      ) {
        recommendation.fields.set("adult", "unknown");
      } else {
        const age = DateLib.getAge(
          teamMember.birthDate,
          timeSlot.startDateTime,
        );
        const isAdult = age >= 18;
        const result = isAdult ? "positive" : "negative";
        recommendation.fields.set("adult", result);
      }

      // Availability

      const typicallyAvailable = await this.typicalAvailability.isAvailable(
        teamMember,
        timeSlot,
      );
      const speciallyAvailable = await this.unavailability.isAvailable(
        teamMember,
        timeSlot,
      );

      if (typicallyAvailable == "negative" || speciallyAvailable == "negative") {
        recommendation.fields.set("available", "negative");
      } else if (typicallyAvailable == "unknown" || speciallyAvailable == "unknown") {
        recommendation.fields.set("available", "unknown");
      } else {
        recommendation.fields.set("available", "positive");
      }

      // Shift context preference

      const preference = await this.shiftContextPreferences.getPreference(
        teamMember.id,
        timeSlot.shiftContextId,
      );
      recommendation.fields.set("prefers", preference);

      // Scheduling conflicts

      const hasConflict = await this.timeSlots.hasNoConflicts(
        teamMember.id,
        timeSlot,
      );
      recommendation.fields.set("conflict", hasConflict);

      // Add the recommendation for the team member to the list of recommendations
      recommendations.push(recommendation);
    }

    return recommendations;
  }
}
