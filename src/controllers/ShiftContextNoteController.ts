import Context from "../_framework/Context.ts";
import Controller from "../_framework/Controller.ts";
import ColorRepository from "../models/repositories/ColorRepository.ts";
import ShiftContextNoteRepository from "../models/repositories/ShiftContextNoteRepository.ts";
import ShiftContextNoteEditViewModel from "../models/viewModels/ShiftContextNoteEditViewModel.ts";

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
   * Floor a date to the most recent Sunday on or before
   * @param date The date to floor
   * @returns The new floored date
   */
  private floorDate(date: Date): Date {
    const newDate = new Date(date.getTime());
    newDate.setDate(newDate.getDate() - newDate.getDay());
    return newDate;
  }

  /**
   * Extract a shift context note date from URL string matches
   * @param context The application context
   * @returns The extracted date or null
   */
  private getNoteDate(context: Context): Date | null {
    const year = context.match[2];
    const month = context.match[3];
    const day = context.match[4];
    const timestamp = Date.parse(`${year}-${month}-${day}Z`);

    if (isNaN(timestamp)) {
      return null;
    }

    return new Date(timestamp);
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
      .getShiftContextNote(
        shiftContextId,
        date,
      );
    
    const colors = await this.colorRepository.getColors();

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

    const model = await ShiftContextNoteEditViewModel.fromRequest(context.request);
    if (!model.isValid()) {
      model.csrf_token = context.csrf_token;
      model.colors = await this.colorRepository.getColors();
      return this.HTMLResponse(context, "./views/shiftContextNote/edit.html", model);
    }

    model.shiftContextNote.shiftContextId = shiftContextId;
    model.shiftContextNote.date = date;

    await this.shiftContextNoteRepository.updateShiftContextNote(model.shiftContextNote);

    const newDate = this.floorDate(date).toISOString().substring(0, 10).replaceAll('-', '/');
    return this.RedirectResponse(context, `/schedule/${newDate}/`);
  }
}
