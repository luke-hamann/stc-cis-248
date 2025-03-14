import BetterDate from "../../_dates/BetterDate.ts";
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
  private readonly selectUnavailability = `
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
      `${this.selectUnavailability} WHERE id = ?`,
      [id],
    );

    if (!result.rows || result.rows.length == 0) return null;

    return this.mapRow(result.rows[0]);
  }

  /**
   * Gets unavailability for a given team member and date range
   * @param teamMemberId Team member id
   * @param start Date range start
   * @param end Date range end
   * @returns Array of unavailability
   */
  public async getInRange(
    teamMemberId: number,
    start: Date,
    end: Date,
  ): Promise<Unavailability[]> {
    const result = await this.database.execute(
      `
        ${this.selectUnavailability}
        WHERE teamMemberId = ?
          AND startDateTime >= ?
          AND startDateTime < ?
      `,
      [
        teamMemberId,
        BetterDate.fromDate(start).toDateString(),
        BetterDate.fromDate(end).addDays(1).toDateString(),
      ],
    );

    if (!result.rows) return [];

    return this.mapRows(result.rows);
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
            startDateTime BETWEEN ? AND ? OR
            endDateTime BETWEEN ? AND ?
          )
      `,
      [
        teamMember.id,
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
