import { IColor } from "../../globals.d.ts";
import Color from "../entities/Color.ts";
import Database from "./_Database.ts";

export default class ColorRepository {
  private static mapRowToColor(row: IColor): Color {
    return new Color(row.id, row.name, row.hex);
  }

  private static mapRowsToColors(rows: IColor[]): Color[] {
    return rows.map((row) => this.mapRowToColor(row));
  }

  public static async validateColor(color: Color): Promise<string[]> {
    const errors = [];

    if (color.name.trim() == "") {
      errors.push("Color must have a name.");
    } else {
      const result = await Database.execute(
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

    if (!/[0123456789abcdef]{6}/.test(color.hex)) {
      errors.push("Invalid color code.");
    }

    return await Promise.resolve(errors);
  }

  public static async getColors(): Promise<Color[]> {
    const result = await Database.execute(`
      SELECT id, name, hex
      FROM Colors
      ORDER BY LOWER(name)
    `);

    return this.mapRowsToColors(result.rows as IColor[]);
  }

  public static async getColor(id: number): Promise<Color | null> {
    const result = await Database.execute(
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

  public static async addColor(color: Color): Promise<number> {
    const result = await Database.execute(
      `
      INSERT INTO Colors (name, hex)
      VALUES (?, ?)
    `,
      [color.name, color.hex],
    );

    return result.lastInsertId ?? 0;
  }

  public static async updateColor(color: Color): Promise<void> {
    await Database.execute(
      `
      UPDATE Colors
      SET name = ?, hex = ?
      WHERE id = ?
    `,
      [color.name, color.hex, color.id],
    );
  }

  public static async deleteColor(id: number): Promise<void> {
    await Database.execute(
      `
      DELETE FROM Colors
      WHERE id = ?
    `,
      [id],
    );
  }
}
