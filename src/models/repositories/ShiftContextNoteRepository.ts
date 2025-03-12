import BetterDate from "../../_dates/BetterDate.ts";
import Color from "../entities/Color.ts";
import ShiftContext from "../entities/ShiftContext.ts";
import ShiftContextNote from "../entities/ShiftContextNote.ts";
import Database from "./_Database.ts";
import Repository from "./_Repository.ts";
import { IColorRepository } from "./ColorRepository.ts";
import ShiftContextRepository from "./ShiftContextRepository.ts";

export interface IShiftContextNoteRow {
  shiftContextId: number;
  date: Date;
  note: string;
  colorId: number;
}

export default class ShiftContextNoteRepository extends Repository {
  private colors: IColorRepository;
  private shiftContexts: ShiftContextRepository;

  /** Defines a generic SQL query for fetching all shift context notes */
  private readonly baseQuery = `
    SELECT shiftContextId, date, note, colorId
    FROM ShiftContextNotes
  `;

  constructor(
    database: Database,
    colors: IColorRepository,
    shiftContexts: ShiftContextRepository,
  ) {
    super(database);
    this.colors = colors;
    this.shiftContexts = shiftContexts;
  }

  /**
   * Validate a shift context note
   * @param shiftContextNote The shift context note
   * @returns An array of error message strings
   */
  public async validate(
    shiftContextNote: ShiftContextNote,
  ): Promise<string[]> {
    return await Promise.resolve([]);
  }

  private async populate(shiftContextNote: ShiftContextNote) {
    const shiftContextId = shiftContextNote.shiftContextId;
    if (shiftContextId) {
      shiftContextNote.shiftContext = await this.shiftContexts.get(
        shiftContextId,
      );
    }

    const colorId = shiftContextNote.colorId;
    if (colorId) {
      shiftContextNote.color = await this.colors.get(colorId);
    }

    return shiftContextNote;
  }

  /**
   * Convert a database row to a shift context note
   * @param row The database row
   * @returns The shift context note
   */
  private mapRowToShiftContextNote(
    row: IShiftContextNoteRow,
  ): ShiftContextNote {
    row.date.setFullYear(row.date.getUTCFullYear());
    row.date.setMonth(row.date.getUTCMonth());
    row.date.setDate(row.date.getUTCDate());
    row.date.setHours(0, 0, 0, 0);

    return new ShiftContextNote(
      row.shiftContextId,
      null,
      row.date,
      row.note,
      row.colorId,
      null,
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
   * @param shiftContextId The shift context id
   * @param date The date of the shift context note
   * @returns The shift context note
   */
  public async get(
    shiftContextId: number,
    date: Date,
  ): Promise<ShiftContextNote | null> {
    const result = await this.database.execute(
      `${this.baseQuery} WHERE shiftContextId = ? AND date = ?`,
      [shiftContextId, date],
    );

    if (!result.rows || result.rows.length == 0) {
      return null;
    }

    return this.populate(this.mapRowToShiftContextNote(result.rows[0]));
  }

  /**
   * Get all the shift context notes within a date range
   * @param start The starting date of the range
   * @param end The ending date of the range
   * @param shiftContextId The shift context id
   * @returns The array of shift context notes
   */
  public async getFilter(
    start: Date,
    end: Date,
    shiftContextId?: number,
  ): Promise<ShiftContextNote[]> {
    let query = `${this.baseQuery} WHERE date BETWEEN ? AND ?`;
    if (shiftContextId) query += " AND shiftContextId = ?";

    const result = await this.database.execute(
      query,
      [start, end, shiftContextId],
    );

    if (!result.rows) return [];

    let shiftContextNotes = this.mapRowsToShiftContextNotes(result.rows);
    shiftContextNotes = await Promise.all(
      shiftContextNotes.map((shiftContextNote) =>
        this.populate(shiftContextNote)
      ),
    );
    return shiftContextNotes;
  }

  /**
   * Update a shift context note
   *
   * Deletes the shift context note if the content is empty
   *
   * @param shiftContextNote The shift context note to update
   */
  public async update(
    shiftContextNote: ShiftContextNote,
  ) {
    await this.database.execute(
      `
      DELETE FROM ShiftContextNotes
      WHERE shiftContextId = ? AND date = ?
      `,
      [shiftContextNote.shiftContextId, shiftContextNote.date],
    );

    if (shiftContextNote.note.length > 0) {
      await this.database.execute(
        `
          INSERT INTO ShiftContextNotes (shiftContextId, date, note, colorId)
          VALUES (?, ?, ?, ?)
        `,
        [
          shiftContextNote.shiftContextId,
          shiftContextNote.date,
          shiftContextNote.note,
          shiftContextNote.colorId,
        ],
      );
    }
  }

  public async deleteInDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<void> {
    await this.database.execute(
      `
        DELETE FROM ShiftContextNotes
        WHERE date BETWEEN ? AND ?
      `,
      [
        startDate,
        endDate,
      ],
    );
  }
}
