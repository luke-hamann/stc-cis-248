import TeamMember from "./TeamMember.ts";

/** Represents a substitute assignment */
export default class Substitute {
  /** The id of the team member */
  public teamMemberId: number = 0;

  /** The associated team member */
  public teamMember: TeamMember | null = null;

  /** The date of the substitute assignment */
  public date: Date | null = null;

  /**
   * Constructs the substitute assignment
   * @param teamMemberId
   * @param teamMember
   * @param date
   */
  public constructor(
    teamMemberId: number,
    teamMember: TeamMember | null,
    date: Date | null,
  ) {
    this.teamMemberId = teamMemberId;
    this.teamMember = teamMember;
    this.date = date;
  }
}
