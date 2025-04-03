import Color from "../../entities/Color.ts";
import ViewModel from "../_shared/_ViewModel.ts";

export default class ColorsViewModel extends ViewModel {
  public colors: Color[] = [];

  public constructor(colors: Color[]) {
    super();
    this.colors = colors;
  }
}
