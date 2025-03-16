import BetterDate from "../../../_dates/BetterDate.ts";
import DateLib from "../../../_dates/DateLib.ts";
import Schedule from "../../entities/Schedule.ts";
import TeamMember from "../../entities/TeamMember.ts";
import TimeSlot from "../../entities/TimeSlot.ts";

export default class ScheduleWeekViewModel {
  public currentWeek: Date;
  public schedule: Schedule;

  public externalAssigneeWarnings: TimeSlot[] = [];
  public bilocationWarnings: [TimeSlot, TimeSlot][] = [];
  public adultOnlyWarnings: TimeSlot[] = [];
  public preferenceWarnings: TimeSlot[] = [];
  public availabilityWarnings: TimeSlot[] = [];
  public maxWeeklyDaysWarnings: [TeamMember, number][] = [];
  public maxWeeklyHoursWarnings: [TeamMember, number][] = [];

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
    schedule: Schedule,
  ) {
    this.currentWeek = currentWeek;
    this.schedule = schedule;
  }

  private formatDatePath(date: Date): string {
    return BetterDate.fromDate(date).toDateString().replaceAll("-", "/");
  }

  public get clearLink(): string {
    const start = this.formatDatePath(this.currentWeek);
    const end = this.formatDatePath(DateLib.addDays(this.currentWeek, 6));
    return `/schedule/clear/${start}/to/${end}/`;
  }

  public get copyLink(): string {
    const start = this.formatDatePath(this.currentWeek);
    const end = this.formatDatePath(DateLib.addDays(this.currentWeek, 6));
    return `/schedule/copy/${start}/to/${end}/`;
  }

  public get exportLink(): string {
    const start = this.formatDatePath(this.currentWeek);
    const end = this.formatDatePath(DateLib.addDays(this.currentWeek, 6));
    return `/schedule/export/${start}/to/${end}/`;
  }

  /**
   * Get the view's title formatted as "Week of Month DD, YYYY"
   * @returns The title
   */
  public get title(): string {
    const monthName = this.monthNames[this.currentWeek.getMonth()];
    const date = this.currentWeek.getDate();
    const year = this.currentWeek.getFullYear();
    return `Week of ${monthName} ${date}, ${year}`;
  }

  /**
   * Get a list of dates for the current week
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

  /**
   * Get the string representation of the date one week before the current week
   * @returns
   */
  public get previousWeekString(): string {
    const previousWeek = new Date(this.currentWeek.getTime());
    previousWeek.setDate(previousWeek.getDate() - 7);
    return BetterDate.fromDate(previousWeek).toDateString().replaceAll(
      "-",
      "/",
    );
  }

  /**
   * Get the string representation of the date one week after the current week
   */
  public get nextWeekString(): string {
    const nextWeek = new Date(this.currentWeek.getTime());
    nextWeek.setDate(nextWeek.getDate() + 7);
    return BetterDate.fromDate(nextWeek).toDateString().replaceAll("-", "/");
  }
}
