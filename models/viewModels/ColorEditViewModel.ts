import Color from "../entities/Color.ts";

export default class ColorEditViewModel {
  color: Color;

  constructor(color: Color) {
    this.color = color;
  }
}
