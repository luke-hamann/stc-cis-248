import ShiftContext from "../../entities/ShiftContext.ts";
import FormViewModel from "../_shared/_FormViewModel.ts";

/** A view model for the shift context add/edit form */
export default class ShiftContextEditViewModel extends FormViewModel {
  /** The shift context being added/edited */
  shiftContext: ShiftContext;

  /** Constructs the view model
   * @param isEdit
   * @param errors
   * @param shiftContext
   */
  public constructor(
    isEdit: boolean,
    errors: string[],
    shiftContext: ShiftContext,
  ) {
    super(isEdit, errors);
    this.shiftContext = shiftContext;
  }

  /** Constructs the view model with empty values
   * @returns The view model
   */
  public static empty(): ShiftContextEditViewModel {
    return new ShiftContextEditViewModel(false, [], ShiftContext.empty());
  }

  /** Constructs the view model using incoming form data
   * @param request The incoming HTTP request
   * @returns The view model
   */
  public static async fromRequest(
    request: Request,
  ): Promise<ShiftContextEditViewModel> {
    const formData = await request.formData();

    const id = parseInt(formData.get("id") as string ?? "0");
    const name = formData.get("name") as string ?? "";
    const ageGroup = formData.get("ageGroup") as string ?? "";
    const location = formData.get("location") as string ?? "";
    const description = formData.get("description") as string ?? "";

    const shiftContext = new ShiftContext(
      id,
      name,
      ageGroup,
      location,
      description,
    );
    return new ShiftContextEditViewModel(false, [], shiftContext);
  }
}
