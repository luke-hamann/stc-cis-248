/** A static class for performing date calculations */
export default class DateLib {
  /**
   * Adds a number of days to a date and returns the new date
   * @param date The original date
   * @param days A number of days to add
   * @returns The new date
   */
  public static addDays(date: Date, days: number): Date {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
  }

  /**
   * Rolls back a date to the most recent Sunday and returns the new date
   * 
   * The date does not change if it is a Sunday
   * @param date The date
   * @returns The new date
   */
  public static floorToSunday(date: Date): Date {
    return this.addDays(date, -date.getDay());
  }

  /**
   * Gets a list of dates within a date range, inclusive
   * @param start The start date
   * @param end The end date
   * @returns The list of dates within range
   */
  public static getDatesInRange(start: Date, end: Date): Date[] {
    const dates = [];

    let date = new Date(start);
    while (date.getTime() <= end.getTime()) {
      dates.push(date);
      date = this.addDays(date, 1);
    }

    return dates;
  }

  /**
   * Calculates the difference between 2 dates in days
   * @param date1 The first date
   * @param date2 The second date
   * @returns The difference in days
   */
  public static differenceInDays(date1: Date, date2: Date): number {
    return Math.round(
      (date2.getTime() - date1.getTime()) / (24 * 60 * 60 * 1000),
    );
  }
}
