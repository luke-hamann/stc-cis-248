import Database from "./_Database.ts";

export default class ShiftContextPreferenceRepository {
  public async validate(
    shiftContextPreferences: { preferable: number[]; unpreferable: number[] },
  ): Promise<string[]> {
    // Ensure shift context ids exist

    // Ensure shift context is not preferable and unpreferable at the same time

    return await Promise.resolve([]);
  }

  public async getShiftContextPreferences(
    teamMemberId: number,
  ): Promise<{ preferable: number[]; unpreferable: number[] }> {
    const result = await Database.execute(
      `
      SELECT teamMemberId, shiftContextId, isPreference
      FROM TeamMemberShiftContextPreferences
      WHERE teamMemberId = ?
    `,
      [teamMemberId],
    );

    const preferable = [];
    const unpreferable = [];
    for (const row of result.rows ?? []) {
      if (row.isPreference) {
        preferable.push(row.shiftContextId);
      } else {
        unpreferable.push(row.shiftContextId);
      }
    }

    return { preferable, unpreferable };
  }

  public async updateShiftContextPreferences(
    teamMemberId: number,
    shiftContextPreferences: { preferable: number[]; unpreferable: number[] },
  ): Promise<void> {
    await Database.execute(
      `
      DELETE FROM TeamMemberShiftContextPreferences
      WHERE teamMemberId = ?
    `,
      [teamMemberId],
    );

    for (const shiftContextId of shiftContextPreferences.preferable) {
      await Database.execute(
        `
        INSERT INTO TeamMemberShiftContextPreferences (teamMemberId, shiftContextId, isPreference)
        VALUES (?, ?, 1)
        `,
        [teamMemberId, shiftContextId],
      );
    }

    for (const shiftContextId of shiftContextPreferences.unpreferable) {
      await Database.execute(
        `
        INSERT INTO TeamMemberShiftContextPreferences (teamMemberId, shiftContextId, isPreference)
        VALUES (?, ?, 0)
        `,
        [teamMemberId, shiftContextId],
      );
    }
  }
}
