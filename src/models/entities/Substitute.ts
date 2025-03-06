import TeamMember from "./TeamMember.ts";

export default class Substitute {
  public teamMemberId: number = 0;
  public teamMember: TeamMember | null = null;
  public date: Date | null = null;

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
