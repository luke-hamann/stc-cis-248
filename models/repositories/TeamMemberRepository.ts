import TeamMember from "../entities/TeamMember.ts";
import Database from "./_Database.ts";

export default class TeamMemberRepository {
  static baseQuery: string = `
    SELECT id, firstName, middleName, lastName, birthDate, email, phone,
      isExternal, maxWeeklyHours, maxWeeklyDays, username, password, isAdmin
    FROM TeamMembers
  `;

  private static mapRowToTeamMember(row: ITeamMember): TeamMember {
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

  private static mapRowsToTeamMembers(rows: ITeamMember[]): TeamMember[] {
    return rows.map((row) => this.mapRowToTeamMember(row));
  }

  public static async validateTeamMember(
    teamMember: TeamMember,
  ): Promise<string[]> {
    return await Promise.resolve([]);
  }

  public static async getTeamMembers(): Promise<TeamMember[]> {
    const result = await Database.execute(`
      ${TeamMemberRepository.baseQuery}
      ORDER BY isExternal,
        LOWER(lastName),
        LOWER(firstName),
        LOWER(middleName)
    `);

    return this.mapRowsToTeamMembers(result.rows as ITeamMember[]);
  }

  public static async getTeamMember(id: number): Promise<TeamMember | null> {
    const result = await Database.execute(
      `
      ${TeamMemberRepository.baseQuery}
      WHERE id = ?
    `,
      [id],
    );

    return (result.rows && result.rows.length > 0)
      ? this.mapRowToTeamMember(result.rows[0])
      : null;
  }

  public static async addTeamMember(t: TeamMember): Promise<number> {
    const result = await Database.execute(
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

  public static async updateTeamMember(t: TeamMember): Promise<void> {
    await Database.execute(
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

  public static async deleteTeamMember(id: number): Promise<void> {
    await Database.execute("DELETE FROM TeamMembers WHERE id = ?", [id]);
  }
}
