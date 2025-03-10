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

  public async getSubstituteIds(date: Date): Promise<number[]> {
    const result = await this.database.execute(
      `
        SELECT teamMemberId
        FROM Substitutes
        WHERE date = ?
      `,
      [date.toISOString().substring(0, 10)],
    );

    if (!result.rows) return [];

    return (result.rows as unknown as { teamMemberId: number }[]).map((row) =>
      row.teamMemberId
    );
  }

  public async updateSubstitutesIds(
    date: Date,
    teamMemberIds: number[],
  ): Promise<void> {
    const dateString = date.toISOString().substring(0, 10);

    await this.database.execute(
      `
        DELETE FROM Substitutes
        WHERE date = ?
      `,
      [dateString],
    );

    for (const teamMemberId of teamMemberIds) {
      await this.database.execute(
        `
          INSERT INTO Substitutes (teamMemberId, date)
          VALUES (?, ?)
        `,
        [teamMemberId, dateString],
      );
    }
  }

  public async getSubstitutesInRange(
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
      [
        start.toISOString().substring(0, 10),
        end.toISOString().substring(0, 10),
      ],
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
}
