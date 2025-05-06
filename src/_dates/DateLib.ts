/** A static class for performing date calculations */
export default class DateLib {
  /** Adds a number of days to a date and returns the new date
   * @param date The original date
   * @param days A number of days to add
   * @returns The new date
   */
  public static addDays(date: Date, days: number): Date {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
  }

  /** Floors a date to the most recent past Sunday and returns the new date
   *
   * The date does not change if it is a Sunday
   *
   * @param date The date
   * @returns The new date
   */
  public static floorToSunday(date: Date): Date {
    return this.addDays(date, -date.getDay());
  }

  /** Gets an array of dates within a date range, inclusive
   * @param start The start date
   * @param end The end date
   * @returns The array of dates within the range
   */
  public static getDatesInRange(start: Date, end: Date): Date[] {
    const dates = [];

    let date = new Date(start);
    date.setHours(0, 0, 0, 0);
    while (date <= end) {
      dates.push(new Date(date));
      date = this.addDays(date, 1);
    }

    return dates;
  }

  /** Calculates the difference between 2 dates in days
   * @param date1 The first date
   * @param date2 The second date
   * @returns The difference in days
   */
  public static differenceInDays(date1: Date, date2: Date): number {
    return Math.round(
      (date2.getTime() - date1.getTime()) / (24 * 60 * 60 * 1000),
    );
  }

  /** Calculates an age on a date given a birth date
   * @param birthDate The birth date
   * @param date The date to calculate the age for
   * @returns An age in years
   */
  public static getAge(birthDate: Date, date: Date): number {
    const start = new Date(birthDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(0, 0, 0, 0);

    let count = 0;

    while (true) {
      start.setFullYear(start.getFullYear() + 1);
      if (start.getTime() > end.getTime()) break;
      count++;
    }

    return count;
  }
}
