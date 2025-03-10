import Context from "../_framework/Context.ts";
import Controller from "../_framework/Controller.ts";
import DateLib from "../_dates/DateLib.ts";
import ScheduleWeekViewModel from "../models/viewModels/ScheduleWeekViewModel.ts";
import ScheduleYearViewModel from "../models/viewModels/ScheduleYearViewModel.ts";
import ShiftContextNoteRepository from "../models/repositories/ShiftContextNoteRepository.ts";
import SubstituteRepository from "../models/repositories/SubstituteRepository.ts";
import TimeSlotRepository from "../models/repositories/TimeSlotRepository.ts";

export default class ScheduleController extends Controller {
  private timeSlotRepository: TimeSlotRepository;
  private substituteRepository: SubstituteRepository;
  private shiftContextNoteRepository: ShiftContextNoteRepository;

  constructor(
    timeSlotRepository: TimeSlotRepository,
    substituteRepository: SubstituteRepository,
    shiftContextNoteRepository: ShiftContextNoteRepository,
  ) {
    super();
    this.timeSlotRepository = timeSlotRepository;
    this.substituteRepository = substituteRepository;
    this.shiftContextNoteRepository = shiftContextNoteRepository;
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
    const year = context.match[1];
    const month = context.match[2];
    const day = context.match[3];
    const timestamp = Date.parse(`${year}-${month}-${day}`);
    if (isNaN(timestamp)) {
      return this.NotFoundResponse(context);
    }

    const startDate = new Date(timestamp);

    if (startDate.getUTCDay() != 0) {
      const newDate = DateLib.floorDays(startDate).toISOString().slice(0, 10)
        .replaceAll(
          "-",
          "/",
        );
      return this.RedirectResponse(context, `/schedule/${newDate}/`);
    }

    const endDate = new Date(startDate.getTime());
    endDate.setDate(endDate.getUTCDate() + 6);

    const timeSlots = await this.timeSlotRepository.getTimeslotsInRange(
      startDate,
      endDate,
    );

    const shiftContextNotes = await this.shiftContextNoteRepository
      .getShiftContextNotesInRange(
        startDate,
        endDate,
      );

    const substitutes = await this.substituteRepository.getSubstitutesInRange(
      startDate,
      endDate,
    );

    const model = new ScheduleWeekViewModel(
      startDate,
      timeSlots,
      shiftContextNotes,
      substitutes,
    );
    return this.HTMLResponse(context, "./views/schedule/week.html", model);
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
