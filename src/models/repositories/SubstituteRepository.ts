import Database from "./_Database.ts";
import Repository from "./_Repository.ts";
import TeamMember from "../entities/TeamMember.ts";
import TeamMemberRepository from "./TeamMemberRepository.ts";
import SubstituteList from "../entities/SubstituteList.ts";

export interface ISubstituteRow {
  date: Date;
  id: number;
  firstName: string;
  middleName: string;
  lastName: string;
}

export default class SubstituteRepository extends Repository {
  private teamMembers: TeamMemberRepository;

  public constructor(database: Database, teamMembers: TeamMemberRepository) {
    super(database);
    this.teamMembers = teamMembers;
  }

  private mapRowToSubstitute(row: ISubstituteRow): TeamMember {
    return new TeamMember(
      row.id,
      row.firstName,
      row.middleName,
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
  }

  private mapRowsToSubstitutes(rows: ISubstituteRow[]): TeamMember[] {
    return rows.map((row) => this.mapRowToSubstitute(row));
  }

  /**
   * Validate a list of team member ids to use as substitutes
   * @param teamMemberIds The list of team member ids
   * @returns A promise of an array of error messages
   */
  public async validate(substituteList: SubstituteList): Promise<string[]> {
    const errors: string[] = [];

    if (substituteList.date == null) {
      errors.push("A date is required to specify substitutes.");
    }

    for (const id of substituteList.teamMemberIds) {
      const teamMember = await this.teamMembers.get(id);
      if (teamMember == null) {
        errors.push("A selected team member does not exist.");
        break;
      }
    }

    return errors;
  }

  public async getSubstituteList(date: Date): Promise<SubstituteList> {
    const result = await this.database.execute(
      `
        SELECT t.id, t.firstName, t.middleName, t.lastName
        FROM Substitutes s
        JOIN TeamMembers t ON s.teamMemberId = t.id
        WHERE s.date = ?
      `,
      [date],
    );

    if (!result.rows) return new SubstituteList(date, []);

    return new SubstituteList(date, this.mapRowsToSubstitutes(result.rows));
  }

  public async update(substituteList: SubstituteList): Promise<void> {
    await this.database.execute(
      `
        DELETE FROM Substitutes
        WHERE date = ?
      `,
      [substituteList.date],
    );

    for (const teamMember of substituteList.teamMembers) {
      await this.database.execute(
        `
          INSERT INTO Substitutes (teamMemberId, date)
          VALUES (?, ?)
        `,
        [teamMember.id, substituteList.date],
      );
    }
  }

  /**
   * Deletes all substitutes within a date range
   * @param start Starting date
   * @param end Ending date
   */
  public async deleteDateRange(start: Date, end: Date): Promise<void> {
    await this.database.execute(
      `
        DELETE FROM Substitutes
        WHERE date BETWEEN ? AND ?
      `,
      [start, end],
    );
  }
}
