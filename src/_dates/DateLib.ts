export default class DateLib {
  public static addDays(date: Date, days: number): Date {
    const newDate = new Date(date.getTime());
    newDate.setDate(newDate.getDate() + days);
    return newDate;
  }

  public static floorToSunday(date: Date): Date {
    return this.addDays(date, -date.getDay());
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

  public static getAge(birthDate: Date, today: Date): number {
    birthDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    let count = 0;

    while (true) {
      birthDate.setFullYear(birthDate.getFullYear() + 1);
      if (birthDate.getTime() > today.getTime()) break;
      count++;
    }

    return count;
  }
}
