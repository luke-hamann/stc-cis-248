import Context from "../_framework/Context.ts";
import { ISubstituteRepository } from "../models/repositories/SubstituteRepository.ts";
import { ITeamMemberRepository } from "../models/repositories/TeamMemberRepository.ts";
import SubstitutesEditViewModel from "../models/viewModels/substitute/SubstitutesEditViewModel.ts";
import Controller from "../_framework/Controller.ts";
import BetterDate from "../_dates/BetterDate.ts";
import ResponseWrapper from "../_framework/ResponseWrapper.ts";

/** Controls the substitute pages */
export default class SubstituteController extends Controller {
  /** The substitutes repository */
  private _substitutes: ISubstituteRepository;

  /** The team members repository */
  private _teamMembers: ITeamMemberRepository;

  /** Constructs the substitutes controller using the necessary repositories
   * @param substitutes The substitutes repository
   * @param teamMembers The team members repository
   */
  constructor(
    substitutes: ISubstituteRepository,
    teamMembers: ITeamMemberRepository,
  ) {
    super();
    this._substitutes = substitutes;
    this._teamMembers = teamMembers;
    this.routes = [
      {
        method: "GET",
        pattern: "/substitutes/(\\d{4})/(\\d{2})/(\\d{2})/",
        action: this.editGet,
      },
      {
        method: "POST",
        pattern: "/substitutes/(\\d{4})/(\\d{2})/(\\d{2})/",
        action: this.editPost,
      },
    ];
  }

  /** Gets a date from the application context url, or null if the date is invalid
   * @param context The application context
   * @returns The date
   */
  private getDateFromContext(context: Context): Date | null {
    const [_, y, m, d] = context.match;
    const date = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
    if (isNaN(date.getTime())) return null;
    return date;
  }

  /** Gets the substitute list edit form for a given date
   * @param context The application context
   * @returns The response
   */
  public async editGet(context: Context): Promise<ResponseWrapper> {
    const date = this.getDateFromContext(context);
    if (date == null) return this.NotFoundResponse(context);

    const model = new SubstitutesEditViewModel(
      await this._substitutes.getSubstituteList(date),
      await this._teamMembers.list(),
    );

    return this.HTMLResponse(context, "./views/substitute/edit.html", model);
  }

  /** Accepts requests to update the substitute list for a given date
   * @param context The application context
   * @returns The response
   */
  public async editPost(context: Context): Promise<ResponseWrapper> {
    const date = this.getDateFromContext(context);
    if (date == null) return this.NotFoundResponse(context);

    const model = await SubstitutesEditViewModel.fromRequest(context.request);
    model.substituteList.date = date;

    model.errors = await this._substitutes.validate(
      model.substituteList,
    );
    if (!model.isValid()) {
      model.teamMembers = await this._teamMembers.list();
      return this.HTMLResponse(context, "./views/substitute/edit.html", model);
    }

    await this._substitutes.update(model.substituteList);

    const component = BetterDate.fromDate(date).floorToSunday().toDateString(
      "/",
    );
    const url = `/schedule/${component}/`;
    return this.RedirectResponse(context, url);
  }
}
