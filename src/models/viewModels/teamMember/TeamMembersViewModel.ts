import ViewModel from "../_shared/_ViewModel.ts";
import TeamMember from "../../entities/TeamMember.ts";

/** A view model for displaying a list of team members */
export default class TeamMembersViewModel extends ViewModel {
  /** The team members */
  public teamMembers: TeamMember[] = [];

  /** Constructs the view model
   * @param teamMembers
   */
  public constructor(teamMembers: TeamMember[]) {
    super();
    this.teamMembers = teamMembers;
  }
}
