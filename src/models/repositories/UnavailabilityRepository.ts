import DateLib from "../../_dates/DateLib.ts";
import TeamMember from "../entities/TeamMember.ts";
import TimeSlot from "../entities/TimeSlot.ts";
import Unavailability from "../entities/Unavailability.ts";
import Repository from "./_Repository.ts";

interface IUnavailabilityRow {
  id: number;
  teamMemberId: number;
  startDateTime: Date;
  endDateTime: Date;
  isPreference: 0 | 1;
}

export default class UnavailabilityRepository extends Repository {
  /** A query for selecting all unavailability */
  private readonly baseQuery = `
    SELECT id, teamMemberId, startDateTime, endDateTime, isPreference
    FROM TeamMemberAvailability
  `;

  /**
   * Converts an unavailability database row to an unavailability object
   * @param row Unavailability row
   * @returns Unavailability object
   */
  public mapRow(row: IUnavailabilityRow): Unavailability {
    return new Unavailability(
      row.id,
      row.teamMemberId,
      null,
      row.startDateTime,
      row.endDateTime,
      row.isPreference == 1,
    );
  }

  /**
   * Validates an unavailability
   * @param u Unavailability
   * @returns Promise of array of error messages
   */
  public async validate(u: Unavailability): Promise<string[]> {
    return await Promise.resolve([]);
  }

  /**
   * Converts an array of unavailability database rows to an array of unavailability objects
   * @param rows Unavailability rows array
   * @returns Unavailability objects array
   */
  public mapRows(rows: IUnavailabilityRow[]): Unavailability[] {
    return rows.map((row) => this.mapRow(row));
  }

  /**
   * Gets an unavailability by id, null if not found
   * @param id The unavailability id
   * @returns The unavailability or null
   */
  public async get(id: number): Promise<Unavailability | null> {
    const result = await this.database.execute(
      `${this.baseQuery} WHERE id = ?`,
      [id],
    );

    if (!result.rows || result.rows.length == 0) return null;

    return this.mapRow(result.rows[0]);
  }

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

      const result = await this.database.execute(
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

  /**
   * Adds an unavailability
   * @param u The unavailability
   * @returns The promise for the id of the new unavailability
   */
  public async add(u: Unavailability): Promise<number> {
    const result = await this.database.execute(
      `
        INSERT INTO TeamMemberAvailability
          (teamMemberId, startDateTime, endDateTime, isPreference)
        VALUES
          (?, ?, ?, ?)
      `,
      [
        u.teamMemberId,
        u.startDateTime,
        u.endDateTime,
        u.isPreference,
      ],
    );

    return result.lastInsertId ?? 0;
  }

  /**
   * Updates an unavailability
   * @param u The unavailability
   */
  public async update(u: Unavailability): Promise<void> {
    await this.database.execute(
      `
        UPDATE TeamMemberAvailability
        SET teamMemberId = ?,
          startDateTime = ?,
          endDateTime = ?,
          isPreference = ?
        WHERE id = ?
      `,
      [
        u.teamMemberId,
        u.startDateTime,
        u.endDateTime,
        u.isPreference,
        u.id,
      ],
    );
  }

  /**
   * Deletes an unavailability
   * @param id Unavailability id
   */
  public async delete(id: number): Promise<void> {
    await this.database.execute(
      `
        DELETE FROM TeamMemberTypicalAvailability
        WHERE id = ?
      `,
      [id],
    );
  }

  /**
   * Deletes unavailability for a team member within a date range
   * @param teamMemberId
   * @param start Date
   * @param end Date
   */
  public async deleteRange(teamMemberId: number, start: Date, end: Date) {
    await this.database.execute(
      `
        DELETE FROM TeamMemberAvailability
        WHERE teamMemberId = ?
          AND startDateTime BETWEEN ? AND ?
      `,
      [teamMemberId, start, end],
    );
  }

  /**
   * Determines if a team member has been marked as unavailable for a time slot
   * @param teamMember
   * @param timeSlot
   * @returns
   */
  public async isAvailable(
    teamMember: TeamMember,
    timeSlot: TimeSlot,
  ): Promise<"positive" | "negative" | "unknown"> {
    if (timeSlot.startDateTime == null || timeSlot.endDateTime == null) {
      return "unknown";
    }

    const result = await this.database.execute(
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
