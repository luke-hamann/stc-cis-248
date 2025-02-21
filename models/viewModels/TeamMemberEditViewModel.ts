import TeamMember from "../entities/TeamMember.ts";
import FormViewModel from "./_FormViewModel.ts";

export default class TeamMemberEditViewModel extends FormViewModel {
  teamMember: TeamMember = TeamMember.empty();

  public constructor(
    isEdit: boolean,
    errors: string[],
    csrf_token: string,
    teamMember: TeamMember,
  ) {
    super(isEdit, errors, csrf_token);
    this.teamMember = teamMember;
  }

  public static empty(): TeamMemberEditViewModel {
    return new TeamMemberEditViewModel(false, [], "", TeamMember.empty());
  }

  public static async fromRequest(
    request: Request,
  ): Promise<TeamMemberEditViewModel> {
    const formData = await request.formData();

    const get = (key: string) => formData.get(key) as string ?? "";

    const id = Number(get("id"));
    const firstName = get("firstName");
    const middleName = get("middleName");
    const lastName = get("lastName");

    const timestamp = Date.parse(get("birthDate"));
    if (isNaN(timestamp)) {
      const birthDate = null;
    } else {
      
    }
    if (!isNaN(Date.parse(get("birthDate")))
    if (birthDate == "Invalid Date") birthDate = null;
  }
}
