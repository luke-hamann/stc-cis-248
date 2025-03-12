import ShiftContext from "./ShiftContext.ts";
import ShiftContextNote from "./ShiftContextNote.ts";
import Substitute from "./Substitute.ts";
import TimeSlot from "./TimeSlot.ts";

export class DailyEntry {
  public shiftContextNote: ShiftContextNote | null;
  public timeSlots: TimeSlot[];

  constructor(shiftContextNote: ShiftContextNote | null, timeSlots: TimeSlot[]) {
    this.shiftContextNote = shiftContextNote;
    this.timeSlots = timeSlots;
  }
}

export class ShiftContextData {
  public shiftContext: ShiftContext;
  public dailyEntries: DailyEntry[];

  constructor(shiftContext: ShiftContext, dailyData: DailyEntry[]) {
    this.shiftContext = shiftContext;
    this.dailyEntries = dailyData;
  }
}

export default class Schedule {
  public startDate: Date;
  public endDate: Date;
  public shiftContextData: ShiftContextData[];
  public substitutes: Substitute[][];

  constructor(
    startDate: Date,
    endDate: Date,
    shiftContextData: ShiftContextData[],
    substitutes: Substitute[][],
  ) {
    this.startDate = startDate;
    this.endDate = endDate;
    this.shiftContextData = shiftContextData;
    this.substitutes = substitutes;
  }
}
