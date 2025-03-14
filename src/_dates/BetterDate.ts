export default class BetterDate {
  private _date: Date;

  public constructor(timestamp: number) {
    this._date = new Date(timestamp);
  }

  public static fromDate(date: Date): BetterDate {
    return new BetterDate(date.getTime());
  }

  public toDate(): Date {
    return new Date(this._date.getTime());
  }

  /**
   * Formats the date in "YYYY-MM-DD" format
   * @returns The date string
   */
  public toDateString(): string {
    const year = this._date.getFullYear();
    const month = (this._date.getMonth() + 1).toString().padStart(2, "0");
    const day = (this._date.getDate()).toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

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
