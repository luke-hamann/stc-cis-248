import Database from "./_Database.ts";
import ShiftContextRepository from "./ShiftContextRepository.ts";
import Repository from "./_Repository.ts";

export default class ShiftContextPreferenceRepository extends Repository {
  private shiftContexts: ShiftContextRepository;

  public constructor(
    database: Database,
    shiftContexts: ShiftContextRepository,
  ) {
    super(database);
    this.shiftContexts = shiftContexts;
  }

  public async validate(
    preferences: { preferable: number[]; unpreferable: number[] },
  ): Promise<string[]> {
    const errors: string[] = [];

    // Ensure shift context ids exist
    for (const id of preferences.preferable) {
      const shiftContext = await this.shiftContexts.get(id);
      if (shiftContext == null) {
        errors.push("A selected shift context does not exist.");
      }
    }

    // Ensure shift context is not preferable and unpreferable at the same time
    const intersection = preferences.preferable.filter(
      (value) => preferences.unpreferable.includes(value),
    );
    if (intersection.length > 0) {
      errors.push(
        "A shift context cannot be preferable and unpreferable at the same time.",
      );
    }

    return errors;
  }

  /**
   * Gets the ids of preferable and unpreferable shift contexts given a team member
   * @param teamMemberId
   * @returns
   */
  public async get(
    teamMemberId: number,
  ): Promise<{ preferable: number[]; unpreferable: number[] }> {
    const result = await this.database.execute(
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

  /**
   * Updates the ids of preferable and unpreferable shift contexts given a team member
   * @param teamMemberId
   * @param shiftContextPreferences
   */
  public async update(
    teamMemberId: number,
    shiftContextPreferences: { preferable: number[]; unpreferable: number[] },
  ): Promise<void> {
    await this.database.execute(
      `
      DELETE FROM TeamMemberShiftContextPreferences
      WHERE teamMemberId = ?
    `,
      [teamMemberId],
    );

    for (const shiftContextId of shiftContextPreferences.preferable) {
      await this.database.execute(
        `
        INSERT INTO TeamMemberShiftContextPreferences (teamMemberId, shiftContextId, isPreference)
        VALUES (?, ?, 1)
        `,
        [teamMemberId, shiftContextId],
      );
    }

    for (const shiftContextId of shiftContextPreferences.unpreferable) {
      await this.database.execute(
        `
        INSERT INTO TeamMemberShiftContextPreferences (teamMemberId, shiftContextId, isPreference)
        VALUES (?, ?, 0)
        `,
        [teamMemberId, shiftContextId],
      );
    }
  }

  public async getPreference(
    teamMemberId: number,
    shiftContextId: number | null,
  ): Promise<"positive" | "negative" | "neutral" | "unknown"> {
    if (shiftContextId == null) return "unknown";

    const result = await this.database.execute(
      `
        SELECT isPreference
        FROM TeamMemberShiftContextPreferences
        WHERE teamMemberId = ?
          AND shiftContextId = ?
      `,
      [teamMemberId, shiftContextId],
    );

    if (!result.rows || result.rows.length == 0) return "neutral";

    const isPreference = result.rows[0].isPreference == 1;

    return isPreference ? "positive" : "negative";
  }
}
