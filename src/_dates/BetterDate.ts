export default class BetterDate {
  private _date: Date;

  public constructor(timestamp: number = new Date().getTime()) {
    this._date = new Date(timestamp);
  }

  /**
   * Creates a BetterDate object based on a Date object
   * @param date A Date object
   * @returns A BetterDate object
   */
  public static fromDate(date: Date): BetterDate {
    return new BetterDate(date.getTime());
  }

  /**
   * Converts the BetterDate object to a Date object
   * @returns The Date object
   */
  public toDate(): Date {
    return new Date(this._date.getTime());
  }

  /**
   * Formats the date in "YYYY MM DD" format using the given separator
   * @param sep Date component separator
   * @returns The date string
   */
  public toDateString(sep: string = "-"): string {
    const year = this._date.getFullYear();
    const month = (this._date.getMonth() + 1).toString().padStart(2, "0");
    const day = (this._date.getDate()).toString().padStart(2, "0");
    return `${year}${sep}${month}${sep}${day}`;
  }

  /**
   * Formats the date as a time string in HH:MM format
   * @returns The time string
   */
  public toTimeString(): string {
    const hours = this._date.getHours().toString().padStart(2, "0");
    const minutes = this._date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  public toString(): string {
    return `${this.toDateString()}T${this.toTimeString()}`;
  }

  public addDays(days: number): BetterDate {
    const newDate = new Date(this._date.getTime());
    newDate.setDate(newDate.getDate() + days);
    return new BetterDate(newDate.getTime());
  }

  public floorToSunday(): BetterDate {
    return this.addDays(-this._date.getDay());
  }
}
