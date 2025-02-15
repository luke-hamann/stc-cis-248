import Color from "../entities/Color.ts";

export default class ColorEditViewModel {
  color: Color = new Color(0, "", "");
  isEdit: boolean = false;
  errors: string[] = [];

  public constructor(color: Color, isEdit: boolean, errors: string[]) {
    this.color = color;
    this.isEdit = isEdit;
    this.errors = errors;
  }

  public static fromFormData(formData: FormData): ColorEditViewModel {
    const id = Number(formData.get("id") as string ?? "");
    const name = formData.get("name") as string ?? "";
    const hex = (formData.get("hex") as string ?? "").replace("#", "");

    const color = new Color(id, name, hex);
    return new ColorEditViewModel(color, false, []);
  }
}
