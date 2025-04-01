import FormDataWrapper from "../../../_framework/FormDataWrapper.ts";
import TeamMember from "../../entities/TeamMember.ts";
import FormViewModel from "../_shared/_FormViewModel.ts";

export default class TeamMemberEditViewModel extends FormViewModel {
  teamMember: TeamMember = TeamMember.empty();

  public constructor(
    isEdit: boolean,
    errors: string[],
    teamMember: TeamMember,
  ) {
    super(isEdit, errors);
    this.teamMember = teamMember;
  }

  public static empty(): TeamMemberEditViewModel {
    return new TeamMemberEditViewModel(false, [], TeamMember.empty());
  }

  public static async fromRequest(
    request: Request,
  ): Promise<TeamMemberEditViewModel> {
    const formData = new FormDataWrapper(await request.formData());

    return new TeamMemberEditViewModel(
      false,
      [],
      new TeamMember(
        formData.getInt("id") ?? 0,
        formData.getString("firstName"),
        formData.getString("middleName"),
        formData.getString("lastName"),
        formData.getDate("birthDate"),
        formData.getString("email"),
        formData.getString("phone"),
        formData.getBool("isExternal"),
        formData.getInt("maxWeeklyHours"),
        formData.getInt("maxWeeklyDays"),
        "",
        "",
        false,
      ),
    );
  }
}
