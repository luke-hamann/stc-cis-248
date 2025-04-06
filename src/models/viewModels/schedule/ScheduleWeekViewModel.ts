import BetterDate from "../../../_dates/BetterDate.ts";
import DateLib from "../../../_dates/DateLib.ts";
import Schedule from "../../entities/Schedule.ts";
import ScheduleWarnings from "../../entities/ScheduleWarnings.ts";
import ViewModel from "../_shared/_ViewModel.ts";

/** The view model for the schedule week editor page */
export default class ScheduleWeekViewModel extends ViewModel {
  /** The first day of the schedule week being viewed */
  public currentWeek: Date;

  /** The schedule table */
  public schedule: Schedule | null;

  /** The schedule warnings */
  public warnings: ScheduleWarnings;

  /** Constructs the view model
   * @param currentWeek 
   * @param schedule 
   * @param warnings 
   */
  constructor(
    currentWeek: Date,
    schedule: Schedule | null,
    warnings: ScheduleWarnings,
  ) {
    super();
    this.currentWeek = currentWeek;
    this.schedule = schedule;
    this.warnings = warnings;
  }

  /** Formats a date as a string in yyyy/mm/dd format
   * @param date The date
   * @returns The string
   */
  private formatDatePath(date: Date): string {
    return BetterDate.fromDate(date).toDateString("/");
  }

  /** Generates a url to the form for clearing the current schedule week */
  public get clearLink(): string {
    const start = this.formatDatePath(this.currentWeek);
    const end = this.formatDatePath(DateLib.addDays(this.currentWeek, 6));
    return `/schedule/clear/${start}/through/${end}/`;
  }

  /** Generates a url to the form for copying the current schedule week k */
  public get copyLink(): string {
    const start = this.formatDatePath(this.currentWeek);
    const end = this.formatDatePath(DateLib.addDays(this.currentWeek, 6));
    return `/schedule/copy/${start}/through/${end}/`;
  }

  /** Generates url to the form for exporting the current schedule week */
  public get exportLink(): string {
    const start = this.formatDatePath(this.currentWeek);
    const end = this.formatDatePath(DateLib.addDays(this.currentWeek, 6));
    return `/schedule/export/${start}/to/${end}/`;
  }

  /** Get the view's title formatted as "Week of Month DD, YYYY"
   * @returns The title
   */
  public get title(): string {
    const dateString = this.currentWeek.toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return `Week of ${dateString}`;
  }

  /** Get a list of dates for the current week
   *
   * Always returns 7 elements
   *
   * @returns An array of dates
   */
  public get dates(): Date[] {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(this.currentWeek.getTime());
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  }

  /** Get the string representation of the date one week before the current week
   * @returns
   */
  public get previousWeekString(): string {
    const previousWeek = new Date(this.currentWeek.getTime());
    previousWeek.setDate(previousWeek.getDate() - 7);
    return BetterDate.fromDate(previousWeek).toDateString("/");
  }

  /** Get the string representation of the date one week after the current week */
  public get nextWeekString(): string {
    const nextWeek = new Date(this.currentWeek.getTime());
    nextWeek.setDate(nextWeek.getDate() + 7);
    return BetterDate.fromDate(nextWeek).toDateString("/");
  }
}
