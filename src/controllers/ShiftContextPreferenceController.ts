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
  private _shiftContextPreferenceRepository: IShiftContextPreferenceRepository;

  /** The team member repository */
  private _teamMemberRepository: ITeamMemberRepository;

  /** The shift context repository */
  private _shiftContextRepository: IShiftContextRepository;

  /** Constructs the shift context preference controller using the necessary repositories
   * @param shiftContextPreferenceRepository The shift context preference repository
   * @param teamMemberRepository The team member repository
   * @param shiftContextRepository The shift context repository
   */
  constructor(
    shiftContextPreferenceRepository: IShiftContextPreferenceRepository,
    teamMemberRepository: ITeamMemberRepository,
    shiftContextRepository: IShiftContextRepository,
  ) {
    super();
    this._shiftContextPreferenceRepository = shiftContextPreferenceRepository;
    this._teamMemberRepository = teamMemberRepository;
    this._shiftContextRepository = shiftContextRepository;
    this.routes = [
      {
        method: "GET",
        pattern: "/team-member/(\\d+)/preferences/",
        action: this.listGet,
      },
      {
        method: "POST",
        pattern: "/team-member/(\\d+)/preferences/",
        action: this.listPost,
      },
    ];
  }

  /** Gets the shift context preference list page for a team member
   * @param context The application context
   * @returns The response
   */
  public async listGet(context: Context): Promise<ResponseWrapper> {
    const id = parseInt(context.match[1]);
    if (isNaN(id)) {
      return this.NotFoundResponse(context);
    }

    const teamMember = await this._teamMemberRepository.get(id);
    if (teamMember == null) {
      return this.NotFoundResponse(context);
    }

    const shiftContexts = await this._shiftContextRepository.list();
    const shiftContextPreferences = await this._shiftContextPreferenceRepository
      .get(id);

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

  /** Accepts requests to update a team member's shift context preferences
   * @param context The application context
   * @returns The response
   */
  public async listPost(context: Context): Promise<ResponseWrapper> {
    const id = parseInt(context.match[1]);
    if (isNaN(id)) {
      return this.NotFoundResponse(context);
    }

    const teamMember = await this._teamMemberRepository.get(id);
    if (teamMember == null) {
      return this.NotFoundResponse(context);
    }

    const model = await ShiftContextPreferencesEditViewModel.fromRequest(
      context.request,
    );

    model.errors = await this._shiftContextPreferenceRepository.validate(
      model.shiftContextPreferences,
    );

    if (!model.isValid()) {
      return this.HTMLResponse(
        context,
        "./views/shiftContextPreference/edit.html",
        model,
      );
    }

    await this._shiftContextPreferenceRepository.update(
      id,
      model.shiftContextPreferences,
    );
    return this.RedirectResponse(context, `/team-member/${id}/`);
  }
}
