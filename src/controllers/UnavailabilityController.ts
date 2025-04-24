import BetterDate from "../_dates/BetterDate.ts";
import DateLib from "../_dates/DateLib.ts";
import Context from "../_framework/Context.ts";
import Controller from "../_framework/Controller.ts";
import ResponseWrapper from "../_framework/ResponseWrapper.ts";
import TeamMember from "../models/entities/TeamMember.ts";
import Unavailability from "../models/entities/Unavailability.ts";
import { ITeamMemberRepository } from "../models/repositories/TeamMemberRepository.ts";
import { IUnavailabilityRepository } from "../models/repositories/UnavailabilityRepository.ts";
import CalendarViewPartial from "../models/viewModels/_shared/CalendarViewPartial.ts";
import DeleteViewModel from "../models/viewModels/_shared/DeleteViewModel.ts";
import UnavailabilityEditViewModel from "../models/viewModels/unavailability/UnavailabilityEditViewModel.ts";
import UnavailabilityWeekViewModel from "../models/viewModels/unavailability/UnavailabilityWeekViewModel.ts";
import UnavailabilityYearViewModel from "../models/viewModels/unavailability/UnavailabilityYearViewModel.ts";

/** Controls the team member unavailability pages */
export default class UnavailabilityController extends Controller {
  /** The team members repository */
  private _teamMembers: ITeamMemberRepository;

  /** The unavailability repository */
  private _unavailabilities: IUnavailabilityRepository;

  /** Constructs the controlling using the necessary repositories
   * @param teamMembers The team member repository
   * @param unavailabilities The unavailabilities repository
   */
  constructor(
    teamMembers: ITeamMemberRepository,
    unavailabilities: IUnavailabilityRepository,
  ) {
    super();
    this._teamMembers = teamMembers;
    this._unavailabilities = unavailabilities;
    this.routes = [
      {
        method: "GET",
        pattern: "/team-member/(\\d+)/unavailability/",
        action: this.index,
      },
      {
        method: "GET",
        pattern: "/team-member/(\\d+)/unavailability/(\\d{4})/",
        action: this.year,
      },
      {
        method: "GET",
        pattern:
          "/team-member/(\\d+)/unavailability/(\\d{4})/(\\d{2})/(\\d{2})/",
        action: this.week,
      },
      {
        method: "GET",
        pattern:
          "/team-member/(\\d+)/unavailability/add/((\\d{4})/(\\d{2})/(\\d{2})/)?",
        action: this.addGet,
      },
      {
        method: "POST",
        pattern: "/team-member/(\\d+)/unavailability/add/",
        action: this.addPost,
      },
      {
        method: "GET",
        pattern: "/team-member/(\\d+)/unavailability/(\\d+)/edit/",
        action: this.editGet,
      },
      {
        method: "POST",
        pattern: "/team-member/(\\d+)/unavailability/(\\d+)/edit/",
        action: this.editPost,
      },
      {
        method: "GET",
        pattern: "/team-member/(\\d+)/unavailability/(\\d+)/delete/",
        action: this.deleteGet,
      },
      {
        method: "POST",
        pattern: "/team-member/(\\d+)/unavailability/(\\d+)/delete/",
        action: this.deletePost,
      },
      {
        method: "GET",
        pattern:
          "/team-member/(\\d+)/unavailability/(\\d{4})/(\\d{2})/(\\d{2})/clear/",
        action: this.clearGet,
      },
      {
        method: "POST",
        pattern:
          "/team-member/(\\d+)/unavailability/(\\d{4})/(\\d{2})/(\\d{2})/clear/",
        action: this.clearPost,
      },
    ];
  }

  /** Attempts to get a team member object based on the application context URL
   *
   * Returns null if the team member cannot be retrieved
   *
   * @param context The application context
   * @returns The team member or null
   */
  public async getTeamMemberFromContext(
    context: Context,
  ): Promise<TeamMember | null> {
    const id = parseInt(context.match[1]);
    if (isNaN(id)) return null;
    return await this._teamMembers.get(id);
  }

  /** Attempts to get an unavailability object based on the application context URL
   *
   * Returns null if the unavailability cannot be retrieved
   *
   * @param context The application context
   * @returns The unavailability or null
   */
  public async getUnavailabilityFromContext(
    context: Context,
  ): Promise<Unavailability | null> {
    const id = parseInt(context.match[2]);
    if (isNaN(id)) return null;
    return await this._unavailabilities.get(id);
  }

  /** Attempts to get a team member object and unavailability object based on the application context URL
   *
   * Returns null for an object if the object cannot be retrieved
   *
   * @param context The application context
   * @returns The team member or null, and the unavailability or null
   */
  public async getObjectsFromContext(
    context: Context,
  ): Promise<
    [teamMember: TeamMember | null, unavailability: Unavailability | null]
  > {
    return [
      await this.getTeamMemberFromContext(context),
      await this.getUnavailabilityFromContext(context),
    ];
  }

  /** Redirects the unavailability index page to the unavailability calendar for the current year
   * @param context The application context
   * @returns The response
   */
  public index(context: Context): ResponseWrapper {
    const id = context.match[1];
    const year = new Date().getFullYear();
    const url = `/team-member/${id}/unavailability/${year}/`;

    return this.RedirectResponse(context, url);
  }

  /** Gets the unavailality calendar for a given year and team member
   * @param context The application context
   * @returns The response
   */
  public async year(context: Context): Promise<ResponseWrapper> {
    const teamMember = await this.getTeamMemberFromContext(context);
    if (teamMember == null) return this.NotFoundResponse(context);

    const year = parseInt(context.match[2]);
    if (isNaN(year)) return this.NotFoundResponse(context);

    const baseUrl = `/team-member/${teamMember.id}/unavailability/`;
    const calendar = new CalendarViewPartial(year, baseUrl);

    const model = new UnavailabilityYearViewModel(
      teamMember,
      calendar,
    );

    return this.HTMLResponse(
      context,
      "./views/unavailability/year.html",
      model,
    );
  }

  /** Gets the unavailability list for a given week and team member
   * @param context The application context
   * @returns The response
   */
  public async week(context: Context): Promise<ResponseWrapper> {
    const teamMember = await this.getTeamMemberFromContext(context);
    if (teamMember == null) return this.NotFoundResponse(context);

    const [_, __, year, month, day] = context.match;
    const startDate = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
    );
    if (isNaN(startDate.getTime())) return this.NotFoundResponse(context);

    // If the start date is not a Sunday
    if (startDate.getDay() != 0) {
      return this.RedirectResponse(
        context,
        `/team-member/${teamMember.id}/unavailability/` +
          BetterDate.fromDate(startDate).floorToSunday().toDateString()
            .replaceAll("-", "/") +
          "/",
      );
    }

    const endDate = DateLib.addDays(startDate, 6);

    const table = await this._unavailabilities.list(
      teamMember.id,
      startDate,
      endDate,
    );

    const model = new UnavailabilityWeekViewModel(
      teamMember,
      startDate,
      endDate,
      table,
    );

    return this.HTMLResponse(
      context,
      "./views/unavailability/week.html",
      model,
    );
  }

  /** Gets the unavailability add form
   * @param context The application context
   * @returns The response
   */
  public async addGet(context: Context): Promise<ResponseWrapper> {
    const teamMember = await this.getTeamMemberFromContext(context);
    if (teamMember == null) {
      return this.NotFoundResponse(context);
    }

    const model = new UnavailabilityEditViewModel(
      teamMember,
      Unavailability.empty(),
      false,
      [],
    );

    if (context.match.length == 6) {
      const [_, __, ___, year, month, day] = context.match;
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      if (!isNaN(date.getTime())) {
        model.startDate = date;
      }
    }

    return this.HTMLResponse(
      context,
      "./views/unavailability/edit.html",
      model,
    );
  }

  /** Accepts requests to add unavailability
   * @param context The application context
   * @returns The response
   */
  public async addPost(context: Context): Promise<ResponseWrapper> {
    const teamMember = await this.getTeamMemberFromContext(context);
    if (teamMember == null) {
      return this.NotFoundResponse(context);
    }

    const model = await UnavailabilityEditViewModel.fromRequest(
      context.request,
    );
    model.unavailability.teamMemberId = teamMember.id;

    model.errors = await this._unavailabilities.validate(model.unavailability);
    if (!model.isValid()) {
      model.teamMember = teamMember;
      return this.HTMLResponse(
        context,
        "./views/unavailability/edit.html",
        model,
      );
    }

    await this._unavailabilities.add(model.unavailability);

    const datePath = BetterDate.fromDate(model.unavailability.startDateTime!)
      .floorToSunday().toDateString().replaceAll("-", "/");
    const url = `/team-member/${teamMember.id}/unavailability/${datePath}/`;
    return this.RedirectResponse(context, url);
  }

  /** Gets the unavailability edit form
   * @param context The application context
   * @returns The response
   */
  public async editGet(context: Context): Promise<ResponseWrapper> {
    const [teamMember, unavailability] = await this.getObjectsFromContext(
      context,
    );
    if (teamMember == null || unavailability == null) {
      return this.NotFoundResponse(context);
    }

    const model = new UnavailabilityEditViewModel(
      teamMember,
      unavailability,
      true,
      [],
    );

    return this.HTMLResponse(
      context,
      "./views/unavailability/edit.html",
      model,
    );
  }

  /** Accepts requests to edit an unavailability
   * @param context The application context
   * @returns The response
   */
  public async editPost(context: Context): Promise<ResponseWrapper> {
    const [teamMember, unavailability] = await this.getObjectsFromContext(
      context,
    );
    if (teamMember == null || unavailability == null) {
      return this.NotFoundResponse(context);
    }

    const model = await UnavailabilityEditViewModel.fromRequest(
      context.request,
    );
    model.unavailability.id = unavailability.id;
    model.unavailability.teamMemberId = teamMember.id;

    model.errors = await this._unavailabilities.validate(model.unavailability);
    if (!model.isValid()) {
      model.teamMember = teamMember;
      model.csrf_token = context.csrf_token;
      return this.HTMLResponse(
        context,
        "./views/unavailability/edit.html",
        model,
      );
    }

    await this._unavailabilities.update(model.unavailability);

    const datePath = BetterDate.fromDate(model.unavailability.startDateTime!)
      .floorToSunday().toDateString().replaceAll("-", "/");
    const url = `/team-member/${teamMember.id}/unavailability/${datePath}/`;
    return this.RedirectResponse(context, url);
  }

  /** Gets the unavailability delete confirmation form
   * @param context The application context
   * @returns The response
   */
  public async deleteGet(context: Context): Promise<ResponseWrapper> {
    const [teamMember, unavailability] = await this.getObjectsFromContext(
      context,
    );
    if (teamMember == null || unavailability == null) {
      return this.NotFoundResponse(context);
    }

    const startDate = unavailability.startDateTime?.toLocaleDateString();
    const startTime = unavailability.startDateTime?.toLocaleTimeString();
    const endTime = unavailability.endDateTime?.toLocaleTimeString();

    const description =
      `unavailability for ${teamMember.fullName} on ${startDate} from ${startTime} to ${endTime}`;
    const action =
      `/team-member/${teamMember.id}/unavailability/${unavailability.id}/delete/`;

    const datePath = BetterDate.fromDate(unavailability.startDateTime!)
      .floorToSunday().toDateString().replaceAll("-", "/");

    const cancel = `/team-member/${teamMember.id}/unavailability/${datePath}/`;

    const model = new DeleteViewModel(
      description,
      action,
      cancel,
      [],
    );
    return this.HTMLResponse(context, "./views/_shared/delete.html", model);
  }

  /** Accepts requests to delete an unavailability
   * @param context The application context
   * @returns The response
   */
  public async deletePost(context: Context): Promise<ResponseWrapper> {
    const [teamMember, unavailability] = await this.getObjectsFromContext(
      context,
    );
    if (teamMember == null || unavailability == null) {
      return this.NotFoundResponse(context);
    }

    await this._unavailabilities.delete(unavailability.id);

    const datePath = BetterDate.fromDate(unavailability.startDateTime!)
      .floorToSunday().toDateString().replaceAll("-", "/");
    const url = `/team-member/${teamMember.id}/unavailability/${datePath}/`;

    return this.RedirectResponse(context, url);
  }

  /** Gets the unavailability week clear form
   * @param context The application context
   * @returns The response
   */
  public async clearGet(context: Context): Promise<ResponseWrapper> {
    const teamMember = await this.getTeamMemberFromContext(context);
    if (teamMember == null) return this.NotFoundResponse(context);

    const [_, __, year, month, day] = context.match;
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    if (isNaN(date.getTime())) return this.NotFoundResponse(context);

    if (date.getDay() != 0) {
      const weekStart = BetterDate.fromDate(date).floorToSunday().toDateString(
        "/",
      );
      const url = `/team-member/unavailability/${weekStart}/clear/`;
      return this.RedirectResponse(context, url);
    }

    const description =
      `unavailability for ${teamMember.fullName} the week of ${date.toLocaleDateString()}`;
    const action = context.match[0];
    const datePath = BetterDate.fromDate(date).toDateString("/");
    const cancel = `/team-member/${teamMember.id}/unavailability/${datePath}/`;

    const model = new DeleteViewModel(
      description,
      action,
      cancel,
      [],
    );
    return this.HTMLResponse(context, "./views/_shared/delete.html", model);
  }

  /** Accepts requests to clear an unavailability week
   * @param context The application context
   * @returns The response
   */
  public async clearPost(context: Context): Promise<ResponseWrapper> {
    const teamMember = await this.getTeamMemberFromContext(context);
    if (teamMember == null) return this.NotFoundResponse(context);

    const [_, __, year, month, day] = context.match;
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    if (isNaN(date.getTime())) return this.NotFoundResponse(context);

    if (date.getDay() != 0) {
      const weekStart = BetterDate.fromDate(date).floorToSunday().toDateString(
        "/",
      );
      const url = `/team-member/unavailability/${weekStart}/clear/`;
      return this.RedirectResponse(context, url);
    }

    await this._unavailabilities.deleteRange(
      teamMember.id,
      date,
      BetterDate.fromDate(date).addDays(6).toDate(),
    );
    const datePath = BetterDate.fromDate(date).toDateString("/");
    const url = `/team-member/${teamMember.id}/unavailability/${datePath}/`;
    return this.RedirectResponse(context, url);
  }
}
