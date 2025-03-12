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
import TimeSlotGroup from "../entities/TimeSlotGroup.ts";

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
      table.push(row);

      // Time slot groups under shift context
      const timeSlotGroups = await this.timeSlots.getGroups(
        shiftContext.id,
        start,
        end,
      );
      for (const timeSlotGroup of timeSlotGroups) {
        const timeSlots = await this.timeSlots.getInGroup(timeSlotGroup);
        const rows: ScheduleTable = [];

        // initialize the first row
        const row: ScheduleRow = [
          new ScheduleCell("TimeSlotGroup", timeSlotGroup),
        ];

        for (const date of dateList) {
        }

        // for (let i = 0; i < dateCount; i++) {
        //   row.push(new ScheduleCell("string", ""));
        // }

        rows.push(row);

        table.push(...rows);
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
    table.push(substitutesRow);

    return new Schedule("", start, end, table);
  }
}
