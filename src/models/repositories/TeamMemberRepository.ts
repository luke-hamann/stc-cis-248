import TeamMember from "../entities/TeamMember.ts";
import Repository from "./_Repository.ts";

export interface ITeamMemberRow {
  id: number;
  firstName: string;
  middleName: string;
  lastName: string;
  birthDate: Date;
  email: string;
  phone: string;
  isExternal: number;
  maxWeeklyHours: number;
  maxWeeklyDays: number;
  username: string;
  password: string;
  isAdmin: boolean;
}

export default class TeamMemberRepository extends Repository {
  private baseQuery: string = `
    SELECT id, firstName, middleName, lastName, birthDate, email, phone,
      isExternal, maxWeeklyHours, maxWeeklyDays, username, password, isAdmin
    FROM TeamMembers
  `;

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

  private mapRowsToTeamMembers(rows: ITeamMemberRow[]): TeamMember[] {
    return rows.map((row) => this.mapRowToTeamMember(row));
  }

  public validate(t: TeamMember): string[] {
    const errors: string[] = [];

    if (t.firstName.trim() == "") {
      errors.push("Please enter a first name.");
    }

    if (t.lastName.trim() == "") {
      errors.push("Please enter a last name.");
    }

    if (t.birthDate == null) {
      errors.push("Please enter a birth date.");
    } else if (t.birthDate.getTime() >= new Date().getTime()) {
      errors.push("Please enter a birth date in the past.");
    }

    if (
      t.maxWeeklyHours != null &&
      (t.maxWeeklyHours < 0 || t.maxWeeklyHours > (7 * 24))
    ) {
      errors.push(`Max weekly hours must be between 0 and ${7 * 24}.`);
    }

    if (
      t.maxWeeklyDays != null &&
      (t.maxWeeklyDays < 0 || t.maxWeeklyDays > 7)
    ) {
      errors.push("Max weekly days must be between 0 and 7.");
    }

    return errors;
  }

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

  public async add(t: TeamMember): Promise<number> {
    const result = await this._database.execute(
      `
      INSERT INTO TeamMembers
      (firstName, middleName, lastName, birthDate, email, phone, isExternal,
       maxWeeklyHours, maxWeeklyDays)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        t.firstName,
        t.middleName,
        t.lastName,
        t.birthDate,
        t.email,
        t.phone,
        t.isExternal,
        t.maxWeeklyHours,
        t.maxWeeklyDays,
      ],
    );

    return result.lastInsertId ?? 0;
  }

  public async update(t: TeamMember): Promise<void> {
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
        t.firstName,
        t.middleName,
        t.lastName,
        t.birthDate,
        t.email,
        t.phone,
        t.isExternal,
        t.maxWeeklyHours,
        t.maxWeeklyDays,
        t.id,
      ],
    );
  }

  public async delete(id: number): Promise<void> {
    await this._database.execute("DELETE FROM TeamMembers WHERE id = ?", [id]);
  }
}
