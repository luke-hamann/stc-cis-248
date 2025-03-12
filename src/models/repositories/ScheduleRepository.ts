import DateLib from "../../_dates/DateLib.ts";
import Schedule, {
  ScheduleCell,
  ScheduleRow,
  ScheduleTable,
} from "../entities/Schedule.ts";
import ShiftContextNote from "../entities/ShiftContextNote.ts";
import ShiftContextNoteRepository from "./ShiftContextNoteRepository.ts";
import ShiftContextRepository from "./ShiftContextRepository.ts";
import Substitute from "../entities/Substitute.ts";
import SubstituteRepository from "./SubstituteRepository.ts";
import TimeSlot from "../entities/TimeSlot.ts";
import TimeSlotRepository from "./TimeSlotRepository.ts";
import ShiftContext from "../entities/ShiftContext.ts";

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
    const table: ScheduleTable = [];
    const dateList = DateLib.getDatesInRange(start, end);

    table.push([
      new ScheduleCell("string", ""),
      ...dateList.map((date) => new ScheduleCell("dateHeader", date)),
    ]);

    const shiftContexts = await this.shiftContexts.list();
    for (const shiftContext of shiftContexts) {
      // Shift context header row
      const row: ScheduleRow = [{
        type: "ShiftContext",
        content: shiftContext,
      }];
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
      table.push(row);
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
    table.push(substitutesRow);

    return new Schedule("", start, end, table);
  }
}
