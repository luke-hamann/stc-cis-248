import ShiftContextNote from "../entities/ShiftContextNote.ts";
import Substitute from "../entities/Substitute.ts";
import TimeSlot from "../entities/TimeSlot.ts";

export default class ScheduleWeekViewModel {
  public currentWeek: Date;
  public timeSlots: TimeSlot[];
  public shiftContextNotes: ShiftContextNote[];
  public substitutes: Substitute[];

  private readonly monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "Semptember",
    "October",
    "November",
    "December",
  ];

  constructor(
    currentWeek: Date,
    timeSlots: TimeSlot[],
    shiftContextNotes: ShiftContextNote[],
    substitutes: Substitute[],
  ) {
    this.currentWeek = currentWeek;
    this.timeSlots = timeSlots;
    this.shiftContextNotes = shiftContextNotes;
    this.substitutes = substitutes;
  }

  /**
   * Get the view's title formatted as "Week of Month DD, YYYY"
   */
  public get title() {
    const monthName = this.monthNames[this.currentWeek.getUTCMonth()];
    const date = this.currentWeek.getUTCDate();
    const year = this.currentWeek.getUTCFullYear();
    return `Week of ${monthName} ${date}, ${year}`;
  }

  public get dates(): Date[] {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(this.currentWeek.getTime());
      date.setUTCDate(date.getUTCDate() + i);
      dates.push(date);
    }
    return dates;
  }

  public get previousWeekString() {
    const previousWeek = new Date(this.currentWeek.getTime());
    previousWeek.setUTCDate(previousWeek.getUTCDate() - 7);
    return previousWeek.toISOString().substring(0, 10).replaceAll("-", "/");
  }

  public get nextWeekString() {
    const nextWeek = new Date(this.currentWeek.getTime());
    nextWeek.setUTCDate(nextWeek.getUTCDate() + 7);
    return nextWeek.toISOString().substring(0, 10).replaceAll("-", "/");
  }
}
