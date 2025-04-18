import MapWrapper from "../../../_framework/MapWrapper.ts";
import ViewModel from "../_shared/_ViewModel.ts";

/** A view model for changing the sort priority of a shift context */
export default class ShiftContextReorderViewModel extends ViewModel {
  /** The id of the shift context being reordered */
  public shiftContextId: number;

  /** The value to add to the shift context's sort priority */
  public delta: number;

  /** Constructs the view model
   * @param shiftContextId
   * @param direction
   */
  public constructor(shiftContextId: number, direction: number) {
    super();
    this.shiftContextId = shiftContextId;
    this.delta = direction;
  }

  /** Constructs the view model using form data
   * @param formData The form data
   * @returns The view model
   */
  public static fromFormData(
    formData: MapWrapper,
  ): ShiftContextReorderViewModel {
    const shiftContextId = formData.getInt("shiftContextId") ?? 0;
    const direction = formData.getInt("direction") ?? 0;

    return new ShiftContextReorderViewModel(shiftContextId, direction);
  }

  /** Whether the view model is valid */
  public isValid(): boolean {
    return this.shiftContextId > 0 && this.delta != 0;
  }
}
