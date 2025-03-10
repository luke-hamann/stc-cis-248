import Color from "../entities/Color.ts";
import ShiftContext from "../entities/ShiftContext.ts";
import ShiftContextNote from "../entities/ShiftContextNote.ts";
import Repository from "./_Repository.ts";

export interface IShiftContextNoteRow {
  shiftContextId: number;
  shiftContextName: string;
  date: Date;
  note: string;
  colorId: number;
  colorName: string;
  colorHex: string;
}

export default class ShiftContextNoteRepository extends Repository {
  /** Defines a generic SQL query for fetching all shift context notes */
  private readonly baseQuery = `
    SELECT shiftContextId, sc.name shiftContextName, date, note, colorId, c.name colorName
    FROM ShiftContextNotes scn
      JOIN shiftcontexts sc ON scn.shiftContextId = sc.id
      JOIN colors c ON scn.colorId = c.id
  `;

  /**
   * Validate a shift context note
   * @param shiftContextNote The shift context note
   * @returns An array of error message strings
   */
  private async validateShiftContextNote(
    shiftContextNote: ShiftContextNote,
  ): Promise<string[]> {
    return await Promise.resolve([]);
  }

  /**
   * Convert a database row to a shift context note
   * @param row The database row
   * @returns The shift context note
   */
  private mapRowToShiftContextNote(
    row: IShiftContextNoteRow,
  ): ShiftContextNote {
    const shiftContext = new ShiftContext(
      row.shiftContextId,
      row.shiftContextName,
      "",
      "",
      "",
    );
    const color = new Color(row.colorId, row.colorName, row.colorHex);

    return new ShiftContextNote(
      row.shiftContextId,
      shiftContext,
      new Date(row.date),
      row.note,
      row.colorId,
      color,
    );
  }

  /**
   * Convert database rows to an array of shift context notes
   * @param rows The database rows
   * @returns The array of shift context notes
   */
  private mapRowsToShiftContextNotes(
    rows: IShiftContextNoteRow[],
  ): ShiftContextNote[] {
    return rows.map((row) => this.mapRowToShiftContextNote(row));
  }

  /**
   * Get a shift context note by its shift context id and date
   *
   * Returns an empty shift context note if it does not exist in the database
   *
   * @param shiftContextId The shift context id
   * @param date The date of the shift context note
   * @returns The shift context note
   */
  public async getShiftContextNote(
    shiftContextId: number,
    date: Date,
  ): Promise<ShiftContextNote> {
    const dateString = date.toISOString().substring(0, 10);

    const result = await this.database.execute(
      `${this.baseQuery} WHERE shiftContextId = ? AND date = ?`,
      [shiftContextId, dateString],
    );

    return (result.rows && result.rows.length > 0)
      ? this.mapRowToShiftContextNote(result.rows[0])
      : new ShiftContextNote(shiftContextId, null, date, "", 0, null);
  }

  /**
   * Get all the shift context notes within a date range
   * @param start The starting date of the range
   * @param end The ending date of the range
   * @returns The array of shift context notes
   */
  public async getShiftContextNotesInRange(
    start: Date,
    end: Date,
  ): Promise<ShiftContextNote[]> {
    const startString = start.toISOString().substring(0, 10);
    const endString = end.toISOString().substring(0, 10);

    const result = await this.database.execute(
      `${this.baseQuery} WHERE date BETWEEN ? AND ?`,
      [startString, endString],
    );

    if (!result.rows) return [];

    return this.mapRowsToShiftContextNotes(result.rows);
  }

  /**
   * Update a shift context note
   *
   * Deletes the shift context note if the content is empty
   *
   * @param shiftContextNote The shift context note to update
   */
  public async updateShiftContextNote(
    shiftContextNote: ShiftContextNote,
  ) {
    await this.database.execute(
      `
      DELETE FROM ShiftContextNotes
      WHERE shiftContextId = ? AND date = ?
      `,
      [shiftContextNote.shiftContextId, shiftContextNote.dateString],
    );

    if (shiftContextNote.note.length > 0) {
      await this.database.execute(
        `
          INSERT INTO ShiftContextNotes (shiftContextId, date, note, colorId)
          VALUES (?, ?, ?, ?)
        `,
        [
          shiftContextNote.shiftContextId,
          shiftContextNote.dateString,
          shiftContextNote.note,
          shiftContextNote.colorId,
        ],
      );
    }
  }
}
