import Color from "../entities/Color.ts";
import Repository from "./_Repository.ts";

/** Color database row */
export interface IColorRow {
  /** Color id */
  id: number;

  /** Color name */
  name: string;

  /** 6-character RBG color hexadecimal code */
  hex: string;
}

/** Represents a repository of color entities */
export interface IColorRepository {
  /** Validates a color
   * @param color The color
   * @returns A list of error messages
   */
  validate(color: Color): Promise<string[]>;

  /** Lists all colors
   * @returns The list of colors
   */
  list(): Promise<Color[]>;

  /** Gets a color by id
   * @param id The id
   * @returns The color, or null if it is not found
   */
  get(id: number): Promise<Color | null>;

  /** Adds a color
   * @param color The color
   * @returns The id of the newly added color
   */
  add(color: Color): Promise<number>;

  /** Updates a color
   *
   * Refers to the id field to find which color to update
   *
   * @param color The color
   */
  update(color: Color): Promise<void>;

  /** Deletes a color
   * @param id The color id
   */
  delete(id: number): Promise<void>;
}

/** Repository for manipulating color entities */
export default class ColorRepository extends Repository
  implements IColorRepository {
  /** Converts a color database row to a color object
   * @param row The database row
   * @returns The color
   */
  private mapRowToColor(row: IColorRow): Color {
    return new Color(row.id, row.name, row.hex);
  }

  /** Converts a list of color database rows to a list of color objects
   * @param rows The list of color database rows
   * @returns The list of color object
   */
  private mapRowsToColors(rows: IColorRow[]): Color[] {
    return rows.map((row) => this.mapRowToColor(row));
  }

  /** Validates a color
   * @param color The color
   * @returns A list of error messages
   */
  public async validate(color: Color): Promise<string[]> {
    const errors = [];

    if (color.name.trim() == "") {
      errors.push("Color must have a name.");
    } else {
      const result = await this._database.execute(
        `
        SELECT *
        FROM Colors
        WHERE id != ? AND name = ?
      `,
        [color.id, color.name],
      );

      if (result.rows && result.rows.length > 0) {
        errors.push("Color must have a unique name.");
      }
    }

    if (!/^[0123456789abcdef]{6}$/.test(color.hex)) {
      errors.push("Invalid color code.");
    }

    return await Promise.resolve(errors);
  }

  /** Lists all colors
   * @returns The list of colors
   */
  public async list(): Promise<Color[]> {
    const result = await this._database.execute(`
      SELECT id, name, hex
      FROM Colors
      ORDER BY LOWER(name)
    `);

    return this.mapRowsToColors(result.rows as IColorRow[]);
  }

  /** Gets a color by id
   * @param id The id
   * @returns The color, or null if it is not found
   */
  public async get(id: number): Promise<Color | null> {
    const result = await this._database.execute(
      `
      SELECT id, name, hex
      FROM Colors
      WHERE id = ?
    `,
      [id],
    );

    return (result.rows && result.rows.length > 0)
      ? this.mapRowToColor(result.rows[0])
      : null;
  }

  /** Adds a color
   * @param color The color
   * @returns The id of the newly added color
   */
  public async add(color: Color): Promise<number> {
    const result = await this._database.execute(
      `
      INSERT INTO Colors (name, hex)
      VALUES (?, ?)
    `,
      [color.name, color.hex],
    );

    return result.lastInsertId ?? 0;
  }

  /** Updates a color
   *
   * Refers to the id field to find which color to update
   *
   * @param color The color
   */
  public async update(color: Color): Promise<void> {
    await this._database.execute(
      `
      UPDATE Colors
      SET name = ?, hex = ?
      WHERE id = ?
    `,
      [color.name, color.hex, color.id],
    );
  }

  /** Deletes a color
   * @param id The color id
   */
  public async delete(id: number): Promise<void> {
    await this._database.execute(
      `
      DELETE FROM Colors
      WHERE id = ?
    `,
      [id],
    );
  }
}
