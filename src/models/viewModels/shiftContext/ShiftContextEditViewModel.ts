import ShiftContext from "../../entities/ShiftContext.ts";
import FormViewModel from "../_shared/_FormViewModel.ts";

export default class ShiftContextEditViewModel extends FormViewModel {
  shiftContext: ShiftContext;

  public constructor(
    isEdit: boolean,
    errors: string[],
    shiftContext: ShiftContext,
  ) {
    super(isEdit, errors);
    this.shiftContext = shiftContext;
  }

  public static empty() {
    return new ShiftContextEditViewModel(false, [], ShiftContext.empty());
  }

  public static async fromRequest(request: Request) {
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
