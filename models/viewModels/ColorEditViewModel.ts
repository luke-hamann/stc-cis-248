import Color from "../entities/Color.ts";
import FormViewModel from "./_FormViewModel.ts";

export default class ColorEditViewModel extends FormViewModel {
  color: Color = new Color(0, "", "");

  public constructor(color: Color, isEdit: boolean, errors: string[]) {
    super(isEdit, errors);
    this.color = color;
  }

  public static fromFormData(formData: FormData): ColorEditViewModel {
    const id = Number(formData.get("id") as string ?? "");
    const name = formData.get("name") as string ?? "";
    const hex = (formData.get("hex") as string ?? "").replace("#", "");

    const color = new Color(id, name, hex);
    return new ColorEditViewModel(color, false, []);
  }
}
