import MapWrapper from "../../../_framework/MapWrapper.ts";
import Color from "../../entities/Color.ts";
import FormViewModel from "../_shared/_FormViewModel.ts";

/** A view model for the color add and edit forms */
export default class ColorEditViewModel extends FormViewModel {
  /** The color being added or edited */
  color: Color = Color.empty();

  /** Constructs the view model
   * @param isEdit
   * @param errors
   * @param color
   */
  public constructor(
    isEdit: boolean,
    errors: string[],
    color: Color,
  ) {
    super(isEdit, errors);
    this.color = color;
  }

  /** Constructs an empty view model
   * @returns The empty view model
   */
  public static empty() {
    return new ColorEditViewModel(false, [], Color.empty());
  }

  /** Maps form data from a request to the view model
   * @returns The new view model
   */
  public static async fromRequest(
    request: Request,
  ): Promise<ColorEditViewModel> {
    const formData = MapWrapper.fromFormData(await request.formData());
    const id = formData.getInt("id") ?? 0;
    const name = formData.getString("name");
    const hex = formData.getColorHex("hex");
    const color = new Color(id, name, hex);
    return new ColorEditViewModel(false, [], color);
  }
}
