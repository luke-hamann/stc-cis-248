export default class DateLib {
  public static addDays(date: Date, days: number): Date {
    const newDate = new Date(date.getTime());
    newDate.setUTCDate(newDate.getUTCDate() + days);
    return newDate;
  }

  public static floorToSunday(date: Date): Date {
    return this.addDays(date, -date.getUTCDay());
  }

  public static getDatesInRange(start: Date, end: Date): Date[] {
    const dates = [];

    let date = new Date(start.getTime());
    while (date.getTime() <= end.getTime()) {
      dates.push(date);
      date = this.addDays(date, 1);
    }

    return dates;
  }

  public static differenceInDays(date1: Date, date2: Date): number {
    return Math.round(
      (date2.getTime() - date1.getTime()) / (24 * 60 * 60 * 1000),
    );
  }
}
