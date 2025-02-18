import ShiftContext from "../entities/ShiftContext.ts";
import FormViewModel from "./_FormViewModel.ts";

export default class ShiftContextEditViewModel extends FormViewModel {
  shiftContext: ShiftContext;

  public constructor(
    isEdit: boolean,
    errors: string[],
    csrf_token: string,
    shiftContext: ShiftContext,
  ) {
    super(isEdit, errors, csrf_token);
    this.shiftContext = shiftContext;
  }
}
