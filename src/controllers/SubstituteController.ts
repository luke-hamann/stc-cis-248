import Context from "../models/controllerLayer/Context.ts";
import SubstituteRepository from "../models/repositories/SubstituteRepository.ts";
import TeamMemberRepository from "../models/repositories/TeamMemberRepository.ts";
import SubstitutesEditViewModel from "../models/viewModels/SubstitutesEditViewModel.ts";
import Controller2 from "./_Controller2.ts";

export default class SubstituteController extends Controller2 {
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
  }
}
