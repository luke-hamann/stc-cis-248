import BetterDate from "../_dates/BetterDate.ts";
import DateLib from "../_dates/DateLib.ts";
import Context from "../_framework/Context.ts";
import Controller from "../_framework/Controller.ts";
import Color from "../models/entities/Color.ts";
import ShiftContextNote from "../models/entities/ShiftContextNote.ts";
import TimeSlot from "../models/entities/TimeSlot.ts";
import ColorRepository from "../models/repositories/ColorRepository.ts";
import ScheduleRepository from "../models/repositories/ScheduleRepository.ts";
import ShiftContextNoteRepository from "../models/repositories/ShiftContextNoteRepository.ts";
import ShiftContextRepository from "../models/repositories/ShiftContextRepository.ts";
import SubstituteRepository from "../models/repositories/SubstituteRepository.ts";
import TeamMemberRepository from "../models/repositories/TeamMemberRepository.ts";
import TimeSlotRepository from "../models/repositories/TimeSlotRepository.ts";
import AssigneeRecommendationsViewModel from "../models/viewModels/timeSlot/AssigneeRecommendationsViewModel.ts";
import DeleteViewModel from "../models/viewModels/_shared/DeleteViewModel.ts";
import ScheduleClearViewModel from "../models/viewModels/schedule/ScheduleClearViewModel.ts";
import ScheduleCopyViewModel from "../models/viewModels/schedule/ScheduleCopyViewModel.ts";
import TimeSlotEditViewModel from "../models/viewModels/timeSlot/TimeSlotEditViewModel.ts";
import ResponseWrapper from "../_framework/ResponseWrapper.ts";

/** Controls the time slot pages */
export default class TimeSlotController extends Controller {
  /** The shift context repository */
  private _shiftContexts: ShiftContextRepository;

  /** The team members repository */
  private _teamMembers: TeamMemberRepository;

  /** The colors repository */
  private _colors: ColorRepository;

  /** The schedule repository */
  private _schedule: ScheduleRepository;

  /** The shift context notes repository */
  private _shiftContextNotes: ShiftContextNoteRepository;

  /** The substitutes repository */
  private _substitutes: SubstituteRepository;

  /** The time slots repository */
  private _timeSlots: TimeSlotRepository;

  /**
   * Constucts the controller using the necessary repositories
   * @param shiftContexts The shift context repository
   * @param teamMembers The team members repository
   * @param colors The colors repository
   * @param schedule The schedule repository
   * @param shiftContextNotes The shift context notes repository
   * @param substitutes The substitutes repository
   * @param timeSlots The time slots repository
   */
  constructor(
    shiftContexts: ShiftContextRepository,
    teamMembers: TeamMemberRepository,
    colors: ColorRepository,
    schedule: ScheduleRepository,
    shiftContextNotes: ShiftContextNoteRepository,
    substitutes: SubstituteRepository,
    timeSlots: TimeSlotRepository,
  ) {
    super();
    this._shiftContexts = shiftContexts;
    this._teamMembers = teamMembers;
    this._colors = colors;
    this._schedule = schedule;
    this._shiftContextNotes = shiftContextNotes;
    this._substitutes = substitutes;
    this._timeSlots = timeSlots;
    this.routes = [
      {
        method: "GET",
        pattern: [
          "/schedule/time-slot/add/(shift-context/",
          "(\\d+)", // shift context id
          "/on/",
          "(\\d{4})", // start year
          "/",
          "(\\d{2})", // start month
          "/",
          "(\\d{2})", // start date
          "/from/",
          "(([01]\\d)|(2[0-3]))", // start hour
          ":",
          "([0-5]\\d)", // start minute
          "/to/",
          "(([01]\\d)|(2[0-3]))", // end hour
          ":",
          "([0-5]\\d)", // end minute
          "/",
          "((adult-only)/)?", // age requirement
          ")?",
        ].join(""),
        action: this.addGet,
      },
      {
        method: "POST",
        pattern: "/schedule/time-slot/add/",
        action: this.addPost,
      },
      {
        method: "GET",
        pattern: "/schedule/time-slot/(\\d+)/",
        action: this.editGet,
      },
      {
        method: "POST",
        pattern: "/schedule/time-slot/(\\d+)/",
        action: this.editPost,
      },
      {
        method: "GET",
        pattern: "/schedule/time-slot/(\\d+)/delete/",
        action: this.deleteGet,
      },
      {
        method: "POST",
        pattern: "/schedule/time-slot/(\\d+)/delete/",
        action: this.deletePost,
      },
      {
        method: "GET",
        pattern:
          "/schedule/copy/(\\d{4})/(\\d{2})/(\\d{2})/through/(\\d{4})/(\\d{2})/(\\d{2})/",
        action: this.copyGet,
      },
      {
        method: "POST",
        pattern:
          "/schedule/copy/(\\d{4})/(\\d{2})/(\\d{2})/through/(\\d{4})/(\\d{2})/(\\d{2})/",
        action: this.copyPost,
      },
      {
        method: "GET",
        pattern:
          "/schedule/clear/(\\d{4})/(\\d{2})/(\\d{2})/through/(\\d{4})/(\\d{2})/(\\d{2})/",
        action: this.clearGet,
      },
      {
        method: "POST",
        pattern:
          "/schedule/clear/(\\d{4})/(\\d{2})/(\\d{2})/through/(\\d{4})/(\\d{2})/(\\d{2})/",
        action: this.clearPost,
      },
      {
        method: "POST",
        pattern: "/schedule/time-slot/recommendations/",
        action: this.previewRecommendations,
      },
    ];
  }

  /**
   * Calculates a schedule cancel link url based on a date
   *
   * Floors the date to the most recent past Sunday to generate the url path
   *
   * @param date The original date
   * @returns The URL path
   */
  private getCancelLink(date?: Date): string {
    if (!date) {
      date = new Date();
    }

    const newDate = BetterDate.fromDate(date).floorToSunday().toDateString("/");
    return `/schedule/${newDate}/`;
  }

  /**
   * Gets a time slot based on the application context, null if not found
   * @param context The application context
   * @returns A time slot or null
   */
  private async getTimeSlot(context: Context): Promise<TimeSlot | null> {
    const id = parseInt(context.match[1]);
    if (isNaN(id)) {
      return null;
    }

    return await this._timeSlots.get(id);
  }

  /**
   * Gets the time slot add form
   * @param context The application context
   * @returns The response
   */
  public async addGet(context: Context): Promise<ResponseWrapper> {
    const timeSlot = TimeSlot.empty();

    // If we are attempting to prepopulate the form using route data
    if (context.match[1]) {
      const shiftContextId = Number(context.match[2]);
      if (this._shiftContexts.get(shiftContextId) == null) {
        return this.NotFoundResponse(context);
      }

      const year = Number(context.match[3]);
      const month = Number(context.match[4]);
      const day = Number(context.match[5]);
      const startHour = Number(context.match[6]);
      const startMinute = Number(context.match[9]);
      const endHour = Number(context.match[10]);
      const endMinute = Number(context.match[13]);
      const requiresAdult = context.match[15] != undefined;

      const startDateTime = new Date(
        year,
        month - 1,
        day,
        startHour,
        startMinute,
      );
      if (isNaN(startDateTime.getTime())) {
        return this.NotFoundResponse(context);
      }

      const endDateTime = new Date(year, month - 1, day, endHour, endMinute);

      timeSlot.shiftContextId = shiftContextId;
      timeSlot.startDateTime = startDateTime;
      timeSlot.endDateTime = endDateTime;
      timeSlot.requiresAdult = requiresAdult;
    }

    const model = new TimeSlotEditViewModel(
      await this._shiftContexts.list(),
      await this._teamMembers.list(),
      await this._schedule.getRecommendations(timeSlot),
      await this._colors.list(),
      timeSlot,
      Color.empty(),
      false,
      [],
      this.getCancelLink(),
    );

    return this.HTMLResponse(context, "./views/timeSlot/edit.html", model);
  }

  /**
   * Accepts requests to add a time slot
   * @param context The application context
   * @returns The response
   */
  public async addPost(context: Context): Promise<ResponseWrapper> {
    const model = await TimeSlotEditViewModel.fromRequest(context.request);

    model.errors = await this._timeSlots.validate(model.timeSlot);
    if (model.newColor) {
      model.errors.concat(await this._colors.validate(model.newColor));
    }

    if (!model.isValid()) {
      model.shiftContexts = await this._shiftContexts.list();
      model.teamMembers = await this._teamMembers.list();
      model.colors = await this._colors.list();
      model.recommendations = await this._schedule.getRecommendations(
        model.timeSlot,
      );
      model.isEdit = false;
      model.csrf_token = context.csrf_token;
      model.cancel = this.getCancelLink(new Date());
      return this.HTMLResponse(context, "./views/timeSlot/edit.html", model);
    }

    if (model.newColor) {
      const newColorId = await this._colors.add(model.newColor);
      model.timeSlot.colorId = newColorId;
    }

    await this._timeSlots.add(model.timeSlot);

    const url = this.getCancelLink(model.timeSlot.startDateTime!);
    return this.RedirectResponse(context, url);
  }

  /**
   * Gets the time slot edit form
   * @param context The application context
   * @returns The response
   */
  public async editGet(context: Context) {
    const timeSlot = await this.getTimeSlot(context);
    if (timeSlot == null) {
      return this.NotFoundResponse(context);
    }

    const model = new TimeSlotEditViewModel(
      await this._shiftContexts.list(),
      await this._teamMembers.list(),
      await this._schedule.getRecommendations(timeSlot),
      await this._colors.list(),
      timeSlot,
      null,
      true,
      [],
      this.getCancelLink(timeSlot.startDateTime!),
    );

    return this.HTMLResponse(context, "./views/timeSlot/edit.html", model);
  }

  /**
   * Accepts requests to edit a time slot
   * @param context The application context
   * @returns The response
   */
  public async editPost(context: Context): Promise<ResponseWrapper> {
    if (await this.getTimeSlot(context) == null) {
      return this.NotFoundResponse(context);
    }

    const model = await TimeSlotEditViewModel.fromRequest(context.request);
    model.timeSlot.id = parseInt(context.match[1]);

    model.errors = await this._timeSlots.validate(model.timeSlot);
    if (model.newColor) {
      model.errors.concat(await this._colors.validate(model.newColor));
    }

    if (!model.isValid()) {
      model.shiftContexts = await this._shiftContexts.list();
      model.teamMembers = await this._teamMembers.list();
      model.recommendations = await this._schedule.getRecommendations(
        model.timeSlot,
      );
      model.colors = await this._colors.list();
      model.isEdit = true;
      model.cancel = this.getCancelLink(
        model.timeSlot.startDateTime ?? new Date(),
      );
      return this.HTMLResponse(context, "./views/timeSlot/edit.html", model);
    }

    if (model.newColor) {
      const colorId = await this._colors.add(model.newColor);
      model.timeSlot.colorId = colorId;
    }

    await this._timeSlots.update(model.timeSlot);

    const url = this.getCancelLink(model.timeSlot.startDateTime!);
    return this.RedirectResponse(context, url);
  }

  /**
   * Gets the time slot delete confirmation form
   * @param context The application context
   * @returns The response
   */
  public async deleteGet(context: Context): Promise<ResponseWrapper> {
    const timeSlot = await this.getTimeSlot(context);
    if (timeSlot == null) {
      return this.NotFoundResponse(context);
    }

    const description = `${
      timeSlot.shiftContext!.name
    } (${timeSlot.startTimeString} - ${timeSlot.endTimeString})`;
    const action = `/schedule/time-slot/${timeSlot.id}/delete/`;
    const cancel = this.getCancelLink(timeSlot.startDateTime!);

    const model = new DeleteViewModel(
      description,
      action,
      cancel,
      [],
    );

    return this.HTMLResponse(context, "./views/_shared/delete.html", model);
  }

  /**
   * Accepts requests to delete a time slot
   * @param context The application context
   * @returns The response
   */
  public async deletePost(context: Context): Promise<ResponseWrapper> {
    const timeSlot = await this.getTimeSlot(context);
    if (timeSlot == null) {
      return this.NotFoundResponse(context);
    }

    await this._timeSlots.delete(timeSlot.id);

    const url = this.getCancelLink(timeSlot.startDateTime!);
    return this.RedirectResponse(context, url);
  }

  /**
   * Gets the time slot copy form
   * @param context The application context
   * @returns The response
   */
  public copyGet(context: Context): ResponseWrapper {
    const [_, y1, m1, d1, y2, m2, d2] = context.match;
    const start = new Date(parseInt(y1), parseInt(m1) - 1, parseInt(d1));
    const end = new Date(parseInt(y2), parseInt(m2) - 1, parseInt(d2));
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return this.NotFoundResponse(context);
    }

    const model = new ScheduleCopyViewModel(
      false,
      start,
      end,
      null,
      null,
      true,
      false,
      false,
      false,
      [],
    );

    return this.HTMLResponse(context, "./views/timeSlot/copy.html", model);
  }

  /**
   * Accepts requests to copy time slots
   *
   * The action operates in two modes: preview and confirm.
   * In preview mode, a form will display to confirm the copy.
   * In confirm mode, the time slots will actually be copied.
   *
   * @param context The application context
   * @returns The response
   */
  public async copyPost(context: Context) {
    const model = await ScheduleCopyViewModel.fromRequest(context.request);

    model.validate();
    if (!model.isValid()) {
      model.csrf_token = context.csrf_token;
      return this.HTMLResponse(context, "./views/timeSlot/copy.html", model);
    }

    const newTimeSlots = await this._timeSlots.calculateCopy(
      model.fromStartDate!,
      model.fromEndDate!,
      model.toStartDate!,
      model.toEndDate!,
      model.repeatCopy,
      model.includeAssignees,
      model.includeTimeSlotNotes,
    );

    let newShiftContextNotes: ShiftContextNote[] = [];
    if (model.includeShiftContextNotes) {
      newShiftContextNotes = await this._shiftContextNotes.calculateCopy(
        model.fromStartDate!,
        model.fromEndDate!,
        model.toStartDate!,
        model.toEndDate!,
        model.repeatCopy,
      );
    }

    // Preview mode
    if (!model.confirm) {
      model.newTimeSlots = newTimeSlots;
      model.newShiftContextNotes = newShiftContextNotes;
      model.csrf_token = context.csrf_token;
      return this.HTMLResponse(
        context,
        "./views/timeSlot/copyPreview.html",
        model,
      );
    }

    // Confirm mode
    await this._timeSlots.deleteInDateRange(
      model.toStartDate!,
      model.toEndDate!,
    );
    for (const timeSlot of newTimeSlots) {
      await this._timeSlots.add(timeSlot);
    }

    if (model.includeShiftContextNotes) {
      await this._shiftContextNotes.deleteInDateRange(
        model.toStartDate!,
        model.toEndDate!,
      );
      for (const shiftContextNote of newShiftContextNotes) {
        await this._shiftContextNotes.update(shiftContextNote);
      }
    }

    const url = this.getCancelLink(model.toStartDate!);
    return this.RedirectResponse(context, url);
  }

  /**
   * Gets the time slot copy form
   * @param context The application context
   * @returns The response
   */
  public clearGet(context: Context): ResponseWrapper {
    const [_, y1, m1, d1, y2, m2, d2] = context.match;
    const start = new Date(parseInt(y1), parseInt(m1) - 1, parseInt(d1));
    const end = new Date(parseInt(y2), parseInt(m2) - 1, parseInt(d2));
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return this.NotFoundResponse(context);
    }

    const model = ScheduleClearViewModel.default(
      start,
      end,
    );

    return this.HTMLResponse(context, "./views/timeSlot/clear.html", model);
  }

  /**
   * Accepts requests to clear a section of the schedule of time slots
   * @param context The application context
   * @returns The response
   */
  public async clearPost(context: Context): Promise<ResponseWrapper> {
    const model = await ScheduleClearViewModel.fromRequest(context.request);

    model.validate();
    if (!model.isValid()) {
      return this.HTMLResponse(context, "./views/timeSlot/clear.html", model);
    }

    if (model.deleteTimeSlots) {
      this._timeSlots.deleteInDateRange(model.startDate!, model.endDate!);
    }

    if (model.deleteSubstitutes) {
      this._substitutes.deleteDateRange(model.startDate!, model.endDate!);
    }

    if (model.deleteShiftContextNotes) {
      this._shiftContextNotes.deleteInDateRange(
        model.startDate!,
        model.endDate!,
      );
    }

    const url = this.getCancelLink(model.startDate!);
    return this.RedirectResponse(context, url);
  }

  /**
   * Accepts requests to render a time slot assignees recommendation HTML fragment
   * @param context The application context
   * @returns The resonse
   */
  public async previewRecommendations(
    context: Context,
  ): Promise<ResponseWrapper> {
    const timeSlot =
      (await TimeSlotEditViewModel.fromRequest(context.request)).timeSlot;
    const recommendations = await this._schedule.getRecommendations(timeSlot);
    const model = new AssigneeRecommendationsViewModel(
      timeSlot,
      recommendations,
    );
    return this.HTMLResponse(
      context,
      "./views/timeSlot/assigneeRecommendations.html",
      model,
    );
  }
}
