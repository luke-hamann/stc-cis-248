import Context from "../_framework/Context.ts";
import Controller from "../_framework/Controller.ts";
import DateLib from "../_dates/DateLib.ts";
import ScheduleRepository from "../models/repositories/ScheduleRepository.ts";
import ScheduleWeekViewModel from "../models/viewModels/ScheduleWeekViewModel.ts";
import ScheduleYearViewModel from "../models/viewModels/ScheduleYearViewModel.ts";
import ScheduleExportViewModel from "../models/viewModels/ScheduleExportViewModel.ts";
import BetterDate from "../_dates/BetterDate.ts";

export default class ScheduleController extends Controller {
  private schedules: ScheduleRepository;

  constructor(
    schedules: ScheduleRepository,
  ) {
    super();
    this.schedules = schedules;
    this.routes = [
      { method: "GET", pattern: "/(schedule\/)?", action: this.index },
      { method: "GET", pattern: "/schedule/(\\d{4})/", action: this.year },
      {
        method: "GET",
        pattern: "/schedule/(\\d{4})/(\\d{2})/(\\d{2})/",
        action: this.week,
      },
      {
        method: "GET",
        pattern:
          "/schedule/export/(\\d{4})/(\\d{2})/(\\d{2})/to/(\\d{4})/(\\d{2})/(\\d{2})/",
        action: this.exportGet,
      },
      {
        method: "POST",
        pattern:
          "/schedule/export/(\\d{4})/(\\d{2})/(\\d{2})/to/(\\d{4})/(\\d{2})/(\\d{2})/",
        action: this.exportPost,
      },
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

    const calendar: {
      monthName: string;
      daysInMonth: number;
      initialDayOfWeek: number;
    }[] = [];

    for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
      const firstOfMonth = new Date(year, monthIndex, 1);
      const monthName = firstOfMonth.toLocaleString("default", {
        month: "long",
      });
      const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
      const initialDayOfWeek = firstOfMonth.getDay();

      calendar.push({ monthName, daysInMonth, initialDayOfWeek });
    }

    const model = new ScheduleYearViewModel(context.csrf_token, year, calendar);
    return this.HTMLResponse(context, "./views/schedule/year.html", model);
  }

  /**
   * Schedule week GET
   */
  public async week(context: Context) {
    const [_, year, month, day] = context.match;
    const startDate = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
    );
    if (isNaN(startDate.getTime())) {
      return this.NotFoundResponse(context);
    }

    // If the start date is not a Sunday
    if (startDate.getDay() != 0) {
      let newDate = BetterDate.fromDate(startDate);
      newDate = newDate.floorToSunday();
      const component = newDate.toDateString().replaceAll("-", "/");
      const url = `/schedule/${component}/`;
      return this.RedirectResponse(context, url);
    }

    const endDate = DateLib.addDays(startDate, 6);
    const schedule = await this.schedules.getSchedule(startDate, endDate);

    const model = new ScheduleWeekViewModel(startDate, schedule);
    return this.HTMLResponse(context, "./views/schedule/week.html", model);
  }

  /**
   * Schedule export GET
   */
  public exportGet(context: Context) {
    const [_, y1, m1, d1, y2, m2, d2] = context.match;
    const start = new Date(parseInt(y1), parseInt(m1) - 1, parseInt(d1));
    const end = new Date(parseInt(y2), parseInt(m2) - 1, parseInt(d2));
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return this.NotFoundResponse(context);
    }

    const startBetterDate = BetterDate.fromDate(start);
    const endBetterDate = BetterDate.fromDate(end);
    const title =
      `Schedule ${startBetterDate.toDateString()} through ${endBetterDate.toDateString()}`;
    const model = new ScheduleExportViewModel(
      title,
      startBetterDate,
      endBetterDate,
      null,
      context.csrf_token,
    );

    return this.HTMLResponse(context, "./views/schedule/export.html", model);
  }

  /**
   * Schedule export POST
   */
  public async exportPost(context: Context) {
  }
}
