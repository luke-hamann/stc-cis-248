import FormDataWrapper from "../../../_framework/FormDataWrapper.ts";
import Color from "../../entities/Color.ts";
import FormViewModel from "../_shared/_FormViewModel.ts";

export default class ColorEditViewModel extends FormViewModel {
  color: Color = Color.empty();

  public constructor(
    isEdit: boolean,
    errors: string[],
    csrf_token: string,
    color: Color,
  ) {
    super(isEdit, errors, csrf_token);
    this.color = color;
  }

  public static empty() {
    return new ColorEditViewModel(false, [], "", Color.empty());
  }

  public static async fromRequest(
    request: Request,
  ): Promise<ColorEditViewModel> {
    const formData = new FormDataWrapper(await request.formData());
    const id = formData.getInt("id") ?? 0;
    const name = formData.getString("name");
    const hex = formData.getColorHex("hex");
    const color = new Color(id, name, hex);
    return new ColorEditViewModel(false, [], "", color);
  }
}
