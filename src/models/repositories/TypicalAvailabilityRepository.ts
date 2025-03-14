import TeamMember from "../entities/TeamMember.ts";
import TimeSlot from "../entities/TimeSlot.ts";
import TypicalAvailability from "../entities/TypicalAvailability.ts";
import Repository from "./_Repository.ts";

interface ITypicalAvailabilityRow {
  id: number;
  teamMemberId: number;
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  startTime: Date;
  endTime: Date;
  isPreference: 0 | 1;
}

export default class TypicalAvailabilityRepository extends Repository {
  private readonly baseQuery = `
    SELECT id, teamMemberId, dayOfWeek, startTime, endTime, isPreference
    FROM TeamMemberTypicalAvailability
  `;

  /**
   * Maps a database row to a typical availability object
   * @param row
   * @returns
   */
  private mapRow(
    row: ITypicalAvailabilityRow,
  ): TypicalAvailability {
    return new TypicalAvailability(
      row.id,
      row.teamMemberId,
      null,
      row.dayOfWeek,
      row.startTime,
      row.endTime,
      row.isPreference == 1,
    );
  }

  /**
   * Maps database rows to a typical availability array
   * @param rows
   * @returns
   */
  private mapRows(rows: ITypicalAvailabilityRow[]): TypicalAvailability[] {
    return rows.map((row) => this.mapRow(row));
  }

  /**
   * Validates a typical availability
   * @param t The typical availability
   * @returns An array of error messages
   */
  public async validate(t: TypicalAvailability): Promise<string[]> {
    return await Promise.resolve([]);
  }

  /**
   * Lists typical availability of a team member
   * @param teamMemberId
   * @returns
   */
  public async list(teamMemberId: number): Promise<TypicalAvailability[]> {
    const result = await this.database.execute(
      `
        ${this.baseQuery}
        WHERE teamMemberId = ?
        ORDER BY dayOfWeek, startTime, endTime
      `,
      [teamMemberId],
    );

    return result.rows ? this.mapRows(result.rows) : [];
  }

  /**
   * Gets a typical availability by id
   * @param id
   */
  public async get(id: number): Promise<TypicalAvailability | null> {
    const result = await this.database.execute(
      `
        ${this.baseQuery}
        WHERE id = ?
      `,
      [id],
    );

    if (!result.rows || result.rows.length == 0) return null;

    return this.mapRow(result.rows[0]);
  }

  public async add(t: TypicalAvailability): Promise<number> {
    const result = await this.database.execute(
      `
        INSERT INTO TeamMemberTypicalAvailability
          (teamMemberId, dayOfWeek, startTime, endTime, isPreference)
        VALUES
          (?, ?, ?, ?, ?)
      `,
      [
        t.teamMemberId,
        t.dayOfWeek,
        t.startTime,
        t.endTime,
        t.isPreference ? 1 : 0,
      ],
    );

    return result.lastInsertId ?? 0;
  }

  public async update(t: TypicalAvailability): Promise<void> {
    await this.database.execute(
      `
        UPDATE TeamMemberTypicalAvailability
        SET teamMemberId = ?, 
          dayOfWeek = ?,
          startTime = ?,
          endTime = ?,
          isPreference = ?
        WHERE id = ?
      `,
      [
        t.teamMemberId,
        t.dayOfWeek,
        t.startTime,
        t.endTime,
        t.isPreference,
      ],
    );
  }

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
   * Determines if a team member is typically available for a time slot
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
        FROM TeamMemberTypicalAvailability
        WHERE teamMemberId = ?
          AND dayOfWeek = ?
          AND ? BETWEEN startTime AND endTime
          AND ? BETWEEN startTime AND endTime
      `,
      [
        teamMember.id,
        timeSlot.startDateTime?.getDay(),
        timeSlot.startTimeString,
        timeSlot.endTimeString,
      ],
    );

    if (result.rows && result.rows.length > 0) {
      return "positive";
    } else {
      return "negative";
    }
  }
}
