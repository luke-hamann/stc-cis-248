import Context from "../models/controllerLayer/Context.ts";
import Controller2 from "./_Controller2.ts";
import ColorRepository from "../models/repositories/ColorRepository.ts";
import ShiftContextNoteRepository from "../models/repositories/ShiftContextNoteRepository.ts";
import ShiftContextNoteEditViewModel from "../models/viewModels/ShiftContextNoteEditViewModel.ts";

export default class ShiftContextNoteController extends Controller2 {
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
   * Shift context note edit GET
   */
  public async editGet(context: Context) {
    const shiftContextId = parseInt(context.match[1]);

    if (isNaN(shiftContextId)) {
      return this.NotFoundResponse(context);
    }

    const year = context.match[2];
    const month = context.match[3];
    const day = context.match[4];

    const timestamp = Date.parse(`${year}-${month}-${day}`);
    if (isNaN(timestamp)) {
      return this.NotFoundResponse(context);
    }

    const date = new Date(timestamp);
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
  }
}
