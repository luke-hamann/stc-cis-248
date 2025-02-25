import ShiftContext from "../entities/ShiftContext.ts";
import TeamMember from "../entities/TeamMember.ts";
import FormViewModel from "./_FormViewModel.ts";

export default class ShiftContextPreferencesEditViewModel
  extends FormViewModel {
  teamMember: TeamMember;
  shiftContexts: ShiftContext[];
  shiftContextPreferences: Map<number, boolean>;

  constructor(
    csrf_token: string,
    teamMember: TeamMember,
    shiftContexts: ShiftContext[],
    shiftContextPreferences: Map<number, boolean>,
  ) {
    super(true, [], csrf_token);
    this.teamMember = teamMember;
    this.shiftContexts = shiftContexts;
    this.shiftContextPreferences = shiftContextPreferences;
  }

  public isPref(shiftContextId: number): boolean {
    const preference = this.shiftContextPreferences.get(shiftContextId);
    if (preference === undefined) return false;
    return preference;
  }

  public isNeutral(shiftContextId: number): boolean {
    return !this.shiftContextPreferences.has(shiftContextId);
  }
}
