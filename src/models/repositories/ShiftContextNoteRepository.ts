import { IShiftContextNoteRow } from "../../globals.d.ts";
import Color from "../entities/Color.ts";
import ShiftContext from "../entities/ShiftContext.ts";
import ShiftContextNote from "../entities/ShiftContextNote.ts";
import Repository from "./_Repository.ts";

export default class ShiftContextNoteRepository extends Repository {
  private async validateShiftContextNote(
    shiftContextNote: ShiftContextNote,
  ): Promise<string[]> {
    return await Promise.resolve([]);
  }

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

  public async getShiftContextNote(
    shiftContextId: number,
    date: Date,
  ): Promise<ShiftContextNote> {
    const dateString = date.toISOString().substring(0, 10);

    const result = await this.database.execute(
      `
      SELECT shiftContextId, sc.name shiftContextName, date, note, colorId, c.name colorName
      FROM ShiftContextNotes scn
        JOIN shiftcontexts sc ON scn.shiftContextId = sc.id
        JOIN colors c ON scn.colorId = c.id
      WHERE shiftContextId = ? AND date = ?
    `,
      [shiftContextId, dateString],
    );

    return (result.rows && result.rows.length > 0)
      ? this.mapRowToShiftContextNote(result.rows[1])
      : new ShiftContextNote(shiftContextId, null, date, "", 0, null);
  }

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
