import Database from "../repositories/_Database.ts";
import TeamMember from "../entities/TeamMember.ts";
import TeamMemberRepository from "../repositories/TeamMemberRepository.ts";
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
  private teamMembers: TeamMemberRepository;

  public constructor(database: Database, teamMembers: TeamMemberRepository) {
    super(database);
    this.teamMembers = teamMembers;
  }

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
    const errors: string[] = [];

    const teamMember = await this.teamMembers.get(t.teamMemberId);
    if (teamMember == null) {
      errors.push("The selected team member does not exist.");
    }

    if (t.dayOfWeek == null) {
      errors.push("Please select a day of the week.");
    }

    if (t.startTime == null) {
      errors.push("Please enter a start time.");
    }

    if (t.endTime == null) {
      errors.push("Please enter an end time.");
    }

    if (
      t.startTime != null && t.endTime != null &&
      t.startTime.getTime() >= t.endTime.getTime()
    ) {
      errors.push("Start time must be before end time.");
    }

    return errors;
  }

  /**
   * Lists typical availabilities of a team member grouped by day of week, then ordered by start time, then ordered by end time
   * @param teamMemberId
   * @returns 2D array of typical availabilities
   */
  public async list(teamMemberId: number): Promise<TypicalAvailability[][]> {
    const table: TypicalAvailability[][] = [[], [], [], [], [], [], []];

    const result = await this.database.execute(
      `
        ${this.baseQuery}
        WHERE teamMemberId = ?
        ORDER BY dayOfWeek, startTime, endTime
      `,
      [teamMemberId],
    );

    if (!result.rows || result.rows.length == 0) return table;

    for (const typicalAvailability of this.mapRows(result.rows)) {
      const dayOfWeek = typicalAvailability.dayOfWeek!;
      table[dayOfWeek].push(typicalAvailability);
    }

    return table;
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

  /**
   * Adds a typical availability
   * @param t A typical availability
   * @returns A promise of the new typical availability's id
   */
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

  /**
   * Updates a typical availability
   * @param t A typical availability
   */
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
        t.id,
      ],
    );
  }

  /**
   * Deletes a typical availability
   * @param id A typical availability id
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
          AND startTime <= ?
          AND endTime >= ?
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
