import BetterDate from "../_dates/BetterDate.ts";
import Context from "../_framework/Context.ts";
import Controller from "../_framework/Controller.ts";
import DateLib from "../_dates/DateLib.ts";
import ScheduleRepository from "../models/repositories/ScheduleRepository.ts";
import ScheduleWeekViewModel from "../models/viewModels/ScheduleWeekViewModel.ts";
import ScheduleYearViewModel from "../models/viewModels/ScheduleYearViewModel.ts";
import ScheduleExportFormViewModel from "../models/viewModels/ScheduleExportViewModel.ts";

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
    const model = new ScheduleExportFormViewModel(
      title,
      startBetterDate,
      endBetterDate,
      null,
      context.csrf_token,
      [],
    );

    return this.HTMLResponse(context, "./views/schedule/export.html", model);
  }

  /**
   * Schedule export POST
   */
  public async exportPost(context: Context) {
    const model = await ScheduleExportFormViewModel.fromRequest(
      context.request,
    );

    model.validate();
    if (!model.isValid()) {
      model.csrf_token = context.csrf_token;
      return this.HTMLResponse(context, "./views/schedule/export.html", model);
    }

    const schedule = await this.schedules.getSchedule(
      model.startDate!.toDate(),
      model.endDate!.toDate(),
    );

    if (model.format == "csv") {
      // Map the schedule table to a 2-dimensional array of strings
      const destinationTable: string[][] = [];
      for (const sourceRow of schedule.table) {
        const destinationRow: string[] = [];
        for (const sourceCell of sourceRow) {
          let destinationCell: string = "";
          switch (sourceCell.type) {
            case "string":
              destinationCell = sourceCell.content;
              break;
            case "header":
              destinationCell = sourceCell.content;
              break;
            case "dateHeader":
              destinationCell = BetterDate.fromDate(sourceCell.content)
                .toDateString();
              break;
            case "ShiftContext":
              destinationCell = sourceCell.content.name;
              break;
            case "ShiftContextNote":
              destinationCell = sourceCell.content.note;
              break;
            case "TimeSlotGroup":
              destinationCell =
                `${sourceCell.content.startTime} - ${sourceCell.content.endTime}${
                  sourceCell.content.requiresAdult ? "\nj(18+)" : ""
                }`;
              break;
            case "TimeSlot":
              destinationCell = sourceCell.content.teamMember?.fullName ?? "";
              break;
            case "SubstituteList":
              destinationCell = sourceCell.content.teamMembers.map((t) =>
                t.fullName
              ).join("\n");
              break;
          }
          destinationRow.push(destinationCell);
        }
        destinationTable.push(destinationRow);
      }

      const csvContents = destinationTable.map((row) =>
        row.map((cell) => cell.replaceAll('"', '""')).map((cell) => `"${cell}"`)
          .join(",")
      ).join("\n");

      context.response.headers.set("Content-Type", "text/plain");
      context.response.headers.set(
        "Content-Disposition",
        `attachment; filename="${model.title}.csv"`,
      );
      context.response.body = csvContents;
      return context.response;
    } else if (model.format == "excel") {
      ;
    }
  }
}
