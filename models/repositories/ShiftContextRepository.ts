import Database from "./_Database.ts";
import ShiftContext from "../entities/ShiftContext.ts";

export default class ShiftContextRepository {
  private static mapRowToShiftContext(row: IShiftContext): ShiftContext {
    return new ShiftContext(
      row.id,
      row.name,
      row.ageGroup,
      row.location,
      row.description,
    );
  }

  private static mapRowsToShiftContexts(rows: IShiftContext[]): ShiftContext[] {
    return rows.map(this.mapRowToShiftContext);
  }

  public static async getShiftContexts(): Promise<ShiftContext[]> {
    const result = await Database.execute(`
      SELECT id, name, ageGroup, location, description
      FROM ShiftContexts
      ORDER BY LOWER(name)
    `);

    return result.rows ? this.mapRowsToShiftContexts(result.rows) : [];
  }

  public static async getShiftContext(
    id: number,
  ): Promise<ShiftContext | null> {
    const result = await Database.execute(
      `
      SELECT id, name, ageGroup, location, descrition
      FROM ShiftContexts
      WHERE id = ?
    `,
      [id],
    );

    if (result.rows && result.rows.length == 1) {
      return this.mapRowToShiftContext(result.rows[0]);
    } else {
      return null;
    }
  }
}
