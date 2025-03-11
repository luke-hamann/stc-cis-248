import DateLib from "../_dates/DateLib.ts";
import Context from "../_framework/Context.ts";
import Controller from "../_framework/Controller.ts";
import Color from "../models/entities/Color.ts";
import TimeSlot from "../models/entities/TimeSlot.ts";
import ColorRepository from "../models/repositories/ColorRepository.ts";
import ShiftContextNoteRepository from "../models/repositories/ShiftContextNoteRepository.ts";
import ShiftContextRepository from "../models/repositories/ShiftContextRepository.ts";
import SubstituteRepository from "../models/repositories/SubstituteRepository.ts";
import TeamMemberRepository from "../models/repositories/TeamMemberRepository.ts";
import TimeSlotRepository from "../models/repositories/TimeSlotRepository.ts";
import DeleteViewModel from "../models/viewModels/DeleteViewModel.ts";
import ScheduleClearViewModel from "../models/viewModels/ScheduleClearViewModel.ts";
import ScheduleCopyViewModel from "../models/viewModels/ScheduleCopyViewModel.ts";
import TimeSlotEditViewModel from "../models/viewModels/TimeSlotEditViewModel.ts";

export default class TimeSlotController extends Controller {
  private shiftContexts: ShiftContextRepository;
  private teamMembers: TeamMemberRepository;
  private colors: ColorRepository;
  private shiftContextNotes: ShiftContextNoteRepository;
  private substitutes: SubstituteRepository;
  private timeSlots: TimeSlotRepository;

  constructor(
    shiftContexts: ShiftContextRepository,
    teamMembers: TeamMemberRepository,
    colors: ColorRepository,
    shiftContextNotes: ShiftContextNoteRepository,
    substitutes: SubstituteRepository,
    timeSlots: TimeSlotRepository,
  ) {
    super();
    this.shiftContexts = shiftContexts;
    this.teamMembers = teamMembers;
    this.colors = colors;
    this.shiftContextNotes = shiftContextNotes;
    this.substitutes = substitutes;
    this.timeSlots = timeSlots;
    this.routes = [
      {
        method: "GET",
        pattern: "/schedule/time-slot/add/",
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
          "/schedule/copy/(\\d{4})/(\\d{2})/(\\d{2})/to/(\\d{4})/(\\d{2})/(\\d{2})/",
        action: this.copyGet,
      },
      {
        method: "POST",
        pattern:
          "/schedule/copy/(\\d{4})/(\\d{2})/(\\d{2})/to/(\\d{4})/(\\d{2})/(\\d{2})/",
        action: this.copyPost,
      },
      {
        method: "GET",
        pattern: "/schedule/time-slot/copy-confirm/",
        action: this.copyConfirmGet,
      },
      {
        method: "POST",
        pattern: "/schedule/time-slot/copy-confirm/",
        action: this.copyConfirmPost,
      },
      {
        method: "GET",
        pattern:
          "/schedule/clear/(\\d{4})/(\\d{2})/(\\d{2})/to/(\\d{4})/(\\d{2})/(\\d{2})/",
        action: this.clearGet,
      },
      {
        method: "POST",
        pattern:
          "/schedule/clear/(\\d{4})/(\\d{2})/(\\d{2})/to/(\\d{4})/(\\d{2})/(\\d{2})/",
        action: this.clearPost,
      },
    ];
  }

  /**
   * Gets a time slot based on the application context, null if not found
   * @param context App context
   * @returns A time slot or null
   */
  private async getTimeSlot(context: Context): Promise<TimeSlot | null> {
    const id = parseInt(context.match[1]);
    if (isNaN(id)) {
      return null;
    }

    return await this.timeSlots.get(id);
  }

  /**
   * @param date
   * @returns
   */
  private getCancelLink(date?: Date): string {
    if (!date) {
      date = new Date();
    }

    const weekStart = DateLib.floorDays(date);
    const pathPart = weekStart.toISOString().substring(0, 10).replaceAll(
      "-",
      "/",
    );
    return `/schedule/${pathPart}/`;
  }

  /**
   * Schedule time slot add GET
   */
  public async addGet(context: Context) {
    const model = new TimeSlotEditViewModel(
      await this.shiftContexts.list(),
      await this.teamMembers.list(),
      await this.colors.list(),
      new TimeSlot(0, 0, null, null, null, false, null, null, "", null, null),
      new Color(0, "", ""),
      false,
      [],
      context.csrf_token,
      this.getCancelLink(),
    );

    return this.HTMLResponse(context, "./views/timeSlot/edit.html", model);
  }

  /**
   * Schedule time slot add POST
   */
  public async addPost(context: Context) {
    const model = await TimeSlotEditViewModel.fromRequest(context.request);

    model.errors = await this.timeSlots.validate(model.timeSlot);
    if (model.newColor) {
      model.errors.concat(await this.colors.validate(model.newColor));
    }

    if (!model.isValid()) {
      model.shiftContexts = await this.shiftContexts.list();
      model.teamMembers = await this.teamMembers.list();
      model.colors = await this.colors.list();
      model.isEdit = false;
      model.csrf_token = context.csrf_token;
      model.cancel = this.getCancelLink(new Date());
      return this.HTMLResponse(context, "./views/timeSlot/edit.html", model);
    }

    if (model.newColor) {
      const newColorId = await this.colors.add(model.newColor);
      model.timeSlot.colorId = newColorId;
    }

    await this.timeSlots.add(model.timeSlot);

    const url = this.getCancelLink(model.timeSlot.startDateTime!);
    return this.RedirectResponse(context, url);
  }

  /**
   * Schedule time slot edit GET
   */
  public async editGet(context: Context) {
    const timeSlot = await this.getTimeSlot(context);
    if (timeSlot == null) {
      return this.NotFoundResponse(context);
    }

    const model = new TimeSlotEditViewModel(
      await this.shiftContexts.list(),
      await this.teamMembers.list(),
      await this.colors.list(),
      timeSlot,
      null,
      true,
      [],
      context.csrf_token,
      this.getCancelLink(timeSlot.startDateTime!),
    );

    return this.HTMLResponse(context, "./views/timeSlot/edit.html", model);
  }

  /**
   * Schedule time slot edit POST
   */
  public async editPost(context: Context) {
    if (await this.getTimeSlot(context) == null) {
      return this.NotFoundResponse(context);
    }

    const model = await TimeSlotEditViewModel.fromRequest(context.request);
    model.timeSlot.id = parseInt(context.match[1]);

    model.errors = await this.timeSlots.validate(model.timeSlot);
    if (model.newColor) {
      model.errors.concat(await this.colors.validate(model.newColor));
    }

    if (!model.isValid()) {
      model.shiftContexts = await this.shiftContexts.list();
      model.teamMembers = await this.teamMembers.list();
      model.colors = await this.colors.list();
      model.isEdit = true;
      model.csrf_token = context.csrf_token;
      model.cancel = this.getCancelLink(
        model.timeSlot.startDateTime ?? new Date(),
      );
      return this.HTMLResponse(context, "./views/timeSlot/edit.html", model);
    }

    if (model.newColor) {
      const colorId = await this.colors.add(model.newColor);
      model.timeSlot.colorId = colorId;
    }

    await this.timeSlots.update(model.timeSlot);

    const url = this.getCancelLink(model.timeSlot.startDateTime!);
    return this.RedirectResponse(context, url);
  }

  /**
   * Schedule time slot delete GET
   */
  public async deleteGet(context: Context) {
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
      context.csrf_token,
    );

    return this.HTMLResponse(context, "./views/shared/delete.html", model);
  }

  /**
   * Schedule time slot delete POST
   */
  public async deletePost(context: Context) {
    const timeSlot = await this.getTimeSlot(context);
    if (timeSlot == null) {
      return this.NotFoundResponse(context);
    }

    await this.timeSlots.delete(timeSlot.id);

    const url = this.getCancelLink(timeSlot.startDateTime!);
    return this.RedirectResponse(context, url);
  }

  /**
   * Schedule time slot copy GET
   */
  public copyGet(context: Context) {
    const [_, y1, m1, d1, y2, m2, d2] = context.match;
    const timestamp1 = Date.parse(`${y1}-${m1}-${d1}`);
    const timestamp2 = Date.parse(`${y2}-${m2}-${d2}`);
    if (isNaN(timestamp1) || isNaN(timestamp2)) {
      return this.NotFoundResponse(context);
    }

    const start = new Date(timestamp1);
    const end = new Date(timestamp2);

    const model = new ScheduleCopyViewModel(
      start,
      end,
      null,
      null,
      true,
      false,
      false,
      false,
      context.csrf_token,
      [],
    );

    return this.HTMLResponse(context, "./views/timeSlot/copy.html", model);
  }

  /**
   * Schedule time slot copy POST
   */
  public async copyPost(context: Context) {
  }

  /**
   * Schedule time slot copy confirm GET
   */
  public async copyConfirmGet(context: Context) {
  }

  /**
   * Schedule time slot copy confirm POST
   */
  public async copyConfirmPost(context: Context) {
  }

  /**
   * Schedule date range clear GET
   */
  public clearGet(context: Context) {
    const [_, y1, m1, d1, y2, m2, d2] = context.match;
    const timestamp1 = Date.parse(`${y1}-${m1}-${d1}`);
    const timestamp2 = Date.parse(`${y2}-${m2}-${d2}`);
    if (isNaN(timestamp1) || isNaN(timestamp2)) {
      return this.NotFoundResponse(context);
    }

    const start = new Date(timestamp1);
    const end = new Date(timestamp2);

    const model = ScheduleClearViewModel.default(
      start,
      end,
      context.csrf_token,
    );

    return this.HTMLResponse(context, "./views/timeSlot/clear.html", model);
  }

  /**
   * Schedule date range clear POST
   */
  public async clearPost(context: Context) {
    const model = await ScheduleClearViewModel.fromRequest(context.request);

    model.validate();
    if (!model.isValid()) {
      return this.HTMLResponse(context, "./views/timeSlot/clear.html", model);
    }

    if (model.deleteTimeSlots) {
      this.timeSlots.deleteInDateRange(model.startDate!, model.endDate!);
    }

    if (model.deleteSubstitutes) {
      this.substitutes.deleteInDateRange(model.startDate!, model.endDate!);
    }

    if (model.deleteShiftContextNotes) {
      this.shiftContextNotes.deleteInDateRange(
        model.startDate!,
        model.endDate!,
      );
    }

    const url = this.getCancelLink(model.startDate!);
    return this.RedirectResponse(context, url);
  }
}
