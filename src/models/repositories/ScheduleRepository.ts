import DateLib from "../../_dates/DateLib.ts";
import Schedule, {
  DailyEntry,
  ShiftContextData,
} from "../entities/Schedule.ts";
import ShiftContextNote from "../entities/ShiftContextNote.ts";
import ShiftContextNoteRepository from "./ShiftContextNoteRepository.ts";
import ShiftContextRepository from "./ShiftContextRepository.ts";
import Substitute from "../entities/Substitute.ts";
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
    const schedule = new Schedule(start, end, [], []);

    // Get the shift context data
    const shiftContexts = await this.shiftContexts.list();
    for (const shiftContext of shiftContexts) {
      const shiftContextData = new ShiftContextData(shiftContext, []);

      for (const date of DateLib.getDatesInRange(start, end)) {
        const entry = new DailyEntry(
          await this.shiftContextNotes.get(shiftContext.id, date),
          await this.timeSlots.list(shiftContext.id, date),
        );
        shiftContextData.dailyEntries.push(entry);
      }

      schedule.shiftContextData.push(shiftContextData);
    }

    // Get the substitutes by date
    for (const date of DateLib.getDatesInRange(start, end)) {
      schedule.substitutes.push(
        await this.substitutes.getOnDate(date),
      );
    }

    return schedule;
  }
}
