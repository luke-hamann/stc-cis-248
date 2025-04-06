import BetterDate from "../../../_dates/BetterDate.ts";
import CalendarMonthPage from "../../../_dates/CalendarMonthPage.ts";
import { DayOfWeek } from "../../entities/TypicalAvailability.ts";
import ViewModel from "./_ViewModel.ts";

/** A view model for rendering a calendar year */
export default class CalendarViewPartial extends ViewModel {
  /** The year of the calendar
   * @example 1776
   */
  public year: number;

  /** The base url where the calendar is rendered
   * @example /schedule/
   */
  public baseUrl: string;

  /** Constructs the view model
   * @param year
   * @param baseUrl
   */
  constructor(
    year: number,
    baseUrl: string,
  ) {
    super();
    this.year = year;
    this.baseUrl = baseUrl;
  }

  /** Gets the current date as a path in yyyy/mm/dd format
   * @example 1776/07/04
   * @returns The path
   */
  public get todayPath(): string {
    return BetterDate.fromDate(new Date()).toDateString("/");
  }

  /** Gets the calendar's content based on the year of the calendar
   * @returns An array of calendar month pages
   */
  public get calendar(): CalendarMonthPage[] {
    const calendar: CalendarMonthPage[] = [];

    for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
      const firstOfMonth = new Date(this.year, monthIndex, 1);
      const monthName = firstOfMonth.toLocaleString("default", {
        month: "long",
      });
      const daysInMonth = new Date(this.year, monthIndex + 1, 0).getDate();
      const initialDayOfWeek = firstOfMonth.getDay() as DayOfWeek;

      calendar.push(
        new CalendarMonthPage(monthName, daysInMonth, initialDayOfWeek),
      );
    }

    return calendar;
  }
}
