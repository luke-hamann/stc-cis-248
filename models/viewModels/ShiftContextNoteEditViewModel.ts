import Color from "../entities/Color.ts";
import ShiftContextNote from "../entities/ShiftContextNote.ts";
import FormViewModel from "./_FormViewModel.ts";

export default class ShiftContextNoteEditViewModel extends FormViewModel {
  shiftContextNote: ShiftContextNote;
  colors: Color[];

  public constructor(
    errors: string[],
    csrf_token: string,
    shiftContextNote: ShiftContextNote,
    colors: Color[],
  ) {
    super(true, errors, csrf_token);
    this.shiftContextNote = shiftContextNote;
    this.colors = colors;
  }
}
