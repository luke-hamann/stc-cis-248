import ShiftContext from "../entities/ShiftContext.ts";
import FormViewModel from "./_FormViewModel.ts";

export default class ShiftContextEditViewModel extends FormViewModel {
  shiftContext: ShiftContext;

  public constructor(
    shiftContext: ShiftContext,
    isEdit: boolean,
    errors: string[],
  ) {
    super(isEdit, errors);
    this.shiftContext = shiftContext;
  }
}
