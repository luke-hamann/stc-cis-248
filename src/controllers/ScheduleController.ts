import Context from "../_framework/Context.ts";
import Controller from "../_framework/Controller.ts";
import DateLib from "../_dates/DateLib.ts";
import Schedule from "../models/entities/Schedule.ts";
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
      const daysInMonth = new Date(year, monthIndex + 1, 0).getUTCDate();
      const initialDayOfWeek = firstOfMonth.getUTCDay();

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
    const timestamp = Date.parse(`${year}-${month}-${day}`);
    if (isNaN(timestamp)) {
      return this.NotFoundResponse(context);
    }

    const startDate = new Date(timestamp);

    // If the start date is not a Sunday
    if (startDate.getUTCDay() != 0) {
      const newDate = DateLib.floorToSunday(startDate).toISOString().slice(
        0,
        10,
      )
        .replaceAll(
          "-",
          "/",
        );
      return this.RedirectResponse(context, `/schedule/${newDate}/`);
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
    const timestamp1 = Date.parse(`${y1}-${m1}-${d1}`);
    const timestamp2 = Date.parse(`${y2}-${m2}-${d2}`);
    if (isNaN(timestamp1) || isNaN(timestamp2)) {
      return this.NotFoundResponse(context);
    }

    const start = new BetterDate(timestamp1);
    const end = new BetterDate(timestamp2);
    const title = `Schedule ${start.isoDate} through ${end.isoDate}`;
    const model = new ScheduleExportViewModel(
      title,
      start,
      end,
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
