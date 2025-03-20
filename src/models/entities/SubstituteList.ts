import TeamMember from "./TeamMember.ts";

export default class SubstituteList {
  public date: Date;
  public teamMembers: TeamMember[];

  constructor(date: Date, teamMembers: TeamMember[]) {
    this.date = date;
    this.teamMembers = teamMembers;
  }

  public toString() {
    return `${this.date}: ${this.teamMembers.join(", ")}`;
  }

  public get teamMemberIds() {
    return this.teamMembers.map((teamMember) => teamMember.id);
  }
}
