import Context from "../_framework/Context.ts";
import Controller from "../_framework/Controller.ts";
import ResponseWrapper from "../_framework/ResponseWrapper.ts";
import { IColorRepository } from "../models/repositories/ColorRepository.ts";
import { IShiftContextRepository } from "../models/repositories/ShiftContextRepository.ts";
import { IShiftContextNoteRepository } from "../models/repositories/ShiftContextNoteRepository.ts";
import ShiftContextNoteEditViewModel from "../models/viewModels/shiftContextNote/ShiftContextNoteEditViewModel.ts";
import BetterDate from "../_dates/BetterDate.ts";
import ShiftContextNote from "../models/entities/ShiftContextNote.ts";

/** Controls the shift context note pages */
export default class ShiftContextNoteController extends Controller {
  /** The shift context note repository */
  private _shiftContextNotes: IShiftContextNoteRepository;

  /** The shift context repository */
  private _shiftContexts: IShiftContextRepository;

  /** The color repository */
  private _colors: IColorRepository;

  /** Constructs the shift context note controller based on the necessary repositories
   * @param shiftContextNotes The shift context note repository
   * @param shiftContexts The shift context repository
   * @param colors The color repository
   */
  constructor(
    shiftContextNotes: IShiftContextNoteRepository,
    shiftContexts: IShiftContextRepository,
    colors: IColorRepository,
  ) {
    super();
    this._shiftContextNotes = shiftContextNotes;
    this._shiftContexts = shiftContexts;
    this._colors = colors;
    this.routes = [
      {
        method: "GET",
        pattern: "/shift-context/(\\d+)/note/(\\d{4})/(\\d{2})/(\\d{2})/",
        mappings: [[1, "shiftContextId"], [2, "year"], [3, "month"], [
          4,
          "date",
        ]],
        action: this.editGet,
      },
      {
        method: "POST",
        pattern: "/shift-context/(\\d+)/note/(\\d{4})/(\\d{2})/(\\d{2})/",
        mappings: [[1, "shiftContextId"], [2, "year"], [3, "month"], [
          4,
          "date",
        ]],
        action: this.editPost,
      },
    ];
  }

  /** Gets the shift context note edit page
   * @param context The application context
   * @returns The response
   */
  public async editGet(context: Context): Promise<ResponseWrapper> {
    const shiftContextId = context.routeData.getInt("shiftContextId");
    if (shiftContextId == null) {
      return this.NotFoundResponse(context);
    }

    const date = context.routeData.getDateMulti("year", "month", "date");
    if (date == null) {
      return this.NotFoundResponse(context);
    }

    const shiftContext = await this._shiftContexts.get(shiftContextId);
    if (shiftContext == null) {
      return this.NotFoundResponse(context);
    }

    let shiftContextNote = await this._shiftContextNotes
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

    shiftContextNote.shiftContext = shiftContext;

    const model = new ShiftContextNoteEditViewModel(
      [],
      shiftContextNote,
      await this._colors.list(),
    );

    return this.HTMLResponse(
      context,
      "./views/shiftContextNote/edit.html",
      model,
    );
  }

  /** Accepts a request to update a shift context note
   * @param context The application context
   * @returns The response
   */
  public async editPost(context: Context): Promise<ResponseWrapper> {
    const shiftContextId = context.routeData.getInt("shiftContextId");
    if (shiftContextId == null) {
      return this.NotFoundResponse(context);
    }

    const date = context.routeData.getDateMulti("year", "month", "date");
    if (date == null) {
      return this.NotFoundResponse(context);
    }

    const shiftContext = await this._shiftContexts.get(shiftContextId);
    if (shiftContext == null) {
      return this.NotFoundResponse(context);
    }

    const model = await ShiftContextNoteEditViewModel.fromRequest(
      context.request,
    );
    model.shiftContextNote.shiftContextId = shiftContextId;
    model.shiftContextNote.date = date;

    model.errors = await this._shiftContextNotes.validate(
      model.shiftContextNote,
    );
    if (!model.isValid()) {
      model.shiftContextNote.shiftContext = shiftContext;
      model.colors = await this._colors.list();
      return this.HTMLResponse(
        context,
        "./views/shiftContextNote/edit.html",
        model,
      );
    }

    await this._shiftContextNotes.update(
      model.shiftContextNote,
    );

    const newDate = new BetterDate(date.getTime()).toDateString("/");
    return this.RedirectResponse(context, `/schedule/${newDate}/`);
  }
}
