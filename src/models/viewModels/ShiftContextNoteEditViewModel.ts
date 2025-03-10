import Color from "../entities/Color.ts";
import FormDataWrapper from "../../_framework/FormDataWrapper.ts";
import FormViewModel from "./_FormViewModel.ts";
import ShiftContextNote from "../entities/ShiftContextNote.ts";

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

  public static async fromRequest(request: Request): Promise<ShiftContextNoteEditViewModel> {
    const formData = new FormDataWrapper(await request.formData());

    const note = formData.getString('note');
    const colorId = formData.getInt('colorId') ?? 0;

    const shiftContextNote = new ShiftContextNote(0, null, null, note, colorId, null)

    return new ShiftContextNoteEditViewModel([], "", shiftContextNote, []);
  }
}
