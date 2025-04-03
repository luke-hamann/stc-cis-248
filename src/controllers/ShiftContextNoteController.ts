import Context from "../_framework/Context.ts";
import Controller from "../_framework/Controller.ts";
import ColorRepository from "../models/repositories/ColorRepository.ts";
import ShiftContextNoteRepository from "../models/repositories/ShiftContextNoteRepository.ts";
import ShiftContextNoteEditViewModel from "../models/viewModels/shiftContextNote/ShiftContextNoteEditViewModel.ts";
import BetterDate from "../_dates/BetterDate.ts";
import ShiftContextNote from "../models/entities/ShiftContextNote.ts";
import { ResponseWrapper } from "../mod.ts";

/** Controls the shift context note pages */
export default class ShiftContextNoteController extends Controller {
  /** The shift context note repository */
  private _shiftContextNoteRepository: ShiftContextNoteRepository;

  /** The color repository */
  private _colorRepository: ColorRepository;

  /**
   * Constructs the shift context note controller based on the necessary repositories
   * @param shiftContextNoteRepository The shift context note repository
   * @param colorRepository The color repository
   */
  constructor(
    shiftContextNoteRepository: ShiftContextNoteRepository,
    colorRepository: ColorRepository,
  ) {
    super();
    this._shiftContextNoteRepository = shiftContextNoteRepository;
    this._colorRepository = colorRepository;
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
   * Extracts a shift context note date from URL string matches
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
   * Gets the shift context note edit page
   * @param context The application context
   * @returns The response
   */
  public async editGet(context: Context): Promise<ResponseWrapper> {
    const shiftContextId = parseInt(context.match[1]);
    if (isNaN(shiftContextId)) {
      return this.NotFoundResponse(context);
    }

    const date = this.getNoteDate(context);
    if (date == null) {
      return this.NotFoundResponse(context);
    }

    let shiftContextNote = await this._shiftContextNoteRepository
      .get(
        shiftContextId,
        date,
      );

    if (shiftContextNote == null) {
      shiftContextNote = new ShiftContextNote(
        shiftContextId,
        null,
        date,
        "",
        null,
        null,
      );
    }

    const model = new ShiftContextNoteEditViewModel(
      [],
      shiftContextNote,
      await this._colorRepository.list(),
      BetterDate.fromDate(date).floorToSunday().toDate(),
    );

    return this.HTMLResponse(
      context,
      "./views/shiftContextNote/edit.html",
      model,
    );
  }

  /**
   * Accepts a request to update a shift context note
   * @param context The application context
   * @returns The response
   */
  public async editPost(context: Context): Promise<ResponseWrapper> {
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
    model.shiftContextNote.shiftContextId = shiftContextId;
    model.shiftContextNote.date = date;

    model.errors = await this._shiftContextNoteRepository.validate(
      model.shiftContextNote,
    );
    if (!model.isValid()) {
      model.csrf_token = context.csrf_token;
      model.colors = await this._colorRepository.list();
      return this.HTMLResponse(
        context,
        "./views/shiftContextNote/edit.html",
        model,
      );
    }

    model.shiftContextNote.shiftContextId = shiftContextId;
    model.shiftContextNote.date = date;

    await this._shiftContextNoteRepository.update(
      model.shiftContextNote,
    );

    const newDate = new BetterDate(date.getTime()).toDateString("/");
    return this.RedirectResponse(context, `/schedule/${newDate}/`);
  }
}
