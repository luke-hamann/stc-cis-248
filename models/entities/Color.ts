export default class Color {
  public id: number = 0;
  public name: string = "";
  public hex: string = "";

  public constructor(id: number, name: string, hex: string) {
    this.id = id;
    this.name = name;
    this.hex = hex;
  }
}
