import DateLib from "../../_dates/DateLib.ts";
import ShiftContextNote from "../entities/ShiftContextNote.ts";
import Database from "./_Database.ts";
import Repository from "./_Repository.ts";
import { IColorRepository } from "./ColorRepository.ts";
import ShiftContextRepository from "./ShiftContextRepository.ts";

/** Represents a repository for manipulating shift context notes */
export interface IShiftContextNoteRepository {
  /** Validates a shift context note
   * @param shiftContextNote The shift context note
   * @returns An array of error message strings
   */
  validate(shiftContextNote: ShiftContextNote): Promise<string[]>;

  /** Gets a shift context note by its shift context id and date
   * @param shiftContextId The shift context id
   * @param date The date of the shift context note
   * @returns The shift context note
   */
  get(shiftContextId: number, date: Date): Promise<ShiftContextNote | null>;

  /** Gets all the shift context notes within a date range and optionally a shift context
   * @param start The start date
   * @param end The end date
   * @param shiftContextId The shift context id
   * @returns The array of shift context notes
   */
  getWhere(
    start: Date,
    end: Date,
    shiftContextId?: number,
  ): Promise<ShiftContextNote[]>;

  /** Updates a shift context note, deleting the note if the content is empty
   *
   * Refers to the shift context id and date of the note to update it
   *
   * @param shiftContextNote The shift context note
   */
  update(shiftContextNote: ShiftContextNote): Promise<void>;

  /** Deletes all shift context notes within a given date range
   * @param start The start date
   * @param end The end date
   */
  deleteWhere(start: Date, end: Date): Promise<void>;

  /** Computes the results of a potential shift context note copy operation
   * @param sourceStart The start date of the source range
   * @param sourceEnd The end date of the source range
   * @param destinationStart The start date of the destination range
   * @param destinationEnd The end date of the destination range
   * @param repeatCopy Whether the source range should be repeated in the destination range
   * @returns An array of shift context notes that would be created
   */
  calculateCopy(
    sourceStart: Date,
    sourceEnd: Date,
    destinationStart: Date,
    destinationEnd: Date,
    repeatCopy: boolean,
  ): Promise<ShiftContextNote[]>;
}

/** Represents the database row of a shift context note */
export interface IShiftContextNoteRow {
  /** The id of the shift context related to the shift context note */
  shiftContextId: number;

  /** The date of the shift context note */
  date: Date;

  /** The content of the note */
  note: string;

  /** The id of the color associated with the note */
  colorId: number;
}

export default class ShiftContextNoteRepository extends Repository
  implements IShiftContextNoteRepository {
  /** The color repository */
  private colors: IColorRepository;

  /** The shift context repository */
  private shiftContexts: ShiftContextRepository;

  /** Defines a generic SQL query for fetching all shift context notes */
  private readonly baseQuery = `
    SELECT shiftContextId, date, note, colorId
    FROM ShiftContextNotes
  `;

  /** Constructs the shift context note repository using a database connection and other repositories
   * @param database
   * @param colors
   * @param shiftContexts
   */
  constructor(
    database: Database,
    colors: IColorRepository,
    shiftContexts: ShiftContextRepository,
  ) {
    super(database);
    this.colors = colors;
    this.shiftContexts = shiftContexts;
  }

  /** Validates a shift context note
   * @param shiftContextNote The shift context note
   * @returns An array of error message strings
   */
  public async validate(
    shiftContextNote: ShiftContextNote,
  ): Promise<string[]> {
    const errors: string[] = [];

    const shiftContext = await this.shiftContexts.get(
      shiftContextNote.shiftContextId,
    );
    if (shiftContext == null) {
      errors.push("That shift context does not exist.");
    }

    if (shiftContextNote.date == null) {
      errors.push("Please enter a date.");
    }

    if (shiftContextNote.colorId) {
      const color = await this.colors.get(shiftContextNote.colorId);
      if (color == null) {
        errors.push("That color does not exist.");
      }
    }

    return errors;
  }

  /** Populates a shift context note with its corresponding shift context and color information
   * @param shiftContextNote The shift context note
   * @returns The shift context note with related entities
   */
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

  /** Converts a database row to a shift context note
   * @param row The database row
   * @returns The shift context note
   */
  private mapRowToShiftContextNote(
    row: IShiftContextNoteRow,
  ): ShiftContextNote {
    // Clamp note date to always appear on the same date no matter the timezone
    const year = row.date.getUTCFullYear();
    const monthIndex = row.date.getUTCMonth();
    const date = row.date.getUTCDate();
    row.date = new Date(year, monthIndex, date);

    return new ShiftContextNote(
      row.shiftContextId,
      null,
      row.date,
      row.note,
      row.colorId,
      null,
    );
  }

  /** Converts database rows to an array of shift context notes
   * @param rows The database rows
   * @returns The array of shift context notes
   */
  private mapRowsToShiftContextNotes(
    rows: IShiftContextNoteRow[],
  ): ShiftContextNote[] {
    return rows.map((row) => this.mapRowToShiftContextNote(row));
  }

  /** Gets a shift context note by its shift context id and date
   * @param shiftContextId The shift context id
   * @param date The date of the shift context note
   * @returns The shift context note
   */
  public async get(
    shiftContextId: number,
    date: Date,
  ): Promise<ShiftContextNote | null> {
    const result = await this._database.execute(
      `${this.baseQuery} WHERE shiftContextId = ? AND date = ?`,
      [shiftContextId, date],
    );

    if (!result.rows || result.rows.length == 0) {
      return null;
    }

    return this.populate(this.mapRowToShiftContextNote(result.rows[0]));
  }

  /** Gets all the shift context notes within a date range and optionally a shift context
   * @param start The start date
   * @param end The end date
   * @param shiftContextId The shift context id
   * @returns The array of shift context notes
   */
  public async getWhere(
    start: Date,
    end: Date,
    shiftContextId?: number,
  ): Promise<ShiftContextNote[]> {
    let query = `${this.baseQuery} WHERE DATE(date) BETWEEN ? AND ?`;
    if (shiftContextId) query += " AND shiftContextId = ?";

    const result = await this._database.execute(
      query,
      [start, end, shiftContextId ?? null],
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

  /** Updates a shift context note, deleting the note if the content is empty
   *
   * Refers to the shift context id and date of the note to update it
   *
   * @param shiftContextNote The shift context note
   */
  public async update(
    shiftContextNote: ShiftContextNote,
  ): Promise<void> {
    await this._database.execute(
      `
      DELETE FROM ShiftContextNotes
      WHERE shiftContextId = ? AND date = ?
      `,
      [shiftContextNote.shiftContextId, shiftContextNote.date],
    );

    if (shiftContextNote.note.length > 0) {
      await this._database.execute(
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

  /** Deletes all shift context notes within a given date range
   * @param start The start date
   * @param end The end date
   */
  public async deleteWhere(
    start: Date,
    end: Date,
  ): Promise<void> {
    await this._database.execute(
      `
        DELETE FROM ShiftContextNotes
        WHERE date BETWEEN ? AND ?
      `,
      [
        start,
        end,
      ],
    );
  }

  /** Computes the results of a potential shift context note copy operation
   * @param sourceStart The start date of the source range
   * @param sourceEnd The end date of the source range
   * @param destinationStart The start date of the destination range
   * @param destinationEnd The end date of the destination range
   * @param repeatCopy Whether the source range should be repeated in the destination range
   * @returns An array of shift context notes that would be created
   */
  public async calculateCopy(
    sourceStart: Date,
    sourceEnd: Date,
    destinationStart: Date,
    destinationEnd: Date,
    repeatCopy: boolean,
  ): Promise<ShiftContextNote[]> {
    const sourceWidth = DateLib.differenceInDays(sourceStart, sourceEnd) + 1;
    const initialOffset = DateLib.differenceInDays(
      sourceStart,
      destinationStart,
    );

    const sourceShiftContextNotes = await this.getWhere(
      sourceStart,
      sourceEnd,
    );
    const destinationShiftContextNotes = [];

    for (const shiftContextNote of sourceShiftContextNotes) {
      let offset = initialOffset;

      while (true) {
        const newShiftContextNote = shiftContextNote.clone();
        newShiftContextNote.date = DateLib.addDays(
          newShiftContextNote.date!,
          offset,
        );

        const tempDate = new Date(newShiftContextNote.date.getTime());
        tempDate.setHours(0, 0, 0, 0);

        const isOutOfBounds = tempDate.getTime() > destinationEnd.getTime();

        if (isOutOfBounds) break;

        destinationShiftContextNotes.push(newShiftContextNote);

        if (!repeatCopy) break;

        offset += sourceWidth;
      }
    }

    destinationShiftContextNotes.sort((a, b) =>
      a.date!.getTime() - b.date!.getTime()
    );

    return destinationShiftContextNotes;
  }
}
