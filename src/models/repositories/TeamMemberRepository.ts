import TeamMember from "../entities/TeamMember.ts";
import Repository from "./_Repository.ts";

/** Represents actions for manipulating a set of team members */
export interface ITeamMemberRepository {
  /** Validates a team member
   * @param teamMember The team member
   * @returns An array of error messages
   */
  validate(teamMember: TeamMember): string[];

  /** Lists all team members
   * @returns An array of team members
   */
  list(): Promise<TeamMember[]>;

  /** Gets a team member
   *
   * Returns null if the team member does not exist
   *
   * @param id The id of the team member
   * @returns The team member or null
   */
  get(id: number): Promise<TeamMember | null>;

  /** Adds a team member
   * @param teamMember The team member
   * @returns The id of the newly added team member
   */
  add(teamMember: TeamMember): Promise<number>;

  /** Updates a team member
   *
   * Refers to the id to update the correct team member
   *
   * @param teamMember
   */
  update(teamMember: TeamMember): Promise<void>;

  /** Deletes a team member
   * @param id The team member id
   */
  delete(id: number): Promise<void>;
}

/** Represents a team member database row */
export interface ITeamMemberRow {
  /** The team member's id */
  id: number;

  /** The team member's first name */
  firstName: string;

  /** The team member's middle name */
  middleName: string;

  /** The team member's last name */
  lastName: string;

  /** The team member's birth date */
  birthDate: Date;

  /** The team member's email address */
  email: string;

  /** The team member's phone number */
  phone: string;

  /** Whether the team member is an external resource
   *
   * 0 is false, 1 is true.
   */
  isExternal: number;

  /** The maximum number of hours per week the team member can work */
  maxWeeklyHours: number;

  /** The maximum number of days per week the team member can work */
  maxWeeklyDays: number;

  /** The team member's username */
  username: string;

  /** The team member's password */
  password: string;

  /** Whether the team member is an admin user */
  isAdmin: boolean;
}

export default class TeamMemberRepository extends Repository
  implements ITeamMemberRepository {
  /** A generic SQL query for selecting team members */
  private baseQuery: string = `
    SELECT id, firstName, middleName, lastName, birthDate, email, phone,
      isExternal, maxWeeklyHours, maxWeeklyDays, username, password, isAdmin
    FROM TeamMembers
  `;

  /** Converts a database row to a team member
   * @param row The database row
   * @returns The team member
   */
  private mapRowToTeamMember(row: ITeamMemberRow): TeamMember {
    return new TeamMember(
      row.id,
      row.firstName,
      row.middleName,
      row.lastName,
      new Date(
        row.birthDate.getUTCFullYear(),
        row.birthDate.getUTCMonth(),
        row.birthDate.getUTCDate(),
      ),
      row.email,
      row.phone,
      row.isExternal == 1,
      row.maxWeeklyHours,
      row.maxWeeklyDays,
      row.username,
      row.password,
      row.isAdmin,
    );
  }

  /** Converts an array of database rows to an array of team members
   * @param rows The array of database rows
   * @returns The array of team members
   */
  private mapRowsToTeamMembers(rows: ITeamMemberRow[]): TeamMember[] {
    return rows.map((row) => this.mapRowToTeamMember(row));
  }

  /** Validates a team member
   * @param teamMember The team member
   * @returns An array of error messages
   */
  public validate(teamMember: TeamMember): string[] {
    const errors: string[] = [];

    if (teamMember.firstName.trim() == "") {
      errors.push("Please enter a first name.");
    }

    if (teamMember.lastName.trim() == "") {
      errors.push("Please enter a last name.");
    }

    if (teamMember.birthDate == null) {
      errors.push("Please enter a birth date.");
    } else if (teamMember.birthDate.getTime() >= new Date().getTime()) {
      errors.push("Please enter a birth date in the past.");
    }

    if (
      teamMember.maxWeeklyHours != null &&
      (teamMember.maxWeeklyHours < 0 || teamMember.maxWeeklyHours > (7 * 24))
    ) {
      errors.push(`Max weekly hours must be between 0 and ${7 * 24}.`);
    }

    if (
      teamMember.maxWeeklyDays != null &&
      (teamMember.maxWeeklyDays < 0 || teamMember.maxWeeklyDays > 7)
    ) {
      errors.push("Max weekly days must be between 0 and 7.");
    }

    return errors;
  }

  /** Lists all team members
   * @returns An array of team members
   */
  public async list(): Promise<TeamMember[]> {
    const result = await this._database.execute(`
      ${this.baseQuery}
      ORDER BY isExternal,
        LOWER(lastName),
        LOWER(firstName),
        LOWER(middleName)
    `);

    return this.mapRowsToTeamMembers(result.rows as ITeamMemberRow[]);
  }

  /** Gets a team member
   *
   * Returns null if the team member does not exist
   *
   * @param id The id of the team member
   * @returns The team member or null
   */
  public async get(id: number): Promise<TeamMember | null> {
    const result = await this._database.execute(
      `
      ${this.baseQuery}
      WHERE id = ?
    `,
      [id],
    );

    return (result.rows && result.rows.length > 0)
      ? this.mapRowToTeamMember(result.rows[0])
      : null;
  }

  /** Adds a team member
   * @param teamMember The team member
   * @returns The id of the newly added team member
   */
  public async add(teamMember: TeamMember): Promise<number> {
    const result = await this._database.execute(
      `
      INSERT INTO TeamMembers
      (firstName, middleName, lastName, birthDate, email, phone, isExternal,
       maxWeeklyHours, maxWeeklyDays)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        teamMember.firstName,
        teamMember.middleName,
        teamMember.lastName,
        teamMember.birthDate,
        teamMember.email,
        teamMember.phone,
        teamMember.isExternal,
        teamMember.maxWeeklyHours,
        teamMember.maxWeeklyDays,
      ],
    );

    return result.lastInsertId ?? 0;
  }

  /** Updates a team member
   *
   * Refers to the id to update the correct team member
   *
   * @param teamMember
   */
  public async update(teamMember: TeamMember): Promise<void> {
    await this._database.execute(
      `
      UPDATE TeamMembers
      SET firstName = ?,
        middleName = ?,
        lastName = ?,
        birthDate = ?,
        email = ?,
        phone = ?,
        isExternal = ?,
        maxWeeklyHours = ?,
        maxWeeklyDays = ?
      WHERE id = ?
    `,
      [
        teamMember.firstName,
        teamMember.middleName,
        teamMember.lastName,
        teamMember.birthDate,
        teamMember.email,
        teamMember.phone,
        teamMember.isExternal,
        teamMember.maxWeeklyHours,
        teamMember.maxWeeklyDays,
        teamMember.id,
      ],
    );
  }

  /** Deletes a team member
   * @param id The team member id
   */
  public async delete(id: number): Promise<void> {
    await this._database.execute("DELETE FROM TeamMembers WHERE id = ?", [id]);
  }
}
