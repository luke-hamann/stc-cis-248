import Context from "../_framework/Context.ts";
import ShiftContextRepository from "../models/repositories/ShiftContextRepository.ts";
import ShiftContextPreferenceRepository from "../models/repositories/ShiftContextPreferenceRepository.ts";
import TeamMemberRepository from "../models/repositories/TeamMemberRepository.ts";
import ShiftContextPreferencesEditViewModel from "../models/viewModels/ShiftContextPreferencesEditViewModel.ts";
import Controller from "../_framework/Controller.ts";

export default class ShiftContextPreferenceController extends Controller {
  private shiftContextPreferenceRepository: ShiftContextPreferenceRepository;
  private teamMemberRepository: TeamMemberRepository;
  private shiftContextRepository: ShiftContextRepository;

  constructor(
    shiftContextPreferenceRepository: ShiftContextPreferenceRepository,
    teamMemberRepository: TeamMemberRepository,
    shiftContextRepository: ShiftContextRepository,
  ) {
    super();
    this.shiftContextPreferenceRepository = shiftContextPreferenceRepository;
    this.teamMemberRepository = teamMemberRepository;
    this.shiftContextRepository = shiftContextRepository;
    this.routes = [
      {
        method: "GET",
        pattern: "/team-member/(\\d+)/preferences/",
        action: this.preferencesGet,
      },
      {
        method: "POST",
        pattern: "/team-member/(\\d+)/preferences/",
        action: this.preferencesPost,
      },
    ];
  }

  /**
   * Shift context preferences GET
   */
  public async preferencesGet(context: Context) {
    const id = parseInt(context.match[1]);
    if (isNaN(id)) {
      return this.NotFoundResponse(context);
    }

    const teamMember = await this.teamMemberRepository.getTeamMember(id);
    if (teamMember == null) {
      return this.NotFoundResponse(context);
    }

    const shiftContexts = await this.shiftContextRepository.getShiftContexts();
    const shiftContextPreferences = await this.shiftContextPreferenceRepository
      .getShiftContextPreferences(id);

    const model = new ShiftContextPreferencesEditViewModel(
      context.csrf_token,
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

  /**
   * Shift context preferences POST
   */
  public async preferencesPost(context: Context) {
    const id = parseInt(context.match[1]);
    if (isNaN(id)) {
      return this.NotFoundResponse(context);
    }

    const teamMember = await this.teamMemberRepository.getTeamMember(id);
    if (teamMember == null) {
      return this.NotFoundResponse(context);
    }

    const model = await ShiftContextPreferencesEditViewModel.fromRequest(
      context.request,
    );

    model.errors = await this.shiftContextPreferenceRepository.validate(
      model.shiftContextPreferences,
    );

    if (!model.isValid()) {
      model.csrf_token = context.csrf_token;
      return this.HTMLResponse(
        context,
        "./views/shiftContextPreference/edit.html",
        model,
      );
    }

    await this.shiftContextPreferenceRepository.updateShiftContextPreferences(
      id,
      model.shiftContextPreferences,
    );
    return this.RedirectResponse(context, `/team-member/${id}/`);
  }
}
