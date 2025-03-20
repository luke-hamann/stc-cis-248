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
   * @returns
   */
  public static empty() {
    return new Color(0, "", "");
  }
}
