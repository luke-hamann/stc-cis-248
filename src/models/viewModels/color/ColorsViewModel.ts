import Color from "../../entities/Color.ts";
import ViewModel from "../_shared/_ViewModel.ts";

/** A view model for listing all colors */
export default class ColorsViewModel extends ViewModel {
  /** The list of colors */
  public colors: Color[] = [];

  /** Constructs the view model
   * @param colors
   */
  public constructor(colors: Color[]) {
    super();
    this.colors = colors;
  }
}
