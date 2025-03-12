import Context from "../_framework/Context.ts";
import SubstituteRepository from "../models/repositories/SubstituteRepository.ts";
import TeamMemberRepository from "../models/repositories/TeamMemberRepository.ts";
import SubstitutesEditViewModel from "../models/viewModels/SubstitutesEditViewModel.ts";
import Controller from "../_framework/Controller.ts";
import BetterDate from "../_dates/BetterDate.ts";

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

  private getDateFromContext(context: Context): Date {
    const [_, y, m, d] = context.match;
    return new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
  }

  public async editSubstitutesGet(context: Context) {
    const date = this.getDateFromContext(context);
    if (isNaN(date.getTime())) {
      return this.NotFoundResponse(context);
    }

    const model = new SubstitutesEditViewModel(
      await this.substituteRepository.getSubstituteList(date),
      await this.teamMemberRepository.list(),
      context.csrf_token,
    );

    return this.HTMLResponse(context, "./views/substitute/edit.html", model);
  }

  public async editSubstitutesPost(context: Context) {
    const date = this.getDateFromContext(context);
    if (isNaN(date.getTime())) {
      return this.NotFoundResponse(context);
    }

    const model = await SubstitutesEditViewModel.fromRequest(context.request);
    model.substituteList.date = date;

    model.errors = await this.substituteRepository.validate(
      model.substituteList,
    );
    if (!model.isValid()) {
      model.teamMembers = await this.teamMemberRepository.list();
      model.csrf_token = context.csrf_token;
      return this.HTMLResponse(context, "./views/substitute/edit.html", model);
    }

    await this.substituteRepository.update(model.substituteList);

    const component = BetterDate.fromDate(date).floorToSunday().toDateString()
      .replaceAll("-", "/");
    const url = `/schedule/${component}/`;
    return this.RedirectResponse(context, url);
  }
}
