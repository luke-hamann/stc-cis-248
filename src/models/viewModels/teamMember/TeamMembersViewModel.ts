import ViewModel from "../_shared/_ViewModel.ts";
import TeamMember from "../../entities/TeamMember.ts";

export default class TeamMembersViewModel extends ViewModel {
  public teamMembers: TeamMember[] = [];

  public constructor(teamMembers: TeamMember[]) {
    super();
    this.teamMembers = teamMembers;
  }
}
