import Repository from "./_Repository.ts";
import Substitute from "../entities/Substitute.ts";
import TeamMember from "../entities/TeamMember.ts";

export interface ISubstituteRowShort {
  teamMemberId: number;
  date: string;
  firstName: string;
  lastName: string;
}

export default class SubstituteRepository extends Repository {
  public async validate(substituteIds: number[]): Promise<string[]> {
    return await Promise.resolve([]);
  }

  public async getIds(date: Date): Promise<number[]> {
    const result = await this.database.execute(
      `
        SELECT teamMemberId
        FROM Substitutes
        WHERE date = ?
      `,
      [date],
    );

    if (!result.rows) return [];

    return (result.rows as unknown as { teamMemberId: number }[]).map((row) =>
      row.teamMemberId
    );
  }

  public async updateIds(
    date: Date,
    teamMemberIds: number[],
  ): Promise<void> {
    await this.database.execute(
      `
        DELETE FROM Substitutes
        WHERE date = ?
      `,
      [date],
    );

    for (const teamMemberId of teamMemberIds) {
      await this.database.execute(
        `
          INSERT INTO Substitutes (teamMemberId, date)
          VALUES (?, ?)
        `,
        [teamMemberId, date],
      );
    }
  }

  public async getInDateRange(
    start: Date,
    end: Date,
  ): Promise<Substitute[]> {
    const result = await this.database.execute(
      `
        SELECT teamMemberId, date, firstName, lastName
        FROM Substitutes s
        JOIN TeamMembers t ON s.teamMemberId = t.id
        WHERE date BETWEEN ? AND ?
      `,
      [start, end]
    );

    if (!result.rows) return [];

    const rows: ISubstituteRowShort[] = result.rows;

    return rows.map((row) => {
      const date = new Date(row.date);
      const teamMember = new TeamMember(
        row.teamMemberId,
        row.firstName,
        "",
        row.lastName,
        null,
        "",
        "",
        false,
        null,
        null,
        "",
        "",
        false,
      );
      return new Substitute(row.teamMemberId, teamMember, date);
    });
  }

  public async getOnDate(date: Date): Promise<Substitute[]> {
    return await this.getInDateRange(date, date);
  }

  public async deleteInDateRange(
    start: Date,
    end: Date,
  ): Promise<void> {
    await this.database.execute(
      `
        DELETE FROM Substitutes
        WHERE date BETWEEN ? AND ?
      `,
      [start, end],
    );
  }
}
