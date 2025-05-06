import Context from "../_framework/Context.ts";
import { IShiftContextRepository } from "../models/repositories/ShiftContextRepository.ts";
import { IShiftContextPreferenceRepository } from "../models/repositories/ShiftContextPreferenceRepository.ts";
import { ITeamMemberRepository } from "../models/repositories/TeamMemberRepository.ts";
import ShiftContextPreferencesEditViewModel from "../models/viewModels/shiftContextPreference/ShiftContextPreferencesEditViewModel.ts";
import Controller from "../_framework/Controller.ts";
import ResponseWrapper from "../_framework/ResponseWrapper.ts";

/** Controls the shift context preference pages */
export default class ShiftContextPreferenceController extends Controller {
  /** The shift context preference repository */
  private _shiftContextPreferences: IShiftContextPreferenceRepository;

  /** The team member repository */
  private _teamMembers: ITeamMemberRepository;

  /** The shift context repository */
  private _shiftContexts: IShiftContextRepository;

  /** Constructs the shift context preference controller using the necessary repositories
   * @param shiftContextPreferences The shift context preference repository
   * @param teamMembers The team member repository
   * @param shiftContexts The shift context repository
   */
  constructor(
    shiftContextPreferences: IShiftContextPreferenceRepository,
    teamMembers: ITeamMemberRepository,
    shiftContexts: IShiftContextRepository,
  ) {
    super();
    this._shiftContextPreferences = shiftContextPreferences;
    this._teamMembers = teamMembers;
    this._shiftContexts = shiftContexts;
    this.routes = [
      {
        method: "GET",
        pattern: "/team-member/(\\d+)/preferences/",
        mappings: [[1, "teamMemberId"]],
        action: this.listGet,
      },
      {
        method: "POST",
        pattern: "/team-member/(\\d+)/preferences/",
        mappings: [[1, "teamMemberId"]],
        action: this.listPost,
      },
    ];
  }

  /** Gets the shift context preference list page for a team member
   * @param context The application context
   * @returns The response
   */
  public async listGet(context: Context): Promise<ResponseWrapper> {
    const teamMemberId = context.routeData.getInt("teamMemberId");
    if (teamMemberId == null) {
      return this.NotFoundResponse(context);
    }

    const teamMember = await this._teamMembers.get(teamMemberId);
    if (teamMember == null) {
      return this.NotFoundResponse(context);
    }

    const shiftContexts = await this._shiftContexts.list();
    const shiftContextPreferences = await this._shiftContextPreferences
      .get(teamMemberId);

    const model = new ShiftContextPreferencesEditViewModel(
      teamMember,
      shiftContexts,
      shiftContextPreferences,
    );

    return this.HTMLResponse(
      context,
      "./views/shiftContextPreference/edit.html",
      model,
    );
  }

  /** Accepts a request to update a team member's shift context preferences
   * @param context The application context
   * @returns The response
   */
  public async listPost(context: Context): Promise<ResponseWrapper> {
    const teamMemberId = context.routeData.getInt("teamMemberId");
    if (teamMemberId == null) {
      return this.NotFoundResponse(context);
    }

    const teamMember = await this._teamMembers.get(teamMemberId);
    if (teamMember == null) {
      return this.NotFoundResponse(context);
    }

    const model = await ShiftContextPreferencesEditViewModel.fromRequest(
      context.request,
    );

    model.errors = await this._shiftContextPreferences.validate(
      model.shiftContextPreferences,
    );

    if (!model.isValid()) {
      return this.HTMLResponse(
        context,
        "./views/shiftContextPreference/edit.html",
        model,
      );
    }

    await this._shiftContextPreferences.update(
      teamMemberId,
      model.shiftContextPreferences,
    );
    return this.RedirectResponse(context, `/team-member/${teamMemberId}/`);
  }
}
