export default class Color {
  private _id: number = 0;
  private _name: string = "";
  private _hex: string = "";

  public constructor(id: number, name: string, hex: string) {
    this.id = id;
    this.name = name;
    this.hex = hex;
  }

  public get id(): number {
    return this._id;
  }
  
  public set id(value: number) {
    this._id = value;
  }

  public get name(): string {
    return this._name;
  }

  public set name(value: string) {
    this._name = value;
  }

  public get hex(): string {
    return this._hex;
  }

  public set hex(value: string) {
    this._hex = value;
  }
}
