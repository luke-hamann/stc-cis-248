export default class Color {
  private id: number = 0;
  private name: string = "";
  private hex: string = "";

  public Color(id: number, name: string, hex: string) {
    this.id = id;
    this.name = name;
    this.hex = hex;
  }

  public getId(): number {
    return this.id;
  }

  public setId(id: number): void {
    this.id = id;
  }

  public getName(): string {
    return this.name;
  }

  public setName(name: string): void {
    this.name = name;
  }

  public getHex(): string {
    return this.hex;
  }

  public setHex(hex: string): void {
    this.hex = hex;
  }
}
