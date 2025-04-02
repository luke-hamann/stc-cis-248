/**
 * Represents a color
 */
export default class Color {
  /** The color id */
  public id: number = 0;

  /** The color name */
  public name: string = "";

  /** The color RGB hex code */
  public hex: string = "";

  /**
   * Constructs a color
   * @param id
   * @param name
   * @param hex
   */
  public constructor(id: number, name: string, hex: string) {
    this.id = id;
    this.name = name;
    this.hex = hex;
  }

  /**
   * Creates a color object with default values
   */
  public static empty() {
    return new Color(0, "", "");
  }

  /**
   * A hex color appropriate for text on top of the color hex
   */
  public get hexForeground(): "000000" | "FFFFFF" {
    const [R, G, B] = (this.hex.match(/.{2}/g) ?? ["FF", "FF", "FF"]).map((c) =>
      Number(`0x${c}`)
    );
    return (R * 0.299 + G * 0.587 + B * 0.114) > 186 ? "000000" : "FFFFFF";
  }
}
