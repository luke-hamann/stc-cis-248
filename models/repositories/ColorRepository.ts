import Color from "../entities/Color.ts";
import Database from "./_Database.ts";

interface IColor {
  id: number;
  name: string;
  hex: string;
}

export default class {
  private static mapRowToColor(row: IColor): Color {
    return new Color(row.id, row.name, row.hex);
  }

  private static mapRowsToColors(rows: IColor[]): Color[] {
    return rows.map((row) => this.mapRowToColor(row));
  }

  public static async listColors(): Promise<Color[]> {
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
}
