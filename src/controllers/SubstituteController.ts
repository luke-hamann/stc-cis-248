import Context from "../_framework/Context.ts";
import SubstituteRepository from "../models/repositories/SubstituteRepository.ts";
import TeamMemberRepository from "../models/repositories/TeamMemberRepository.ts";
import SubstitutesEditViewModel from "../models/viewModels/SubstitutesEditViewModel.ts";
import Controller from "../_framework/Controller.ts";

export default class SubstituteController extends Controller {
  private teamMemberRepository: TeamMemberRepository;
  private substituteRepository: SubstituteRepository;

  constructor(
    substituteRepository: SubstituteRepository,
    teamMemberRepository: TeamMemberRepository,
  ) {
    super();
    this.teamMemberRepository = teamMemberRepository;
    this.substituteRepository = substituteRepository;
    this.routes = [
      {
        method: "GET",
        pattern: "/substitutes/(\\d{4})/(\\d{2})/(\\d{2})/",
        action: this.editSubstitutesGet,
      },
      {
        method: "POST",
        pattern: "/substitutes/(\\d{4})/(\\d{2})/(\\d{2})/",
        action: this.editSubstitutesPost,
      },
    ];
  }

  public async editSubstitutesGet(context: Context) {
    const year = parseInt(context.match[1]);
    const month = parseInt(context.match[2]);
    const day = parseInt(context.match[3]);

    const timestamp = Date.parse(`${year}-${month}-${day}`);
    if (isNaN(timestamp)) {
      return this.NotFoundResponse(context);
    }
    const date = new Date(timestamp);

    const model = new SubstitutesEditViewModel(
      await this.teamMemberRepository.getTeamMembers(),
      date,
      await this.substituteRepository.getSubstituteIds(date),
      context.csrf_token,
    );

    return this.HTMLResponse(context, "./views/substitute/edit.html", model);
  }

  public async editSubstitutesPost(context: Context) {
    const year = parseInt(context.match[1]);
    const month = parseInt(context.match[2]);
    const day = parseInt(context.match[3]);

    const timestamp = Date.parse(`${year}-${month}-${day}`);
    if (isNaN(timestamp)) {
      return this.NotFoundResponse(context);
    }

    const date = new Date(timestamp);

    const model = await SubstitutesEditViewModel.fromRequest(context.request);
    model.errors = await this.substituteRepository.validate(model.substitutesIds);
    if (!model.isValid()) {
      model.teamMembers = await this.teamMemberRepository.getTeamMembers();
      model.date = date;
      model.csrf_token = context.csrf_token;
      return this.HTMLResponse(context, "./views/substitute/edit.html", model);
    }

    await this.substituteRepository.updateSubstitutesIds(date, model.substitutesIds);
    return this.RedirectResponse(context, "/");
  }
}
