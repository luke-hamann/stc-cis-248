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

  public addDays(days: number): BetterDate {
    const newDate = new Date(this._date.getTime());
    newDate.setUTCDate(newDate.getUTCDate() + days);
    return new BetterDate(newDate.getTime());
  }

  public floorToSunday(): BetterDate {
    return this.addDays(-this._date.getUTCDay());
  }

  public get isoDate(): string {
    return this._date.toISOString().substring(0, 10);
  }

  public get isoDateSlashes(): string {
    return this.isoDate.replaceAll("-", "/");
  }
}
