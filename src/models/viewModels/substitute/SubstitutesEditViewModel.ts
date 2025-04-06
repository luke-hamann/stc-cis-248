import FormViewModel from "../_shared/_FormViewModel.ts";
import TeamMember from "../../entities/TeamMember.ts";
import SubstituteList from "../../entities/SubstituteList.ts";

export default class SubstitutesEditViewModel extends FormViewModel {
  public substituteList: SubstituteList;
  public teamMembers: TeamMember[];

  constructor(
    substituteList: SubstituteList,
    teamMembers: TeamMember[],
  ) {
    super(true, []);
    this.substituteList = substituteList;
    this.teamMembers = teamMembers;
  }

  /** Maps an HTTP request to a substitutes edit view model
   * @param request Fetch HTTP request
   * @returns New model
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
