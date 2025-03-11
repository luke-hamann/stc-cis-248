import Schedule from "../entities/Schedule.ts";

export default class ScheduleWeekViewModel {
  public currentWeek: Date;
  public schedule: Schedule;

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

  /**
   * Get the view's title formatted as "Week of Month DD, YYYY"
   * @returns The title
   */
  public get title(): string {
    const monthName = this.monthNames[this.currentWeek.getUTCMonth()];
    const date = this.currentWeek.getUTCDate();
    const year = this.currentWeek.getUTCFullYear();
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
      date.setUTCDate(date.getUTCDate() + i);
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
    previousWeek.setUTCDate(previousWeek.getUTCDate() - 7);
    return previousWeek.toISOString().substring(0, 10).replaceAll("-", "/");
  }

  /**
   * Get the string representation of the date one week after the current week
   */
  public get nextWeekString(): string {
    const nextWeek = new Date(this.currentWeek.getTime());
    nextWeek.setUTCDate(nextWeek.getUTCDate() + 7);
    return nextWeek.toISOString().substring(0, 10).replaceAll("-", "/");
  }
}
