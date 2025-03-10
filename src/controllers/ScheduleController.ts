import Context from "../_framework/Context.ts";
import Controller from "../_framework/Controller.ts";
import floorDate from "../_dates/floorDate.ts";
import ScheduleYearViewModel from "../models/viewModels/ScheduleYearViewModel.ts";

export default class ScheduleController extends Controller {
  constructor() {
    super();
    this.routes = [
      { method: "GET", pattern: "/(schedule\/)?", action: this.index },
      { method: "GET", pattern: "/schedule/(\\d{4})/", action: this.year },
      {
        method: "GET",
        pattern: "/schedule/(\\d{4})/(\\d{2})/(\\d{2})/",
        action: this.week,
      },
      { method: "GET", pattern: "/schedule/export/", action: this.exportGet },
      { method: "POST", pattern: "/schedule/export/", action: this.exportPost },
    ];
  }

  /**
   * Schedule index GET
   */
  public index(context: Context) {
    const year = new Date().getFullYear();
    return this.RedirectResponse(context, `/schedule/${year}/`);
  }

  /**
   * Schedule year GET
   */
  public year(context: Context) {
    const year = parseInt(context.match[1]);
    if (isNaN(year)) {
      return this.NotFoundResponse(context);
    }

    const calendar: { monthName: string, daysInMonth: number, initialDayOfWeek: number }[] = [];

    for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
      const firstOfMonth = new Date(year, monthIndex, 1);
      const monthName = firstOfMonth.toLocaleString('default', { month: 'long' });
      const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
      const initialDayOfWeek = firstOfMonth.getDay();

      calendar.push({monthName, daysInMonth, initialDayOfWeek});
    }

    const model = new ScheduleYearViewModel(context.csrf_token, year, calendar);
    return this.HTMLResponse(context, "./views/schedule/year.html", model);
  }

  /**
   * Schedule week GET
   */
  public async week(context: Context) {
  }

  /**
   * Schedule export GET
   */
  public async exportGet(context: Context) {
  }

  /**
   * Schedule export POST
   */
  public async exportPost(context: Context) {
  }
}
