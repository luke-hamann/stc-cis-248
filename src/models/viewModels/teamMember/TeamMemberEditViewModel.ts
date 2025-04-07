import FormDataWrapper from "../../../_framework/FormDataWrapper.ts";
import TeamMember from "../../entities/TeamMember.ts";
import FormViewModel from "../_shared/_FormViewModel.ts";

/** The view model for the team member add/edit form */
export default class TeamMemberEditViewModel extends FormViewModel {
  /** The team member being added/edited */
  teamMember: TeamMember = TeamMember.empty();

  /** Constructs the view model
   * @param isEdit
   * @param errors
   * @param teamMember
   */
  public constructor(
    isEdit: boolean,
    errors: string[],
    teamMember: TeamMember,
  ) {
    super(isEdit, errors);
    this.teamMember = teamMember;
  }

  /** Constructs a view model with default values
   * @returns The view model
   */
  public static empty(): TeamMemberEditViewModel {
    return new TeamMemberEditViewModel(false, [], TeamMember.empty());
  }

  /** Constructs a view model using incoming form data
   * @param request The incoming HTTP request
   * @returns The view model
   */
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
