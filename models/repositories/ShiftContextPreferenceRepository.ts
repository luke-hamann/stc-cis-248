import { IShiftContextPreference } from "../../globals.d.ts";
import ShiftContextPreference from "../entities/ShiftContextPreference.ts";
import Database from "./_Database.ts";

export default class ShiftContextPreferenceRepository {
  public static async getShiftContextPreferences(
    teamMemberId: number,
  ): Promise<Map<number, boolean>> {
    const result = await Database.execute(
      `
      SELECT shiftContextId, isPreference
      FROM TeamMemberShiftContextPreferences
      WHERE teamMemberId = ?
      ORDER BY shiftContextId
    `,
      [teamMemberId],
    );

    const rows = result.rows ?? [] as {teamMemberId: number, isPreferable: number}[];

    const preferences = new Map<number, boolean>();
    for (const row of rows) {
      preferences.set(row.shiftContextId, row.isPreferable == 1);
    }

    return preferences;
  }
}
