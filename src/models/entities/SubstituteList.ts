import TeamMember from "./TeamMember.ts";

/** Represents a list of substitutes on a given date */
export default class SubstituteList {
  /** The date of the substitutions */
  public date: Date;

  /** The list of substitutes */
  public teamMembers: TeamMember[];

  /**
   * Constructs the substitute list
   * @param date
   * @param teamMembers
   */
  constructor(date: Date, teamMembers: TeamMember[]) {
    this.date = date;
    this.teamMembers = teamMembers;
  }

  /** Gets the ids of all team members in the list */
  public get teamMemberIds(): number[] {
    return this.teamMembers.map((teamMember) => teamMember.id);
  }
}
