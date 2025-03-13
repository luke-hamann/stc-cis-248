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

export default class ScheduleRepository {
  private shiftContexts: ShiftContextRepository;
  private shiftContextNotes: ShiftContextNoteRepository;
  private timeSlots: TimeSlotRepository;
  private substitutes: SubstituteRepository;

  constructor(
    shiftContextRepository: ShiftContextRepository,
    shiftContextNoteRepository: ShiftContextNoteRepository,
    timeSlotRepository: TimeSlotRepository,
    substituteRepository: SubstituteRepository,
  ) {
    this.shiftContexts = shiftContextRepository;
    this.shiftContextNotes = shiftContextNoteRepository;
    this.timeSlots = timeSlotRepository;
    this.substitutes = substituteRepository;
  }

  public async getSchedule(start: Date, end: Date): Promise<Schedule> {
    const scheduleTable: ScheduleTable = [];
    const dateList = DateLib.getDatesInRange(start, end);

    // column headers
    scheduleTable.push([
      new ScheduleCell("string", ""),
      ...dateList.map((date) => new ScheduleCell("dateHeader", date)),
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

        const cell = new ScheduleCell("ShiftContextNote", shiftContextNote);
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

            let newCell = new ScheduleCell("string", "");
            if (timeSlot) {
              newCell = new ScheduleCell("TimeSlot", timeSlot);
            }

            // Swapped row and column to transpose array
            targetArray[colNum][rowNum] = newCell;
          }
        }

        // Insert header cell at start of each row
        for (let i = 0; i < targetArray.length; i++) {
          targetArray[i].unshift(
            new ScheduleCell("TimeSlotGroup", timeSlotGroup),
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
      const cell = new ScheduleCell("SubstituteList", substituteList);
      substitutesRow.push(cell);
    }
    scheduleTable.push(substitutesRow);

    return new Schedule("", start, end, scheduleTable);
  }
}
