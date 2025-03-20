import Color from "../../entities/Color.ts";
import FormDataWrapper from "../../../_framework/FormDataWrapper.ts";
import FormViewModel from "../_shared/_FormViewModel.ts";
import ShiftContextNote from "../../entities/ShiftContextNote.ts";

export default class ShiftContextNoteEditViewModel extends FormViewModel {
  shiftContextNote: ShiftContextNote;
  colors: Color[];
  weekStart: Date;

  public constructor(
    errors: string[],
    csrf_token: string,
    shiftContextNote: ShiftContextNote,
    colors: Color[],
    weekStart: Date,
  ) {
    super(true, errors, csrf_token);
    this.shiftContextNote = shiftContextNote;
    this.colors = colors;
    this.weekStart = weekStart;
  }

  public static async fromRequest(
    request: Request,
  ): Promise<ShiftContextNoteEditViewModel> {
    const formData = new FormDataWrapper(await request.formData());

    const note = formData.getString("note");
    const colorId = formData.getInt("colorId");

    const shiftContextNote = new ShiftContextNote(
      0,
      null,
      null,
      note,
      colorId,
      null,
    );

    return new ShiftContextNoteEditViewModel(
      [],
      "",
      shiftContextNote,
      [],
      new Date(),
    );
  }
}
