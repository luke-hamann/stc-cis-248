export default class ScheduleYearViewModel {
  public csrf_token: string;
  public year: number;
  public calendar: { daysInMonth: number; initialDayOfWeek: number }[];

  constructor(
    csrf_token: string,
    year: number,
    calendar: { daysInMonth: number; initialDayOfWeek: number }[],
  ) {
    this.csrf_token = csrf_token;
    this.year = year;
    this.calendar = calendar;
  }
}
