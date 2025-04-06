import ShiftContext from "../entities/ShiftContext.ts";
import Repository from "./_Repository.ts";

/** Represents actions for manipulating shift contexts */
export interface IShiftContextRepository {
  /** Validates a shift context
   * @param shiftContext The shift context
   * @returns An array of error messages
   */
  validate(shiftContext: ShiftContext): Promise<string[]>;

  /** Lists all shift contexts
   * @returns An array of shift contexts
   */
  list(): Promise<ShiftContext[]>;

  /** Gets a shift context
   *
   * Returns null if the shift context does not exist
   *
   * @param id The shift context id
   * @returns The shift context or null
   */
  get(id: number): Promise<ShiftContext | null>;

  /** Adds a shift context
   * @param shiftContext The shift context
   * @returns The id of the new shift context
   */
  add(shiftContext: ShiftContext): Promise<number>;

  /** Updates a shift context
   *
   * Refers to the id to update the correct shift context
   *
   * @param shiftContext The shift context
   */
  update(shiftContext: ShiftContext): Promise<void>;

  /** Deletes a shift context
   * @param id The id of the shift context
   */
  delete(id: number): Promise<void>;
}

/** Represents a database row for a shift context */
export interface IShiftContextRow {
  /** The shift context id */
  id: number;

  /** The shift context name */
  name: string;

  /** The shift context age group */
  ageGroup: string;

  /** The shift context location */
  location: string;

  /** The shift context description */
  description: string;
}

export default class ShiftContextRepository extends Repository
  implements IShiftContextRepository {
  /** Converts a database row to a shift context
   * @param row The database row
   * @returns The shift context
   */
  private mapRowToShiftContext(row: IShiftContextRow): ShiftContext {
    return new ShiftContext(
      row.id,
      row.name,
      row.ageGroup,
      row.location,
      row.description,
    );
  }

  /** Converts an array of database rows to an array of shift contexts
   * @param rows The array of database rows
   * @returns The array of shift contexts
   */
  private mapRowsToShiftContexts(rows: IShiftContextRow[]): ShiftContext[] {
    return rows.map(this.mapRowToShiftContext);
  }

  /** Validates a shift context
   * @param shiftContext The shift context
   * @returns An array of error messages
   */
  public async validate(shiftContext: ShiftContext): Promise<string[]> {
    const errors = [];

    if (shiftContext.name.trim() == "") {
      errors.push("Name is required.");
    } else {
      const result = await this._database.execute(
        `
        SELECT 1
        FROM ShiftContexts
        WHERE id != ? AND name = ?
      `,
        [shiftContext.id, shiftContext.name],
      );

      if (result?.affectedRows ?? 0 > 0) {
        errors.push("Name must be unique.");
      }
    }

    return errors;
  }

  /** Lists all shift contexts
   * @returns An array of shift contexts
   */
  public async list(): Promise<ShiftContext[]> {
    const result = await this._database.execute(`
      SELECT id, name, ageGroup, location, description
      FROM ShiftContexts
      ORDER BY LOWER(name)
    `);

    return result.rows ? this.mapRowsToShiftContexts(result.rows) : [];
  }

  /** Gets a shift context
   *
   * Returns null if the shift context does not exist
   *
   * @param id The shift context id
   * @returns The shift context or null
   */
  public async get(
    id: number,
  ): Promise<ShiftContext | null> {
    const result = await this._database.execute(
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

  /** Adds a shift context
   * @param shiftContext The shift context
   * @returns The id of the new shift context
   */
  public async add(s: ShiftContext): Promise<number> {
    const result = await this._database.execute(
      `
        INSERT INTO ShiftContexts (name, ageGroup, location, description)
        VALUES (?, ?, ?, ?)
      `,
      [s.name, s.ageGroup, s.location, s.description],
    );

    return result.lastInsertId ?? 0;
  }

  /** Updates a shift context
   *
   * Refers to the id to update the correct shift context
   *
   * @param shiftContext The shift context
   */
  public async update(s: ShiftContext): Promise<void> {
    await this._database.execute(
      `
      UPDATE ShiftContexts
      SET name = ?, ageGroup = ?, location = ?, description = ?
      WHERE id = ?
      `,
      [s.name, s.ageGroup, s.location, s.description, s.id],
    );
  }

  /** Deletes a shift context
   * @param id The id of the shift context
   */
  public async delete(id: number): Promise<void> {
    await this._database.execute(
      `
      DELETE FROM ShiftContexts
      WHERE id = ?
      `,
      [id],
    );
  }
}
