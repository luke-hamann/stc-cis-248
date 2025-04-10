import Color from "../../entities/Color.ts";
import FormViewModel from "../_shared/_FormViewModel.ts";
import ShiftContextNote from "../../entities/ShiftContextNote.ts";
import MapWrapper from "../../../_framework/MapWrapper.ts";

/** A view model for the shift context note add/edit form */
export default class ShiftContextNoteEditViewModel extends FormViewModel {
  /** The shift context note being added/edited */
  shiftContextNote: ShiftContextNote;

  /** An array of possible colors for the note */
  colors: Color[];

  /** Constructs the view model
   * @param errors
   * @param shiftContextNote
   * @param colors
   */
  public constructor(
    errors: string[],
    shiftContextNote: ShiftContextNote,
    colors: Color[],
  ) {
    super(true, errors);
    this.shiftContextNote = shiftContextNote;
    this.colors = colors;
  }

  /** Constructs the view model using incoming form data
   * @param request The incoming HTTP request
   * @returns The view model
   */
  public static async fromRequest(
    request: Request,
  ): Promise<ShiftContextNoteEditViewModel> {
    const formData = MapWrapper.fromFormData(await request.formData());

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
      shiftContextNote,
      [],
    );
  }
}
