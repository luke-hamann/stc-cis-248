export default class DateLib {
  public static addDays(date: Date, days: number): Date {
    const newDate = new Date(date.getTime());
    newDate.setUTCDate(newDate.getUTCDate() + days);
    return newDate;
  }

  public static floorDays(date: Date): Date {
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
}
