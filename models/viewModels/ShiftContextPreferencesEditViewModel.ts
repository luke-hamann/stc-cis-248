import ShiftContext from "../entities/ShiftContext.ts";
import TeamMember from "../entities/TeamMember.ts";
import FormViewModel from "./_FormViewModel.ts";

export default class ShiftContextPreferencesEditViewModel
  extends FormViewModel {
  teamMember: TeamMember | null;
  shiftContexts: ShiftContext[];
  shiftContextPreferences: { preferable: number[]; unpreferable: number[] };

  public constructor(
    csrf_token: string,
    teamMember: TeamMember | null,
    shiftContexts: ShiftContext[],
    shiftContextPreferences: { preferable: number[]; unpreferable: number[] },
  ) {
    super(true, [], csrf_token);
    this.teamMember = teamMember;
    this.shiftContexts = shiftContexts;
    this.shiftContextPreferences = shiftContextPreferences;
  }

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
      "",
      null,
      [],
      shiftContextPreferences,
    );
  }
}
