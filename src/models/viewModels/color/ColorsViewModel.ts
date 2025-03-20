import Color from "../../entities/Color.ts";

export default class ColorsViewModel {
  public colors: Color[] = [];
  public csrf_token: string = "";

  public constructor(colors: Color[], csrf_token: string) {
    this.colors = colors;
    this.csrf_token = csrf_token;
  }
}
