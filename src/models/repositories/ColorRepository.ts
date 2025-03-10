import Color from "../entities/Color.ts";
import Repository from "./_Repository.ts";

export interface IColorRow {
  id: number;
  name: string;
  hex: string;
}

export interface IColorRepository {
  validateColor(color: Color): Promise<string[]>;
  getColors(): Promise<Color[]>;
  getColor(id: number): Promise<Color | null>;
  addColor(color: Color): Promise<number>;
  updateColor(color: Color): Promise<void>;
  deleteColor(id: number): Promise<void>;
}

export default class ColorRepository extends Repository
  implements IColorRepository {
  private mapRowToColor(row: IColorRow): Color {
    return new Color(row.id, row.name, row.hex);
  }

  private mapRowsToColors(rows: IColorRow[]): Color[] {
    return rows.map((row) => this.mapRowToColor(row));
  }

  public async validateColor(color: Color): Promise<string[]> {
    const errors = [];

    if (color.name.trim() == "") {
      errors.push("Color must have a name.");
    } else {
      const result = await this.database.execute(
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

  public async getColors(): Promise<Color[]> {
    const result = await this.database.execute(`
      SELECT id, name, hex
      FROM Colors
      ORDER BY LOWER(name)
    `);

    return this.mapRowsToColors(result.rows as IColorRow[]);
  }

  public async getColor(id: number): Promise<Color | null> {
    const result = await this.database.execute(
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

  public async addColor(color: Color): Promise<number> {
    const result = await this.database.execute(
      `
      INSERT INTO Colors (name, hex)
      VALUES (?, ?)
    `,
      [color.name, color.hex],
    );

    return result.lastInsertId ?? 0;
  }

  public async updateColor(color: Color): Promise<void> {
    await this.database.execute(
      `
      UPDATE Colors
      SET name = ?, hex = ?
      WHERE id = ?
    `,
      [color.name, color.hex, color.id],
    );
  }

  public async deleteColor(id: number): Promise<void> {
    await this.database.execute(
      `
      DELETE FROM Colors
      WHERE id = ?
    `,
      [id],
    );
  }
}
