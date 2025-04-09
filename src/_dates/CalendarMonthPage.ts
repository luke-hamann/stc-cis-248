import { DayOfWeek } from "./DayOfWeek.ts";

/** A class representing a month page in a calendar */
export default class CalendarMonthPage {
  /** The name of the month */
  public monthName: string = "";

  /** The number of days in the month */
  public daysInMonth: number = 0;

  /** The initial day of the week of the month
   */
  public initialDayOfWeek: DayOfWeek = 0;

  public constructor(
    monthName: string,
    daysInMonth: number,
    initialDayOfWeek: DayOfWeek,
  ) {
    this.monthName = monthName;
    this.daysInMonth = daysInMonth;
    this.initialDayOfWeek = initialDayOfWeek;
  }
}
