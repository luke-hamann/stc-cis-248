import IViewModel from "../_shared/IViewModel.ts";
import TeamMember from "../../entities/TeamMember.ts";

export default class TeamMembersViewModel implements IViewModel {
  csrf_token: string;
  teamMembers: TeamMember[] = [];

  public constructor(teamMembers: TeamMember[], csrf_token: string) {
    this.teamMembers = teamMembers;
    this.csrf_token = csrf_token;
  }
}
