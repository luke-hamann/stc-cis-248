import TeamMember from "../../entities/TeamMember.ts";

export default class TeamMembersViewModel {
  teamMembers: TeamMember[] = [];

  public constructor(teamMembers: TeamMember[]) {
    this.teamMembers = teamMembers;
  }
}
