import ShiftContext from "../../entities/ShiftContext.ts";
import ViewModel from "../_shared/_ViewModel.ts";

export default class ShiftContextsViewModel extends ViewModel {
  public shiftContexts: ShiftContext[] = [];

  public constructor(shiftContexts: ShiftContext[]) {
    super();
    this.shiftContexts = shiftContexts;
  }
}
