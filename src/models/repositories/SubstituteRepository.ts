import Database from "./_Database.ts";
import Repository from "./_Repository.ts";
import TeamMember from "../entities/TeamMember.ts";
import TeamMemberRepository from "./TeamMemberRepository.ts";
import SubstituteList from "../entities/SubstituteList.ts";

/** Represents actions for manipulating daily substitute lists */
export interface ISubstituteRepository {
  /**
   * Validates a list of team member ids to use as substitutes
   * @param teamMemberIds The list of team member ids
   * @returns A promise of an array of error messages
   */
  validate(substituteList: SubstituteList): Promise<string[]>;

  /**
   * Gets the substitute list for a given date
   * @param date The date
   * @returns The substitute list
   */
  getSubstituteList(date: Date): Promise<SubstituteList>;

  /**
   * Updates substitutes for a given day
   * @param substituteList The substitute list
   */
  update(substituteList: SubstituteList): Promise<void>;

  /**
   * Deletes all substitutes within a date range
   * @param start The start date
   * @param end The end date
   */
  deleteWhere(start: Date, end: Date): Promise<void>;
}

/** Represents a substitute database row */
export interface ISubstituteRow {
  /** The date of the substitute */
  date: Date;

  /** The id of the substitute team member */
  id: number;

  /** The first name of the substitute team member */
  firstName: string;

  /** The middle name of the substitute team member */
  middleName: string;

  /** The last name of the substitute team member */
  lastName: string;
}

/** A repository for manipulating daily substitute lists */
export default class SubstituteRepository extends Repository
  implements ISubstituteRepository {
  /** The team member repository */
  private _teamMembers: TeamMemberRepository;

  /**
   * Constructs the repository given a database connection and a team member repository
   * @param database
   * @param teamMembers
   */
  public constructor(database: Database, teamMembers: TeamMemberRepository) {
    super(database);
    this._teamMembers = teamMembers;
  }

  /**
   * Converts a substitute database row to a team member
   * @param row The database row
   * @returns The team member
   */
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

  /**
   * Converts an array of substitute database rows to an array of team members
   * @param rows The database rows
   * @returns The team members
   */
  private mapRowsToSubstitutes(rows: ISubstituteRow[]): TeamMember[] {
    return rows.map((row) => this.mapRowToSubstitute(row));
  }

  /**
   * Validates a list of team member ids to use as substitutes
   * @param teamMemberIds The list of team member ids
   * @returns A promise of an array of error messages
   */
  public async validate(substituteList: SubstituteList): Promise<string[]> {
    const errors: string[] = [];

    if (substituteList.date == null) {
      errors.push("A date is required to specify substitutes.");
    }

    for (const id of substituteList.teamMemberIds) {
      const teamMember = await this._teamMembers.get(id);
      if (teamMember == null) {
        errors.push("A selected team member does not exist.");
        break;
      }
    }

    return errors;
  }

  /**
   * Gets the substitute list for a given date
   * @param date The date
   * @returns The substitute list
   */
  public async getSubstituteList(date: Date): Promise<SubstituteList> {
    const result = await this._database.execute(
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

  /**
   * Updates substitutes for a given day
   * @param substituteList The substitute list
   */
  public async update(substituteList: SubstituteList): Promise<void> {
    await this._database.execute(
      `
        DELETE FROM Substitutes
        WHERE date = ?
      `,
      [substituteList.date],
    );

    for (const teamMember of substituteList.teamMembers) {
      await this._database.execute(
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
   * @param start The start date
   * @param end The end date
   */
  public async deleteWhere(start: Date, end: Date): Promise<void> {
    await this._database.execute(
      `
        DELETE FROM Substitutes
        WHERE date BETWEEN ? AND ?
      `,
      [start, end],
    );
  }
}
