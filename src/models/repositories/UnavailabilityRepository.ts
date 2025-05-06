import DateLib from "../../_dates/DateLib.ts";
import { Database, TeamMemberRepository } from "../../mod.ts";
import TeamMember from "../entities/TeamMember.ts";
import TimeSlot from "../entities/TimeSlot.ts";
import Unavailability from "../entities/Unavailability.ts";
import Repository from "./_Repository.ts";

/** An interface describing actions for manipulating team member unavailability */
export interface IUnavailabilityRepository {
  /** Validates an unavailability
   * @param unavailability The unavailability
   * @returns An array of error messages
   */
  validate(unavailability: Unavailability): Promise<string[]>;

  /** Gets an unavailability
   *
   * Returns null if the unavailability does not exist
   *
   * @param id The unavailability id
   * @returns The unavailability or null
   */
  get(id: number): Promise<Unavailability | null>;

  /** Lists unavailability for a team member within a date range, by date
   * @param teamMemberId
   * @param start
   * @param end
   * @returns An array of dates with their corresponding unavailabilities
   */
  list(
    teamMemberId: number,
    start: Date,
    end: Date,
  ): Promise<{ date: Date; unavailabilities: Unavailability[] }[]>;

  /** Adds an unavailability
   * @param unavailability
   * @returns The id of the new unavailability
   */
  add(unavailability: Unavailability): Promise<number>;

  /** Updates an unavailability
   *
   * Refers to the id to update the correct unavailability
   *
   * @param unavailability
   */
  update(unavailability: Unavailability): Promise<void>;

  /** Deletes an unavailability
   * @param id The id of the unavailability
   */
  delete(id: number): Promise<void>;

  /** Deletes unavailability for a team member within a date range
   * @param teamMemberId
   * @param start
   * @param end
   */
  deleteRange(teamMemberId: number, start: Date, end: Date): Promise<void>;

  /** Determines if a team member has not been marked unavailable for a time slot
   *
   * If the time slot start date time or end date time are unknown, the unavailability is unknown.
   *
   * @param teamMember
   * @param timeSlot
   * @returns Whether the team member is available based on unavailability
   */
  isAvailable(
    teamMember: TeamMember,
    timeSlot: TimeSlot,
  ): Promise<"positive" | "negative" | "unknown">;
}

/** Represents an unavailability database row */
export interface IUnavailabilityRow {
  /** The id */
  id: number;

  /** The id of the associated team member */
  teamMemberId: number;

  /** The start date and time */
  startDateTime: Date;

  /** The end date and time */
  endDateTime: Date;

  /** Whether the unavailability is preferable
   *
   * 0 is false, 1 is true.
   */
  isPreference: 0 | 1;
}

/** A repository class for manipulating team member unavailability */
export default class UnavailabilityRepository extends Repository {
  /** The team member repository */
  private _teamMembers: TeamMemberRepository;

  /**
   * Constructs the repository given a database connection and team member repository
   * @param database
   * @param teamMembers
   */
  public constructor(database: Database, teamMembers: TeamMemberRepository) {
    super(database);
    this._teamMembers = teamMembers;
  }

  /** A generic SQL query for selecting all unavailability */
  private readonly baseQuery = `
    SELECT id, teamMemberId, startDateTime, endDateTime, isPreference
    FROM TeamMemberAvailability
  `;

  /** Converts an unavailability database row to an unavailability
   * @param row The database row
   * @returns The unavailability
   */
  private mapRow(row: IUnavailabilityRow): Unavailability {
    return new Unavailability(
      row.id,
      row.teamMemberId,
      null,
      row.startDateTime,
      row.endDateTime,
      row.isPreference == 1,
    );
  }

  /** Converts an array of unavailability database rows to an array of unavailability
   * @param rows An array of database rows
   * @returns An array of unavailability
   */
  private mapRows(rows: IUnavailabilityRow[]): Unavailability[] {
    return rows.map((row) => this.mapRow(row));
  }

  /** Validates an unavailability
   * @param unavailability The unavailability
   * @returns An array of error messages
   */
  public async validate(unavailability: Unavailability): Promise<string[]> {
    const errors: string[] = [];

    const teamMember = await this._teamMembers.get(unavailability.teamMemberId);
    if (teamMember == null) {
      errors.push("Please select a team member.");
    }

    if (unavailability.startDateTime == null) {
      errors.push("Please enter a start date and time.");
    }

    if (unavailability.endDateTime == null) {
      errors.push("Please enter an end date and time.");
    }

    if (
      unavailability.startDateTime != null &&
      unavailability.endDateTime != null &&
      unavailability.startDateTime.getTime() >=
        unavailability.endDateTime.getTime()
    ) {
      errors.push("Start date and time must be before end date and time.");
    }

    return errors;
  }

  /** Gets an unavailability
   *
   * Returns null if the unavailability does not exist
   *
   * @param id The unavailability id
   * @returns The unavailability or null
   */
  public async get(id: number): Promise<Unavailability | null> {
    const result = await this._database.execute(
      `${this.baseQuery} WHERE id = ?`,
      [id],
    );

    if (!result.rows || result.rows.length == 0) return null;

    return this.mapRow(result.rows[0]);
  }

  /** Lists unavailability for a team member within a date range, by date
   * @param teamMemberId
   * @param start
   * @param end
   * @returns An array of dates with their corresponding unavailabilities
   */
  public async list(
    teamMemberId: number,
    start: Date,
    end: Date,
  ): Promise<{ date: Date; unavailabilities: Unavailability[] }[]> {
    const table: { date: Date; unavailabilities: Unavailability[] }[] = [];

    for (const date of DateLib.getDatesInRange(start, end)) {
      const row: { date: Date; unavailabilities: Unavailability[] } = {
        date,
        unavailabilities: [],
      };

      const result = await this._database.execute(
        `
          ${this.baseQuery}
          WHERE teamMemberId = ?
            AND DATE(startDateTime) = ?
        `,
        [teamMemberId, date],
      );

      if (result.rows) {
        row.unavailabilities = this.mapRows(result.rows);
      }

      table.push(row);
    }

    return table;
  }

  /** Adds an unavailability
   * @param unavailability
   * @returns The id of the new unavailability
   */
  public async add(unavailability: Unavailability): Promise<number> {
    const result = await this._database.execute(
      `
        INSERT INTO TeamMemberAvailability
          (teamMemberId, startDateTime, endDateTime, isPreference)
        VALUES
          (?, ?, ?, ?)
      `,
      [
        unavailability.teamMemberId,
        unavailability.startDateTime,
        unavailability.endDateTime,
        unavailability.isPreference,
      ],
    );

    return result.lastInsertId ?? 0;
  }

  /** Updates an unavailability
   *
   * Refers to the id to update the correct unavailability
   *
   * @param unavailability
   */
  public async update(unavailability: Unavailability): Promise<void> {
    await this._database.execute(
      `
        UPDATE TeamMemberAvailability
        SET teamMemberId = ?,
          startDateTime = ?,
          endDateTime = ?,
          isPreference = ?
        WHERE id = ?
      `,
      [
        unavailability.teamMemberId,
        unavailability.startDateTime,
        unavailability.endDateTime,
        unavailability.isPreference,
        unavailability.id,
      ],
    );
  }

  /** Deletes an unavailability
   * @param id The id of the unavailability
   */
  public async delete(id: number): Promise<void> {
    await this._database.execute(
      `
        DELETE FROM TeamMemberAvailability
        WHERE id = ?
      `,
      [id],
    );
  }

  /** Deletes unavailability for a team member within a date range
   * @param teamMemberId
   * @param start
   * @param end
   */
  public async deleteRange(
    teamMemberId: number,
    start: Date,
    end: Date,
  ): Promise<void> {
    await this._database.execute(
      `
        DELETE FROM TeamMemberAvailability
        WHERE teamMemberId = ?
          AND startDateTime BETWEEN ? AND ?
      `,
      [teamMemberId, start, end],
    );
  }

  /** Determines if a team member has not been marked unavailable for a time slot
   *
   * If the time slot start date time or end date time are unknown, the unavailability is unknown.
   *
   * @param teamMember
   * @param timeSlot
   * @returns Whether the team member is available based on unavailability
   */
  public async isAvailable(
    teamMember: TeamMember,
    timeSlot: TimeSlot,
  ): Promise<"positive" | "negative" | "unknown"> {
    if (timeSlot.startDateTime == null || timeSlot.endDateTime == null) {
      return "unknown";
    }

    const result = await this._database.execute(
      `
        SELECT 1
        FROM TeamMemberAvailability
        WHERE teamMemberId = ?
          AND (
            startDateTime BETWEEN ? AND ?
            OR endDateTime BETWEEN ? AND ?
          )
          OR (
            startDateTime < ?
            AND endDateTime > ?
          )
      `,
      [
        teamMember.id,
        timeSlot.startDateTime,
        timeSlot.endDateTime,
        timeSlot.startDateTime,
        timeSlot.endDateTime,
        timeSlot.startDateTime,
        timeSlot.endDateTime,
      ],
    );

    if (result.rows && result.rows.length > 0) {
      return "negative";
    } else {
      return "positive";
    }
  }
}
