import Context from "../_framework/Context.ts";
import Controller from "../_framework/Controller.ts";
import ColorRepository from "../models/repositories/ColorRepository.ts";
import DateLib from "../_dates/DateLib.ts";
import ShiftContextNoteRepository from "../models/repositories/ShiftContextNoteRepository.ts";
import ShiftContextNoteEditViewModel from "../models/viewModels/ShiftContextNoteEditViewModel.ts";
import BetterDate from "../_dates/BetterDate.ts";

export default class ShiftContextNoteController extends Controller {
  private shiftContextNoteRepository: ShiftContextNoteRepository;
  private colorRepository: ColorRepository;

  constructor(
    shiftContextNoteRepository: ShiftContextNoteRepository,
    colorRepository: ColorRepository,
  ) {
    super();
    this.shiftContextNoteRepository = shiftContextNoteRepository;
    this.colorRepository = colorRepository;
    this.routes = [
      {
        method: "GET",
        pattern: "/shift-context/(\\d+)/note/(\\d{4})/(\\d{2})/(\\d{2})/",
        action: this.editGet,
      },
      {
        method: "POST",
        pattern: "/shift-context/(\\d+)/note/(\\d{4})/(\\d{2})/(\\d{2})/",
        action: this.editPost,
      },
    ];
  }

  /**
   * Extract a shift context note date from URL string matches
   * @param context The application context
   * @returns The extracted date or null
   */
  private getNoteDate(context: Context): Date | null {
    const year = parseInt(context.match[2]);
    const monthIndex = parseInt(context.match[3]) - 1;
    const day = parseInt(context.match[4]);
    const date = new Date(year, monthIndex, day);

    if (isNaN(date.getTime())) {
      return null;
    }

    return date;
  }

  /**
   * Shift context note edit GET
   */
  public async editGet(context: Context) {
    const shiftContextId = parseInt(context.match[1]);

    if (isNaN(shiftContextId)) {
      return this.NotFoundResponse(context);
    }

    const date = this.getNoteDate(context);
    if (date == null) {
      return this.NotFoundResponse(context);
    }

    const shiftContextNote = await this.shiftContextNoteRepository
      .get(
        shiftContextId,
        date,
      );

    const colors = await this.colorRepository.list();

    const model = new ShiftContextNoteEditViewModel(
      [],
      context.csrf_token,
      shiftContextNote,
      colors,
    );

    return this.HTMLResponse(
      context,
      "./views/shiftContextNote/edit.html",
      model,
    );
  }

  /**
   * Shift context note edit POST
   */
  public async editPost(context: Context) {
    const shiftContextId = parseInt(context.match[1]);
    if (isNaN(shiftContextId)) {
      return this.NotFoundResponse(context);
    }

    const date = this.getNoteDate(context);
    if (date == null) {
      return this.NotFoundResponse(context);
    }

    const model = await ShiftContextNoteEditViewModel.fromRequest(
      context.request,
    );
    if (!model.isValid()) {
      model.csrf_token = context.csrf_token;
      model.colors = await this.colorRepository.list();
      return this.HTMLResponse(
        context,
        "./views/shiftContextNote/edit.html",
        model,
      );
    }

    model.shiftContextNote.shiftContextId = shiftContextId;
    model.shiftContextNote.date = date;

    await this.shiftContextNoteRepository.update(
      model.shiftContextNote,
    );

    const newDate = new BetterDate(date.getTime()).toDateString();
    return this.RedirectResponse(context, `/schedule/${newDate}/`);
  }
}
