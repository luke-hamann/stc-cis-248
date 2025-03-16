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
import AssigneeRecommendations, {
  AssigneeRecommendationField,
  AssigneeRecommendationStatus,
} from "../entities/AssigneeRecommendation.ts";
import TypicalAvailabilityRepository from "./TypicalAvailabilityRepository.ts";
import UnavailabilityRepository from "./UnavailabilityRepository.ts";
import ShiftContextPreferenceRepository from "./ShiftContextPreferenceRepository.ts";
import TeamMember from "../entities/TeamMember.ts";
import ShiftContext from "../entities/ShiftContext.ts";
import Database from "./_Database.ts";

interface ITimeSlotRowComponent {
  timeSlotId: number;
  timeSlotShiftContextId: number;
  timeSlotStartDateTime: Date;
  timeSlotEndDateTime: Date;
  timeSlotRequiresAdult: number;
  timeSlotTeamMemberId: number;
  timeSlotNote: string;
  timeSlotColorId: number;
}

interface ITeamMemberRowComponent {
  teamMemberId: number;
  teamMemberFirstName: string;
  teamMemberMiddleName: string;
  teamMemberLastName: string;
  teamMemberBirthDate: Date;
  teamMemberEmail: string;
  teamMemberPhone: string;
  teamMemberIsExternal: number;
  teamMemberMaxWeeklyHours: number;
  teamMemberMaxWeeklyDays: number;
  teamMemberUsername: string;
  teamMemberPassword: string;
  teamMemberIsAdmin: number;
}

interface IShiftContextRowComponent {
  shiftContextId: number,
  shiftContextName: string,
  shiftContextAgeGroup: string,
  shiftContextLocation: string,
  shiftContextDescription: string
}

interface ITimeSlotTeamMemberRow extends ITimeSlotRowComponent, ITeamMemberRowComponent {}

interface ITimeSlotTeamMemberRow
  extends ITimeSlotRowComponent, ITeamMemberRowComponent {}

interface ITimeSlotTeamMemberShiftContextRow
  extends ITimeSlotRowComponent, ITeamMemberRowComponent, IShiftContextRowComponent {}

interface ITeamMemberTimeSlotTimeSlotRow extends ITeamMemberRowComponent {
  timeSlot1Id: number;
  timeSlot1ShiftContextId: number;
  timeSlot1StartDateTime: Date;
  timeSlot1EndDateTime: Date | null;
  timeSlot1RequiresAdult: number;
  timeSlot1TeamMemberId: number | null;
  timeSlot1Note: string;
  timeSlot1ColorId: number | null;
  timeSlot2Id: number;
  timeSlot2ShiftContextId: number;
  timeSlot2StartDateTime: Date;
  timeSlot2EndDateTime: Date | null;
  timeSlot2RequiresAdult: number;
  timeSlot2TeamMemberId: number | null;
  timeSlot2Note: string;
  timeSlot2ColorId: number | null;
}

export default class ScheduleRepository {
  private database: Database;
  private shiftContexts: ShiftContextRepository;
  private shiftContextNotes: ShiftContextNoteRepository;
  private shiftContextPreferences: ShiftContextPreferenceRepository;
  private substitutes: SubstituteRepository;
  private teamMembers: TeamMemberRepository;
  private timeSlots: TimeSlotRepository;
  private typicalAvailability: TypicalAvailabilityRepository;
  private unavailability: UnavailabilityRepository;

  constructor(
    database: Database,
    shiftContexts: ShiftContextRepository,
    shiftContextNotes: ShiftContextNoteRepository,
    shiftContextPreferences: ShiftContextPreferenceRepository,
    substitutes: SubstituteRepository,
    teamMembers: TeamMemberRepository,
    timeSlots: TimeSlotRepository,
    typicalAvailability: TypicalAvailabilityRepository,
    unavailability: UnavailabilityRepository,
  ) {
    this.database = database;
    this.shiftContexts = shiftContexts;
    this.shiftContextNotes = shiftContextNotes;
    this.shiftContextPreferences = shiftContextPreferences;
    this.substitutes = substitutes;
    this.teamMembers = teamMembers;
    this.timeSlots = timeSlots;
    this.typicalAvailability = typicalAvailability;
    this.unavailability = unavailability;
  }

  private readonly timeSlotColumnsSql = `
    TimeSlots.id              timeSlotId,
    TimeSlots.shiftContextId  timeSlotShiftContextId,
    TimeSlots.startDateTime   timeSlotStartDateTime,
    TimeSlots.endDateTime     timeSlotEndDateTime,
    TimeSlots.requiresAdult   timeSlotRequiresAdult,
    TimeSlots.teamMemberId    timeSlotTeamMemberId,
    TimeSlots.note            timeSlotNote,
    TimeSlots.colorId         timeSlotColorId
  `;

  public mapTimeSlotColumns(row: ITimeSlotRowComponent) {
    return new TimeSlot(
      row.timeSlotId,
      row.timeSlotShiftContextId,
      null,
      row.timeSlotStartDateTime,
      row.timeSlotEndDateTime,
      row.timeSlotRequiresAdult == 1,
      row.timeSlotTeamMemberId,
      null,
      row.timeSlotNote,
      row.timeSlotColorId,
      null
    );
  }

  private readonly teamMemberColumnsSql = `
    TeamMembers.id              teamMemberId,
    TeamMembers.firstName       teamMemberFirstName,
    TeamMembers.middleName      teamMemberMiddleName,
    TeamMembers.lastName        teamMemberLastName,
    TeamMembers.birthDate       teamMemberBirthDate,
    TeamMembers.email           teamMemberEmail,
    TeamMembers.phone           teamMemberPhone,
    TeamMembers.isExternal      teamMemberIsExternal,
    TeamMembers.maxWeeklyHours  teamMemberMaxWeeklyHours,
    TeamMembers.maxWeeklyDays   teamMemberMaxWeeklyDays,
    TeamMembers.username        teamMemberUsername,
    TeamMembers.password        teamMemberPassword,
    TeamMembers.isAdmin         teamMemberIsAdmin
  `;

  public mapTeamMemberColumns(row: ITeamMemberRowComponent) {
    return new TeamMember(
      row.teamMemberId,
      row.teamMemberFirstName,
      row.teamMemberMiddleName,
      row.teamMemberLastName,
      row.teamMemberBirthDate,
      row.teamMemberEmail,
      row.teamMemberPhone,
      row.teamMemberIsExternal == 1,
      row.teamMemberMaxWeeklyHours,
      row.teamMemberMaxWeeklyDays,
      row.teamMemberUsername,
      row.teamMemberPassword,
      row.teamMemberIsAdmin == 1,
    );
  }

  private readonly shiftContextColumnsSql = `
    ShiftContexts.id           shiftContextId,
    ShiftContexts.name         shiftContextName,
    ShiftContexts.location     shiftContextLocation,
    ShiftContexts.description  shiftContextDescription
  `;

  public mapShiftContextColumns(row: IShiftContextRowComponent) {
    return new ShiftContext(
      row.shiftContextId,
      row.shiftContextName,
      row.shiftContextAgeGroup,
      row.shiftContextLocation,
      row.shiftContextDescription,
    );
  }

  private readonly timeSlotTeamMemberQuery = `
    SELECT
    ${this.timeSlotColumnsSql},
    ${this.teamMemberColumnsSql}
    FROM TimeSlots
      JOIN TeamMembers
        ON TimeSlots.teamMemberId = TeamMembers.id
  `;

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
  ): Promise<AssigneeRecommendations[]> {
    const teamMembers = await this.teamMembers.list();

    const recommendations: AssigneeRecommendations[] = [];
    for (const teamMember of teamMembers) {
      const recommendation = new AssigneeRecommendations(
        teamMember,
        new Map<AssigneeRecommendationField, AssigneeRecommendationStatus>(),
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

      if (
        typicallyAvailable == "negative" || speciallyAvailable == "negative"
      ) {
        recommendation.fields.set("available", "negative");
      } else if (
        typicallyAvailable == "unknown" || speciallyAvailable == "unknown"
      ) {
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

  public mapTimeSlotTeamMemberRows(rows: ITimeSlotTeamMemberRow[]): TimeSlot[] {
    return rows.map((row) => {
      const timeSlot = this.mapTimeSlotColumns(row);
      const teamMember = this.mapTeamMemberColumns(row);
      timeSlot.teamMember = teamMember;
      return timeSlot;
    });
  }

  public async findWithExternalAssignees(
    start: Date,
    end: Date,
  ): Promise<TimeSlot[]> {
    const result = await this.database.execute(
      `
        ${this.timeSlotTeamMemberQuery}
        WHERE TeamMembers.isExternal
          AND DATE(startDateTime) BETWEEN ? AND ?
      `,
      [start, end],
    );

    if (!result.rows) return [];

    return this.mapTimeSlotTeamMemberRows(result.rows);
  }

  /**
   * Finds pairs of time slots where a team member was scheduled in two places at the same time
   * @param start Start date range
   * @param end End date range
   * @returns Pairs of conflicting time slots
   */
  public async findBilocation(
    start: Date,
    end: Date,
  ): Promise<[TimeSlot, TimeSlot][]> {
    // Using "less than" (not "equals") to compare the ids prevents a bilocation from being listed twice
    const result = await this.database.execute(
      `
        SELECT
          ${this.teamMemberColumnsSql},
          t1.id timeSlot1Id,
          t1.shiftContextId timeSlot1ShiftContextId,
          t1.startDateTime timeSlot1StartDateTime,
          t1.endDateTime timeSlot1EndDateTime,
          t1.requiresAdult timeSlot1RequiresAdult,
          t1.teamMemberId timeSlot1TeamMemberId,
          t1.note timeSlot1Note,
          t2.id timeSlot2Id,
          t2.shiftContextId timeSlot2ShiftContextId,
          t2.startDateTime timeSlot2StartDateTime,
          t2.endDateTime timeSlot2EndDateTime,
          t2.requiresAdult timeSlot2RequiresAdult,
          t2.teamMemberId timeSlot2TeamMemberId,
          t2.note timeSlotNote
        FROM TimeSlots t1, TimeSlots t2, TeamMembers
          WHERE t1.id < t2.id
            AND t1.teamMemberId = t2.teamMemberId
            AND (
              t1.startDateTime BETWEEN t2.startDateTime AND t2.endDateTime
              OR t1.endDateTime BETWEEN t2.startDateTime AND t2.endDateTime
            )
            AND DATE(t1.startDateTime) BETWEEN ? AND ?
            AND t1.teamMemberId = TeamMembers.id
      `,
      [start, end],
    );

    if (!result.rows) return [];

    return result.rows.map((row: ITeamMemberTimeSlotTimeSlotRow) => {
      const teamMember = new TeamMember(
        row.teamMemberId,
        row.teamMemberFirstName,
        row.teamMemberMiddleName,
        row.teamMemberLastName,
        row.teamMemberBirthDate,
        row.teamMemberEmail,
        row.teamMemberPhone,
        row.teamMemberIsExternal == 1,
        row.teamMemberMaxWeeklyHours,
        row.teamMemberMaxWeeklyDays,
        row.teamMemberUsername,
        row.teamMemberPassword,
        row.teamMemberIsAdmin == 1
      );

      return [
        new TimeSlot(
          row.timeSlot1Id,
          row.timeSlot1ShiftContextId,
          null,
          row.timeSlot1StartDateTime,
          row.timeSlot1EndDateTime,
          row.timeSlot1RequiresAdult == 1,
          row.timeSlot1TeamMemberId,
          teamMember,
          row.timeSlot1Note,
          row.timeSlot1ColorId,
          null,
        ),
        new TimeSlot(
          row.timeSlot2Id,
          row.timeSlot2ShiftContextId,
          null,
          row.timeSlot2StartDateTime,
          row.timeSlot2EndDateTime,
          row.timeSlot2RequiresAdult == 1,
          row.timeSlot2TeamMemberId,
          teamMember,
          row.timeSlot2Note,
          row.timeSlot2ColorId,
          null,
        ),
      ];
    });
  }

  public async findAdultOnlyViolations(
    start: Date,
    end: Date,
  ): Promise<TimeSlot[]> {
    const result = await this.database.execute(
      `
        ${this.timeSlotTeamMemberQuery}
        WHERE TimeSlots.requiresAdult
          AND DATE(TimeSlots.startDateTime) BETWEEN ? AND ?
          AND TIMESTAMPDIFF(YEAR, TeamMembers.birthDate, TimeSlots.startDateTime) < 18;
      `,
      [start, end],
    );

    if (!result.rows) return [];

    return this.mapTimeSlotTeamMemberRows(result.rows);
  }

  public async findPreferenceViolations(
    start: Date,
    end: Date,
  ): Promise<TimeSlot[]> {
    const result = await this.database.execute(
      `
        SELECT
          ${this.timeSlotColumnsSql},
          ${this.teamMemberColumnsSql},
          ${this.shiftContextColumnsSql}
        FROM TimeSlots,
          TeamMembers,
          ShiftContexts,
          TeamMemberShiftContextPreferences
        WHERE TimeSlots.teamMemberId = TeamMembers.id
          AND TimeSlots.shiftContextId = ShiftContexts.id
          AND TimeSlots.teamMemberId = TeamMemberShiftContextPreferences.teamMemberId
          AND TimeSlots.shiftContextId = TeamMemberShiftContextPreferences.shiftContextId
          AND TeamMemberShiftContextPreferences.isPreference = FALSE
          AND DATE(TimeSlots.startDateTime) BETWEEN ? AND ?
      `,
      [start, end],
    );

    if (!result.rows) return [];

    return result.rows.map((row: ITimeSlotTeamMemberShiftContextRow) => {
      const timeSlot = this.mapTimeSlotColumns(row);
      timeSlot.shiftContext = this.mapShiftContextColumns(row);
      timeSlot.teamMember = this.mapTeamMemberColumns(row);
      return timeSlot;
    });
  }

  public async findAvailabilityViolations(
    start: Date,
    end: Date,
  ): Promise<TimeSlot[]> {
    const result = await this.database.execute(
      `
        -- Time slots not covered by typical availability
        SELECT
          ${this.timeSlotColumnsSql},
          ${this.teamMemberColumnsSql}
        FROM TimeSlots
          JOIN TeamMembers ON TimeSlots.teamMemberId = TeamMembers.id
        WHERE DATE(TimeSlots.startDateTime) BETWEEN ? AND ?
          AND TimeSlots.id NOT IN (
            SELECT TimeSlots.id
            FROM TimeSlots, TeamMemberTypicalAvailability
            WHERE TimeSlots.teamMemberId = TeamMemberTypicalAvailability.teamMemberId
              AND DAYOFWEEK(TimeSlots.startDateTime) - 1 = TeamMemberTypicalAvailability.dayOfWeek
              AND TIME(TimeSlots.startDateTime)
                BETWEEN TeamMemberTypicalAvailability.startTime AND TeamMemberTypicalAvailability.endTime
              AND TIME(TimeSlots.endDateTime)
                BETWEEN TeamMemberTypicalAvailability.startTime and TeamMemberTypicalAvailability.endTime
          )
        UNION
        -- Time slots marked as unavailable
        SELECT
          ${this.timeSlotColumnsSql},
          ${this.teamMemberColumnsSql}
        FROM TimeSlots
          JOIN TeamMembers ON TimeSlots.teamMemberId = TeamMembers.id
          JOIN TeamMemberAvailability
            ON TimeSlots.teamMemberId = TeamMemberAvailability.teamMemberId
          WHERE DATE(TimeSlots.startDateTime) BETWEEN ? AND ?
            AND TimeSlots.startDateTime
              BETWEEN TeamMemberAvailability.startDateTime AND TeamMemberAvailability.endDateTime
            OR TimeSlots.endDateTime
              BETWEEN TeamMemberAvailability.startDateTime AND TeamMemberAvailability.endDateTime
            OR (
              TimeSlots.startDateTime < TeamMemberAvailability.startDateTime
              AND TimeSlots.endDateTime > TeamMemberAvailability.endDateTime
            )
      `,
      [start, end, start, end]
    );

    if (!result.rows) return [];

    return result.rows.map((row: ITimeSlotTeamMemberRow) => {
      const timeSlot = this.mapTimeSlotColumns(row);
      timeSlot.teamMember = this.mapTeamMemberColumns(row);
      return timeSlot;
    });
  }

  public async findMaxWeeklyDaysViolations(
    start: Date,
    end: Date,
  ): Promise<[TeamMember, number][]> {
    return await Promise.resolve([]);
  }

  public async findMaxWeeklyHoursViolations(
    start: Date,
    end: Date,
  ): Promise<[TeamMember, number][]> {
    return await Promise.resolve([]);
  }
}
