import ShiftContext from "../../entities/ShiftContext.ts";
import ViewModel from "../_shared/_ViewModel.ts";

/** A view model for listing shift contexts */
export default class ShiftContextsViewModel extends ViewModel {
  /** The array of shift contexts */
  public shiftContexts: ShiftContext[] = [];

  /** Constructs the view model
   * @param shiftContexts An array of shift contexts
   */
  public constructor(shiftContexts: ShiftContext[]) {
    super();
    this.shiftContexts = shiftContexts;
  }
}
