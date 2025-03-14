import BetterDate from "../../_dates/BetterDate.ts";

export default class CalendarYearViewModel {
  public title: string;
  public csrf_token: string;
  public year: number;
  public baseUrl: string;

  constructor(
    title: string,
    csrf_token: string,
    year: number,
    baseUrl: string,
  ) {
    this.title = title;
    this.csrf_token = csrf_token;
    this.year = year;
    this.baseUrl = baseUrl;
  }

  public get todayPath(): string {
    return BetterDate.fromDate(new Date()).toDateString().replaceAll("-", "/");
  }

  public get calendar() {
    const calendar: {
      monthName: string;
      daysInMonth: number;
      initialDayOfWeek: number;
    }[] = [];

    for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
      const firstOfMonth = new Date(this.year, monthIndex, 1);
      const monthName = firstOfMonth.toLocaleString("default", {
        month: "long",
      });
      const daysInMonth = new Date(this.year, monthIndex + 1, 0).getDate();
      const initialDayOfWeek = firstOfMonth.getDay();

      calendar.push({ monthName, daysInMonth, initialDayOfWeek });
    }

    return calendar;
  }
}
