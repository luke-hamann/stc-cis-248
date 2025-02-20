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

  public static empty() {
    return new ShiftContextEditViewModel(false, [], "", ShiftContext.empty());
  }

  public static fromFormData(formData: FormData) {
    const id = Number(formData.get("id") as string ?? "0");
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
    return new ShiftContextEditViewModel(false, [], "", shiftContext);
  }

  static async fromRequest(request: Request) {
    const formData = await request.formData();
    return this.fromFormData(formData);
  }
}
