import TeamMember from "./TeamMember.ts";

export default class SubstituteRecommendation {
  public teamMember: TeamMember;
  public doesNotWork: boolean;

  public constructor(teamMember: TeamMember, doesNotWork: boolean) {
    this.teamMember = teamMember;
    this.doesNotWork = doesNotWork;
  }
}
