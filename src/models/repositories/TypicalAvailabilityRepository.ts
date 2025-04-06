import Database from "../repositories/_Database.ts";
import TeamMember from "../entities/TeamMember.ts";
import TeamMemberRepository from "../repositories/TeamMemberRepository.ts";
import TimeSlot from "../entities/TimeSlot.ts";
import TypicalAvailability, {
  DayOfWeek,
} from "../entities/TypicalAvailability.ts";
import Repository from "./_Repository.ts";

/** An interface for manipulating typical availability */
export interface ITypicalAvailabilityRepository {
  /** Validates a typical availability
   * @param typicalAvailability The typical availability
   * @returns An array of error messages
   */
  validate(typicalAvailability: TypicalAvailability): Promise<string[]>;

  /** Lists a team member's typical availabilities
   *
   * Typical availabilities are grouped by week, ordered by start time, and then ordered by end time
   *
   * @param teamMemberId The team member id
   * @returns 2D array of typical availabilities
   */
  list(teamMemberId: number): Promise<TypicalAvailability[][]>;

  /** Gets a typical availability
   *
   * Returns null if the typical availability does not exist
   *
   * @param id The typical availability id
   * @returns The typical availability or null
   */
  get(id: number): Promise<TypicalAvailability | null>;

  /** Adds a typical availability
   * @param typicalAvailability The typical availability
   * @returns The id of the newly added typical availability
   */
  add(typicalAvailability: TypicalAvailability): Promise<number>;

  /** Updates a typical availability
   *
   * Refers to the id to update the correct typical availability
   *
   * @param typicalAvailability The typical availability
   */
  update(typicalAvailability: TypicalAvailability): Promise<void>;

  /** Deletes a typical availability
   * @param id A typical availability id
   */
  delete(id: number): Promise<void>;

  /** Determines if a team member is typically available for a time slot
   *
   * If the time slot start date time or end date time are unknown, the availability is unknown
   *
   * @param teamMember
   * @param timeSlot
   * @returns Whether the team member is available
   */
  isAvailable(
    teamMember: TeamMember,
    timeSlot: TimeSlot,
  ): Promise<"positive" | "negative" | "unknown">;
}

/** Represents a typical availability database row */
interface ITypicalAvailabilityRow {
  /** The id */
  id: number;

  /** The id of the associated team member */
  teamMemberId: number;

  /** The day of the week of the typical availability
   */
  dayOfWeek: DayOfWeek;

  /** The start time */
  startTime: Date;

  /** The end time */
  endTime: Date;

  /** Whether the typical availability is preferable
   *
   * 0 is false, 1 is true.
   */
  isPreference: 0 | 1;
}

/** A repository class for manipulating typical availability */
export default class TypicalAvailabilityRepository extends Repository
  implements ITypicalAvailabilityRepository {
  /** The team member repository */
  private _teamMembers: TeamMemberRepository;

  /** Constructs the repository using a database connection and team member repository
   * @param database The database connection
   * @param teamMembers The team member repository
   */
  public constructor(database: Database, teamMembers: TeamMemberRepository) {
    super(database);
    this._teamMembers = teamMembers;
  }

  /** A generic SQL query for selecting typical availability */
  private readonly baseQuery = `
    SELECT id, teamMemberId, dayOfWeek, startTime, endTime, isPreference
    FROM TeamMemberTypicalAvailability
  `;

  /** Converts a database row to a typical availability
   * @param row The database row
   * @returns The typical availability
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

  /** Converts an array of database rows to an array of typical availability
   * @param rows An array of database rows
   * @returns An array of typical availability
   */
  private mapRows(rows: ITypicalAvailabilityRow[]): TypicalAvailability[] {
    return rows.map((row) => this.mapRow(row));
  }

  /** Validates a typical availability
   * @param typicalAvailability The typical availability
   * @returns An array of error messages
   */
  public async validate(
    typicalAvailability: TypicalAvailability,
  ): Promise<string[]> {
    const errors: string[] = [];

    const teamMember = await this._teamMembers.get(
      typicalAvailability.teamMemberId,
    );
    if (teamMember == null) {
      errors.push("The selected team member does not exist.");
    }

    if (typicalAvailability.dayOfWeek == null) {
      errors.push("Please select a day of the week.");
    }

    if (typicalAvailability.startTime == null) {
      errors.push("Please enter a start time.");
    }

    if (typicalAvailability.endTime == null) {
      errors.push("Please enter an end time.");
    }

    if (
      typicalAvailability.startTime != null &&
      typicalAvailability.endTime != null &&
      typicalAvailability.startTime.getTime() >=
        typicalAvailability.endTime.getTime()
    ) {
      errors.push("Start time must be before end time.");
    }

    return errors;
  }

  /** Lists a team member's typical availabilities
   *
   * Typical availabilities are grouped by week, ordered by start time, and then ordered by end time
   *
   * @param teamMemberId The team member id
   * @returns 2D array of typical availabilities
   */
  public async list(teamMemberId: number): Promise<TypicalAvailability[][]> {
    const table: TypicalAvailability[][] = [[], [], [], [], [], [], []];

    const result = await this._database.execute(
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

  /** Gets a typical availability
   *
   * Returns null if the typical availability does not exist
   *
   * @param id The typical availability id
   * @returns The typical availability or null
   */
  public async get(id: number): Promise<TypicalAvailability | null> {
    const result = await this._database.execute(
      `
        ${this.baseQuery}
        WHERE id = ?
      `,
      [id],
    );

    if (!result.rows || result.rows.length == 0) return null;

    return this.mapRow(result.rows[0]);
  }

  /** Adds a typical availability
   * @param typicalAvailability The typical availability
   * @returns The id of the newly added typical availability
   */
  public async add(typicalAvailability: TypicalAvailability): Promise<number> {
    const result = await this._database.execute(
      `
        INSERT INTO TeamMemberTypicalAvailability
          (teamMemberId, dayOfWeek, startTime, endTime, isPreference)
        VALUES
          (?, ?, ?, ?, ?)
      `,
      [
        typicalAvailability.teamMemberId,
        typicalAvailability.dayOfWeek,
        typicalAvailability.startTime,
        typicalAvailability.endTime,
        typicalAvailability.isPreference ? 1 : 0,
      ],
    );

    return result.lastInsertId ?? 0;
  }

  /** Updates a typical availability
   *
   * Refers to the id to update the correct typical availability
   *
   * @param typicalAvailability The typical availability
   */
  public async update(typicalAvailability: TypicalAvailability): Promise<void> {
    await this._database.execute(
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
        typicalAvailability.teamMemberId,
        typicalAvailability.dayOfWeek,
        typicalAvailability.startTime,
        typicalAvailability.endTime,
        typicalAvailability.isPreference,
        typicalAvailability.id,
      ],
    );
  }

  /** Deletes a typical availability
   * @param id A typical availability id
   */
  public async delete(id: number): Promise<void> {
    await this._database.execute(
      `
        DELETE FROM TeamMemberTypicalAvailability
        WHERE id = ?
      `,
      [id],
    );
  }

  /** Determines if a team member is typically available for a time slot
   *
   * If the time slot start date time or end date time are unknown, the availability is unknown
   *
   * @param teamMember
   * @param timeSlot
   * @returns Whether the team member is available
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
