export default class DateLib {
  public static addDays(date: Date, days: number): Date {
    const newDate = new Date(date.getTime());
    newDate.setUTCDate(newDate.getUTCDate() - days);
    return newDate;
  }

  public static floorDays(date: Date): Date {
    return this.addDays(date, date.getUTCDay());
  }
}
