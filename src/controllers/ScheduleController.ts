import BetterDate from "../_dates/BetterDate.ts";
import Context from "../_framework/Context.ts";
import Controller from "../_framework/Controller.ts";
import DateLib from "../_dates/DateLib.ts";
import ExcelJS from "npm:exceljs";
import { ScheduleCell } from "../models/entities/Schedule.ts";
import ScheduleRepository from "../models/repositories/ScheduleRepository.ts";
import ScheduleWeekViewModel from "../models/viewModels/schedule/ScheduleWeekViewModel.ts";
import CalendarViewPartial from "../models/viewModels/_shared/CalendarViewPartial.ts";
import ScheduleExportFormViewModel from "../models/viewModels/schedule/ScheduleExportViewModel.ts";

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

    const model = new CalendarViewPartial(
      year,
      "/schedule/",
    );
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

    // Warnings
    model.externalAssigneeWarnings = await this.schedules.findWithExternalAssignees(startDate, endDate);
    model.bilocationWarnings = await this.schedules.findBilocation(startDate, endDate);
    model.adultOnlyWarnings = await this.schedules.findAdultOnlyViolations(startDate, endDate);
    model.preferenceWarnings = await this.schedules.findPreferenceViolations(startDate, endDate);
    model.availabilityWarnings = await this.schedules.findAvailabilityViolations(startDate, endDate);
    model.maxWeeklyDaysWarnings = await this.schedules.findMaxWeeklyDaysViolations(startDate, endDate);
    model.maxWeeklyHoursWarnings = await this.schedules.findMaxWeeklyHoursViolations(startDate, endDate);

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
        value = cell.content.teamMember?.fullName ?? "";
        break;
      case "SubstituteList":
        value = cell.content.teamMembers.map((t) => t.fullName).join("\n");
        break;
    }

    return value;
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

      context.response.headers.set("Content-Type", "text/plain");
      context.response.headers.set(
        "Content-Disposition",
        `attachment; filename="${model.title}.csv"`,
      );
      context.response.body = csv;
      return context.response;
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
            const argb = "FF" + sourceCell.content.color.hex;
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb },
            };
          }
        });
      }

      context.response.headers.set(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      );
      context.response.headers.set(
        "Content-Disposition",
        `attachment; filename="${model.title}.xlsx"`,
      );
      context.response.body = await workbook.xlsx.writeBuffer() as ArrayBuffer;
      return context.response;
    }
  }
}
