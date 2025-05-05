import Database from "./_Database.ts";
import ShiftContextRepository from "./ShiftContextRepository.ts";
import Repository from "./_Repository.ts";

/** Represents the shift context preferences of a team member */
export type ShiftContextPreferencesList = {
  /** The ids of the shift contexts the team member prefers */
  preferable: number[];

  /** The ids of the shift contexts the team member does not prefer */
  unpreferable: number[];
};

/** A generic interface for manipulating shift context preferences */
export interface IShiftContextPreferenceRepository {
  /** Verifies the existence of shift context ids within a preferences list
   * @param preferences The preferable and unpreferable shift contexts (as ids)
   * @returns An array of error messages
   */
  validate(preferences: ShiftContextPreferencesList): Promise<string[]>;

  /** Gets the ids of preferable and unpreferable shift contexts given a team member
   * @param teamMemberId The team member's id
   * @returns The preferences
   */
  get(teamMemberId: number): Promise<ShiftContextPreferencesList>;

  /** Updates the shift context preferences of a team member
   * @param teamMemberId The team member's id
   * @param preferences The preferences
   */
  update(
    teamMemberId: number,
    preferences: ShiftContextPreferencesList,
  ): Promise<void>;

  /** Determines a team member's preference for a shift context
   *
   * If a shift context id is not given, the preference is unknown.
   *
   * @param teamMemberId
   * @param shiftContextId
   * @returns The team member's sentiment on the shift context
   */
  getPreference(
    teamMemberId: number,
    shiftContextId: number | null,
  ): Promise<"positive" | "negative" | "neutral" | "unknown">;
}

/** Represents a repository for manipulating team member shift context preferences */
export default class ShiftContextPreferenceRepository extends Repository
  implements IShiftContextPreferenceRepository {
  /** The shift context repository */
  private shiftContexts: ShiftContextRepository;

  /** Constructs the repository given a database connection and shift context repository
   * @param database
   * @param shiftContexts
   */
  public constructor(
    database: Database,
    shiftContexts: ShiftContextRepository,
  ) {
    super(database);
    this.shiftContexts = shiftContexts;
  }

  /** Verifies the existence of shift context ids within a preferences list
   * @param preferences The preferable and unpreferable shift contexts (as ids)
   * @returns An array of error messages
   */
  public async validate(
    preferences: ShiftContextPreferencesList,
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

  /** Gets the ids of preferable and unpreferable shift contexts given a team member
   * @param teamMemberId The team member's id
   * @returns The preferences
   */
  public async get(
    teamMemberId: number,
  ): Promise<ShiftContextPreferencesList> {
    const result = await this._database.execute(
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

  /** Updates the shift context preferences of a team member
   * @param teamMemberId The team member's id
   * @param preferences The preferences
   */
  public async update(
    teamMemberId: number,
    preferences: ShiftContextPreferencesList,
  ): Promise<void> {
    await this._database.execute(
      `
      DELETE FROM TeamMemberShiftContextPreferences
      WHERE teamMemberId = ?
    `,
      [teamMemberId],
    );

    for (const shiftContextId of preferences.preferable) {
      await this._database.execute(
        `
        INSERT INTO TeamMemberShiftContextPreferences (teamMemberId, shiftContextId, isPreference)
        VALUES (?, ?, 1)
        `,
        [teamMemberId, shiftContextId],
      );
    }

    for (const shiftContextId of preferences.unpreferable) {
      await this._database.execute(
        `
        INSERT INTO TeamMemberShiftContextPreferences (teamMemberId, shiftContextId, isPreference)
        VALUES (?, ?, 0)
        `,
        [teamMemberId, shiftContextId],
      );
    }
  }

  /** Determines a team member's preference for a shift context
   *
   * If a shift context id is not given, the preference is unknown.
   *
   * @param teamMemberId
   * @param shiftContextId
   * @returns The team member's sentiment on the shift context
   */
  public async getPreference(
    teamMemberId: number,
    shiftContextId: number | null,
  ): Promise<"positive" | "negative" | "neutral" | "unknown"> {
    if (shiftContextId == null) return "unknown";

    const result = await this._database.execute(
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
