import IViewModel from "../_shared/IViewModel.ts";
import TeamMember from "../../entities/TeamMember.ts";

export default class TeamMembersViewModel implements IViewModel {
  csrf_token: string = "";
  teamMembers: TeamMember[] = [];

  public constructor(teamMembers: TeamMember[]) {
    this.teamMembers = teamMembers;
  }
}
