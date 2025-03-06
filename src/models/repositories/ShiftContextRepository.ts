import Database from "./_Database.ts";
import ShiftContext from "../entities/ShiftContext.ts";

export default class ShiftContextRepository {
  private mapRowToShiftContext(row: IShiftContext): ShiftContext {
    return new ShiftContext(
      row.id,
      row.name,
      row.ageGroup,
      row.location,
      row.description,
    );
  }

  private mapRowsToShiftContexts(rows: IShiftContext[]): ShiftContext[] {
    return rows.map(this.mapRowToShiftContext);
  }

  public async validate(s: ShiftContext): Promise<string[]> {
    const errors = [];

    if (s.name.trim() == "") {
      errors.push("Name is required.");
    } else {
      const duplicateName = await Database.execute(
        `
        SELECT 1
        FROM ShiftContexts
        WHERE id != ? AND name = ?
      `,
        [s.id, s.name],
      );

      if (duplicateName?.affectedRows ?? 0 > 0) {
        errors.push("Name must be unique.");
      }
    }

    return errors;
  }

  public async getShiftContexts(): Promise<ShiftContext[]> {
    const result = await Database.execute(`
      SELECT id, name, ageGroup, location, description
      FROM ShiftContexts
      ORDER BY LOWER(name)
    `);

    return result.rows ? this.mapRowsToShiftContexts(result.rows) : [];
  }

  public async getShiftContext(
    id: number,
  ): Promise<ShiftContext | null> {
    const result = await Database.execute(
      `
      SELECT id, name, ageGroup, location, description
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

  public async addShiftContext(s: ShiftContext): Promise<number> {
    const result = await Database.execute(
      `
        INSERT INTO ShiftContexts (name, ageGroup, location, description)
        VALUES (?, ?, ?, ?)
      `,
      [s.name, s.ageGroup, s.location, s.description],
    );

    return result.lastInsertId ?? 0;
  }

  public async updateShiftContext(s: ShiftContext): Promise<void> {
    await Database.execute(
      `
      UPDATE ShiftContexts
      SET name = ?, ageGroup = ?, location = ?, description = ?
      WHERE id = ?
      `,
      [s.name, s.ageGroup, s.location, s.description, s.id],
    );
  }

  public async deleteShiftContext(id: number): Promise<void> {
    await Database.execute(
      `
      DELETE FROM ShiftContexts
      WHERE id = ?
      `,
      [id],
    );
  }
}
