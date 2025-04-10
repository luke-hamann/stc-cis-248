import FormViewModel from "../_shared/_FormViewModel.ts";
import TeamMember from "../../entities/TeamMember.ts";
import SubstituteList from "../../entities/SubstituteList.ts";

/** A view model for viewing and editing daily substitute lists */
export default class SubstitutesEditViewModel extends FormViewModel {
  /** The substitute list for the day */
  public substituteList: SubstituteList;

  /** The list of team members that may serve as substitutes */
  public teamMembers: TeamMember[];

  /** Constructs the view model
   * @param substituteList
   * @param teamMembers
   */
  constructor(
    substituteList: SubstituteList,
    teamMembers: TeamMember[],
  ) {
    super(true, []);
    this.substituteList = substituteList;
    this.teamMembers = teamMembers;
  }

  /** Constructs the view model based on incoming form data
   * @param request The incoming HTTP request
   * @returns The view model
   */
  public static async fromRequest(
    request: Request,
  ): Promise<SubstitutesEditViewModel> {
    const formData = await request.formData();

    const teamMemberIds: number[] = [];
    for (const key of formData.keys()) {
      const teamMemberId = parseInt(key);
      if (isNaN(teamMemberId)) continue;
      teamMemberIds.push(teamMemberId);
    }

    const teamMembers = teamMemberIds.map((id) =>
      new TeamMember(
        id,
        "",
        "",
        "",
        null,
        "",
        "",
        false,
        null,
        null,
        "",
        "",
        false,
      )
    );
    const substituteList = new SubstituteList(new Date(), teamMembers);

    return new SubstitutesEditViewModel(substituteList, []);
  }
}
