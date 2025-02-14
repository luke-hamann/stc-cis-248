import Color from "../entities/Color.ts";

export default class ColorListViewModel {
  private _colors: Color[] = [];

  public constructor(colors: Color[]) {
    this.colors = colors;
  }

  public get colors(): Color[] {
    return this._colors;
  }

  public set colors(value: Color[]) {
    this._colors = value;
  }
}
