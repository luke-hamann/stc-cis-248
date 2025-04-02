import BetterDate from "../../../_dates/BetterDate.ts";
import IViewModel from "./IViewModel.ts";

export default class CalendarViewPartial implements IViewModel {
  public year: number;
  public baseUrl: string;
  public csrf_token: string;

  constructor(
    year: number,
    baseUrl: string,
  ) {
    this.year = year;
    this.baseUrl = baseUrl;
    this.csrf_token = "";
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
