import BetterDate from "../_dates/BetterDate.ts";
import Context from "../_framework/Context.ts";
import Controller from "../_framework/Controller.ts";
import DateLib from "../_dates/DateLib.ts";
import ExcelJS from "npm:exceljs";
import { ScheduleCell } from "../models/entities/Schedule.ts";
import { IScheduleRepository } from "../models/repositories/ScheduleRepository.ts";
import ScheduleWeekViewModel from "../models/viewModels/schedule/ScheduleWeekViewModel.ts";
import CalendarViewPartial from "../models/viewModels/_shared/CalendarViewPartial.ts";
import ScheduleExportViewModel from "../models/viewModels/schedule/ScheduleExportViewModel.ts";
import ResponseWrapper from "../_framework/ResponseWrapper.ts";

/** Handles the schedule year, week, and export pages */
export default class ScheduleController extends Controller {
  /** The schedule repository */
  private schedules: IScheduleRepository;

  /** Constructs the controller using the schedule repository
   * @param schedules The schedule repository
   */
  constructor(
    schedules: IScheduleRepository,
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

  /** Redirect from the index page to the schedule calendar for the current year
   * @param context The application context
   * @returns The response
   */
  public index(context: Context): ResponseWrapper {
    const year = new Date().getFullYear();
    return this.RedirectResponse(context, `/schedule/${year}/`);
  }

  /** Gets the schedule year calendar page
   * @param context The application context
   * @returns The response
   */
  public year(context: Context): ResponseWrapper {
    const year = parseInt(context.match[1]);
    if (isNaN(year)) {
      return this.NotFoundResponse(context);
    }

    const model = new CalendarViewPartial(
      year,
      "/schedule/",
    );
    return this.HTMLResponse(context, "./views/schedule/year.html", model);
  }

  /** Gets the schedule week editor page
   * @param context The application context
   * @returns The response
   */
  public async week(context: Context): Promise<ResponseWrapper> {
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
      const component = BetterDate.fromDate(startDate).floorToSunday()
        .toDateString(
          "/",
        );
      const url = `/schedule/${component}/`;
      return this.RedirectResponse(context, url);
    }

    const endDate = DateLib.addDays(startDate, 6);

    const schedule = await this.schedules.getSchedule(startDate, endDate);
    const warnings = await this.schedules.getWarnings(startDate, endDate);

    const model = new ScheduleWeekViewModel(startDate, schedule, warnings);

    return this.HTMLResponse(context, "./views/schedule/week.html", model);
  }

  /** Gets the scedule export form
   * @param context The application context
   * @returns The response
   */
  public exportGet(context: Context): ResponseWrapper {
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
      [],
    );

    return this.HTMLResponse(context, "./views/schedule/export.html", model);
  }

  /** Converts a schedule cell object to a plain text string based on its type
   *
   * Helper method
   *
   * @param cell The schedule cell
   * @returns The schedule cell's plain text string representation
   */
  public cellToString(cell: ScheduleCell): string {
    let value = "";

    switch (cell.type) {
      case "string":
        value = cell.content;
        break;
      case "header":
        value = cell.content;
        break;
      case "dateHeader":
        value = BetterDate.fromDate(cell.content)
          .toDateString();
        break;
      case "ShiftContext":
        value = cell.content.name;
        break;
      case "ShiftContextNote":
        value = cell.content.note;
        break;
      case "TimeSlotGroup":
        value = `${cell.content.startTime} - ${cell.content.endTime}${
          cell.content.requiresAdult ? "\n(18+)" : ""
        }`;
        break;
      case "TimeSlot":
        value = cell.content.teamMember?.fullName ?? "(unassigned)";
        if (cell.content.note) value += "\n" + cell.content.note;
        break;
      case "SubstituteList":
        value = cell.content.teamMembers.map((t) => t.fullName).join("\n");
        break;
    }

    return value;
  }

  /** Accepts requests to export the schedule to a file
   * @param context The application context
   * @returns The response
   */
  public async exportPost(context: Context): Promise<ResponseWrapper> {
    const model = await ScheduleExportViewModel.fromRequest(
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

    // Map the schedule table to a 2-dimensional array of strings
    const table: string[][] = [];
    for (const originalRow of schedule.table) {
      const newRow: string[] = [];
      for (const cell of originalRow) {
        newRow.push(this.cellToString(cell));
      }
      table.push(newRow);
    }

    if (model.format == "csv") {
      const csv = table.map((row) =>
        row.map((cell) => cell.replaceAll('"', '""')).map((cell) => `"${cell}"`)
          .join(",")
      ).join("\n");

      return this.AttachmentResponse(
        context,
        "text/csv",
        `${model.title}.csv`,
        csv,
      );
    }

    if (model.format == "excel") {
      const workbook = new ExcelJS.Workbook();
      workbook.created = new Date();
      const worksheet = workbook.addWorksheet("Schedule");

      worksheet.properties.defaultColWidth = 20;
      worksheet.getColumn(1).width = 35;

      for (const scheduleRow of schedule.table) {
        const row = worksheet.addRow(
          scheduleRow.map((cell) => this.cellToString(cell)),
        );

        row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
          cell.alignment = { wrapText: true };

          const sourceCell =
            schedule.table[parseInt(cell.row) - 1][colNumber - 1];

          if (
            ["dateHeader", "header", "ShiftContext"].includes(sourceCell.type)
          ) {
            cell.font = { bold: true };
          } else if (
            sourceCell.type == "ShiftContextNote" &&
            sourceCell.content.color != null
          ) {
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FF" + sourceCell.content.color.hex },
            };
            cell.font = {
              color: { argb: "FF" + sourceCell.content.color.hexForeground },
            };
          }
        });
      }

      return this.AttachmentResponse(
        context,
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        `${model.title}.xlsx`,
        await workbook.xlsx.writeBuffer() as ArrayBuffer,
      );
    }

    return this.NotFoundResponse(context);
  }
}
