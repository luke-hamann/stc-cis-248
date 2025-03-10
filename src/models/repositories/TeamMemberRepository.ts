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
  isExternal: boolean;
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

  private mapRowToTeamMember(row: ITeamMember): TeamMember {
    return new TeamMember(
      row.id,
      row.firstName,
      row.middleName,
      row.lastName,
      row.birthDate,
      row.email,
      row.phone,
      row.isExternal,
      row.maxWeeklyHours,
      row.maxWeeklyDays,
      row.username,
      row.password,
      row.isAdmin,
    );
  }

  private mapRowsToTeamMembers(rows: ITeamMember[]): TeamMember[] {
    return rows.map((row) => this.mapRowToTeamMember(row));
  }

  public async validateTeamMember(
    teamMember: TeamMember,
  ): Promise<string[]> {
    return await Promise.resolve([]);
  }

  public async getTeamMembers(): Promise<TeamMember[]> {
    const result = await this.database.execute(`
      ${this.baseQuery}
      ORDER BY isExternal,
        LOWER(lastName),
        LOWER(firstName),
        LOWER(middleName)
    `);

    return this.mapRowsToTeamMembers(result.rows as ITeamMember[]);
  }

  public async getTeamMember(id: number): Promise<TeamMember | null> {
    const result = await this.database.execute(
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

  public async addTeamMember(t: TeamMember): Promise<number> {
    const result = await this.database.execute(
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
        t.birthDate?.toISOString() ?? null,
        t.email,
        t.phone,
        t.isExternal,
        t.maxWeeklyHours,
        t.maxWeeklyDays,
      ],
    );

    return result.lastInsertId ?? 0;
  }

  public async updateTeamMember(t: TeamMember): Promise<void> {
    await this.database.execute(
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
        t.birthDate?.toISOString() ?? null,
        t.email,
        t.phone,
        t.isExternal,
        t.maxWeeklyHours,
        t.maxWeeklyDays,
        t.id,
      ],
    );
  }

  public async deleteTeamMember(id: number): Promise<void> {
    await this.database.execute("DELETE FROM TeamMembers WHERE id = ?", [id]);
  }
}
