/** A wrapper class for Date objects that makes common date operations available */
export default class BetterDate {
  /** The date object being wrapped */
  private _date: Date;

  /** Constructs a BetterDate object based on a Unix Epoch
   * @param timestamp The Unix Epoch
   */
  public constructor(timestamp: number = new Date().getTime()) {
    this._date = new Date(timestamp);
  }

  /** Constructs a BetterDate object based on a Date object
   * @param date A Date object
   * @returns A BetterDate object
   */
  public static fromDate(date: Date): BetterDate {
    return new BetterDate(date.getTime());
  }

  /** Converts the BetterDate object to a Date object
   * @returns The Date object
   */
  public toDate(): Date {
    return new Date(this._date.getTime());
  }

  /** Formats the date in "YYYY MM DD" format using the given separator
   * @param sep Date component separator
   * @returns The date string
   */
  public toDateString(sep: string = "-"): string {
    const year = this._date.getFullYear();
    const month = (this._date.getMonth() + 1).toString().padStart(2, "0");
    const day = (this._date.getDate()).toString().padStart(2, "0");
    return [year, month, day].join(sep);
  }

  /** Formats the date as a time string in HH:MM format
   * @returns The time string
   */
  public toTimeString(): string {
    const hours = this._date.getHours().toString().padStart(2, "0");
    const minutes = this._date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  /** Converts the date and time to a string representation
   *
   * Formatted as "yyyy-mm-ddThh:ii"
   *
   * @returns The string
   */
  public toString(): string {
    return `${this.toDateString()}T${this.toTimeString()}`;
  }

  /** Returns a new BetterDate after adding days to the current BetterDate
   * @param days The number of days to add
   * @returns The new date
   */
  public addDays(days: number): BetterDate {
    const newDate = new Date(this._date.getTime());
    newDate.setDate(newDate.getDate() + days);
    return new BetterDate(newDate.getTime());
  }

  /** Returns a new BetterDate after flooring the current BetterDate to the most recent past Sunday
   * @returns The new date
   */
  public floorToSunday(): BetterDate {
    return this.addDays(-this._date.getDay());
  }
}
