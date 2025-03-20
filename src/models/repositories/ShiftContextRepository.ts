import ShiftContext from "../entities/ShiftContext.ts";
import Repository from "./_Repository.ts";

export interface IShiftContextRow {
  id: number;
  name: string;
  ageGroup: string;
  location: string;
  description: string;
}

export default class ShiftContextRepository extends Repository {
  private mapRowToShiftContext(row: IShiftContextRow): ShiftContext {
    return new ShiftContext(
      row.id,
      row.name,
      row.ageGroup,
      row.location,
      row.description,
    );
  }

  private mapRowsToShiftContexts(rows: IShiftContextRow[]): ShiftContext[] {
    return rows.map(this.mapRowToShiftContext);
  }

  public async validate(s: ShiftContext): Promise<string[]> {
    const errors = [];

    if (s.name.trim() == "") {
      errors.push("Name is required.");
    } else {
      const duplicateName = await this.database.execute(
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

  public async list(): Promise<ShiftContext[]> {
    const result = await this.database.execute(`
      SELECT id, name, ageGroup, location, description
      FROM ShiftContexts
      ORDER BY LOWER(name)
    `);

    return result.rows ? this.mapRowsToShiftContexts(result.rows) : [];
  }

  public async get(
    id: number,
  ): Promise<ShiftContext | null> {
    const result = await this.database.execute(
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

  public async add(s: ShiftContext): Promise<number> {
    const result = await this.database.execute(
      `
        INSERT INTO ShiftContexts (name, ageGroup, location, description)
        VALUES (?, ?, ?, ?)
      `,
      [s.name, s.ageGroup, s.location, s.description],
    );

    return result.lastInsertId ?? 0;
  }

  public async update(s: ShiftContext): Promise<void> {
    await this.database.execute(
      `
      UPDATE ShiftContexts
      SET name = ?, ageGroup = ?, location = ?, description = ?
      WHERE id = ?
      `,
      [s.name, s.ageGroup, s.location, s.description, s.id],
    );
  }

  public async delete(id: number): Promise<void> {
    await this.database.execute(
      `
      DELETE FROM ShiftContexts
      WHERE id = ?
      `,
      [id],
    );
  }
}
