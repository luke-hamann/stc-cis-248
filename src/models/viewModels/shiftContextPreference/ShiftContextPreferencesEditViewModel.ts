import ShiftContext from "../../entities/ShiftContext.ts";
import TeamMember from "../../entities/TeamMember.ts";
import FormViewModel from "../_shared/_FormViewModel.ts";

/** A view model for the team member shift context preference add/edit form */
export default class ShiftContextPreferencesEditViewModel
  extends FormViewModel {
  /** The team member who the preferences are for */
  teamMember: TeamMember | null;

  /** The list of shift contexts */
  shiftContexts: ShiftContext[];

  /** The team member shift context preferences
   *
   * * "preferable" is a list of ids for preferable shift contexts
   * * "unpreferable" is a list of ids for unpreferable shift contexts
   * * Unlisted shift context ids are neither preferred or unpreferred
   */
  shiftContextPreferences: { preferable: number[]; unpreferable: number[] };

  /** Constructs the view model
   * @param teamMember
   * @param shiftContexts
   * @param shiftContextPreferences
   */
  public constructor(
    teamMember: TeamMember | null,
    shiftContexts: ShiftContext[],
    shiftContextPreferences: { preferable: number[]; unpreferable: number[] },
  ) {
    super(true, []);
    this.teamMember = teamMember;
    this.shiftContexts = shiftContexts;
    this.shiftContextPreferences = shiftContextPreferences;
  }

  /** Constructs the view model using incoming form data
   * @param request The HTTP request
   * @returns The view model
   */
  public static async fromRequest(
    request: Request,
  ): Promise<ShiftContextPreferencesEditViewModel> {
    const formData: FormData = await request.formData();
    const preferable: number[] = [];
    const unpreferable: number[] = [];

    for (const key of formData.keys()) {
      const shiftContextId = parseInt(key);
      if (isNaN(shiftContextId)) continue;

      const choice = formData.get(key) ?? "";
      if (choice == "positive") {
        preferable.push(shiftContextId);
      } else if (choice == "negative") {
        unpreferable.push(shiftContextId);
      }
    }

    const shiftContextPreferences = { preferable, unpreferable };

    return new ShiftContextPreferencesEditViewModel(
      null,
      [],
      shiftContextPreferences,
    );
  }
}
