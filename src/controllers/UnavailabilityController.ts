import BetterDate from "../_dates/BetterDate.ts";
import DateLib from "../_dates/DateLib.ts";
import Context from "../_framework/Context.ts";
import Controller from "../_framework/Controller.ts";
import TeamMember from "../models/entities/TeamMember.ts";
import Unavailability from "../models/entities/Unavailability.ts";
import TeamMemberRepository from "../models/repositories/TeamMemberRepository.ts";
import UnavailabilityRepository from "../models/repositories/UnavailabilityRepository.ts";
import CalendarViewPartial from "../models/viewModels/_shared/CalendarViewPartial.ts";
import DeleteViewModel from "../models/viewModels/_shared/DeleteViewModel.ts";
import UnavailabilityEditViewModel from "../models/viewModels/unavailability/UnavailabilityEditViewModel.ts";
import UnavailabilityWeekViewModel from "../models/viewModels/unavailability/UnavailabilityWeekViewModel.ts";
import UnavailabilityYearViewModel from "../models/viewModels/unavailability/UnavailabilityYearViewModel.ts";

export default class UnavailabilityController extends Controller {
  private teamMembers: TeamMemberRepository;
  private unavailabilities: UnavailabilityRepository;

  constructor(
    teamMembers: TeamMemberRepository,
    unavailabilities: UnavailabilityRepository,
  ) {
    super();
    this.teamMembers = teamMembers;
    this.unavailabilities = unavailabilities;
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
        action: this.weekGet,
      },
      {
        method: "GET",
        pattern: "/team-member/(\\d+)/unavailability/add/",
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
    ];
  }

  public async getTeamMemberFromContext(
    context: Context,
  ): Promise<TeamMember | null> {
    const id = parseInt(context.match[1]);
    if (isNaN(id)) return null;
    return await this.teamMembers.get(id);
  }

  public async getUnavailabilityFromContext(
    context: Context,
  ): Promise<Unavailability | null> {
    const id = parseInt(context.match[2]);
    if (isNaN(id)) return null;
    return await this.unavailabilities.get(id);
  }

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

  /**
   * Team member unavailability calendar redirect GET
   */
  public index(context: Context) {
    const id = context.match[1];
    const year = new Date().getFullYear();
    const url = `/team-member/${id}/unavailability/${year}/`;

    return this.RedirectResponse(context, url);
  }

  /**
   * Team member unavailability calendar GET
   */
  public async year(context: Context) {
    const teamMember = await this.getTeamMemberFromContext(context);
    if (teamMember == null) return this.NotFoundResponse(context);

    const year = parseInt(context.match[2]);
    if (isNaN(year)) return this.NotFoundResponse(context);

    const baseUrl = `/team-member/${teamMember.id}/unavailability/`;
    const calendar = new CalendarViewPartial(year, baseUrl);

    const model = new UnavailabilityYearViewModel(
      teamMember,
      calendar,
      context.csrf_token,
    );

    return this.HTMLResponse(
      context,
      "./views/unavailability/year.html",
      model,
    );
  }

  /**
   * Team member unavailability week GET
   */
  public async weekGet(context: Context) {
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

    const unavailabilities = await this.unavailabilities.getInRange(
      teamMember.id,
      startDate,
      endDate,
    );

    const model = new UnavailabilityWeekViewModel(
      teamMember,
      startDate,
      endDate,
      unavailabilities,
    );

    return this.HTMLResponse(
      context,
      "./views/unavailability/week.html",
      model,
    );
  }

  /**
   * Team member unavailability week timeslot add GET
   */
  public async addGet(context: Context) {
    const teamMember = await this.getTeamMemberFromContext(context);
    if (teamMember == null) {
      return this.NotFoundResponse(context);
    }

    const model = new UnavailabilityEditViewModel(
      teamMember,
      Unavailability.empty(),
      false,
      [],
      context.csrf_token,
    );

    return this.HTMLResponse(
      context,
      "./views/unavailability/edit.html",
      model,
    );
  }

  /**
   * Team member unavailability week timeslot add POST
   */
  public async addPost(context: Context) {
    const teamMember = await this.getTeamMemberFromContext(context);
    if (teamMember == null) {
      return this.NotFoundResponse(context);
    }

    const model = await UnavailabilityEditViewModel.fromRequest(
      context.request,
    );

    model.errors = await this.unavailabilities.validate(model.unavailability);
    if (!model.isValid()) {
      model.teamMember = teamMember, model.csrf_token = context.csrf_token;
      return this.HTMLResponse(
        context,
        "./views/unavailability/edit.html",
        model,
      );
    }

    await this.unavailabilities.add(model.unavailability);

    const datePath = BetterDate.fromDate(model.unavailability.startDateTime!)
      .floorToSunday().toDateString().replaceAll("-", "/");
    const url = `/team-member/${teamMember.id}/unavailability/${datePath}/`;
    return this.RedirectResponse(context, url);
  }

  /**
   * Team member unavailability week timeslot edit GET
   */
  public async editGet(context: Context) {
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
      context.csrf_token,
    );

    return this.HTMLResponse(
      context,
      "./views/unavailability/edit.html",
      model,
    );
  }

  /**
   * Team member unavailability week timeslot edit POST
   */
  public async editPost(context: Context) {
    const [teamMember, unavailability] = await this.getObjectsFromContext(
      context,
    );
    if (teamMember == null || unavailability == null) {
      return this.NotFoundResponse(context);
    }

    const model = await UnavailabilityEditViewModel.fromRequest(
      context.request,
    );

    model.errors = await this.unavailabilities.validate(model.unavailability);
    if (!model.isValid()) {
      model.teamMember = teamMember;
      model.csrf_token = context.csrf_token;
      return this.HTMLResponse(
        context,
        "./views/unavailability/edit.html",
        model,
      );
    }

    await this.unavailabilities.update(model.unavailability);

    const datePath = BetterDate.fromDate(model.unavailability.startDateTime!)
      .floorToSunday().toDateString().replaceAll("-", "/");
    const url = `/team-member/${teamMember.id}/unavailability/${datePath}/`;
    return this.RedirectResponse(context, url);
  }

  /**
   * Team member unavailability week timeslot delete GET
   */
  public async deleteGet(context: Context) {
    const [teamMember, unavailability] = await this.getObjectsFromContext(
      context,
    );
    if (teamMember == null || unavailability == null) {
      return this.NotFoundResponse(context);
    }

    const description =
      `unavailability ${unavailability.startDateTime} - ${unavailability.endDateTime}`;
    const action =
      `/team-member/${teamMember.id}/unavailability/${unavailability.id}/delete/`;

    const datePath = BetterDate.fromDate(unavailability.startDateTime!)
      .floorToSunday().toDateString().replaceAll("-", "/");
    
    const cancel = `/team-member/${teamMember.id}/unavailability/${datePath}/`;

    const model = new DeleteViewModel(
      description,
      action,
      cancel,
      context.csrf_token,
    );
    return this.HTMLResponse(context, "./views/_shared/delete.html", model);
  }

  /**
   * Team member unavailability week timeslot delete POST
   */
  public async deletePost(context: Context) {
    const [teamMember, unavailability] = await this.getObjectsFromContext(
      context,
    );
    if (teamMember == null || unavailability == null) {
      return this.NotFoundResponse(context);
    }

    await this.unavailabilities.delete(unavailability.id);

    const datePath = BetterDate.fromDate(unavailability.startDateTime!)
      .floorToSunday().toDateString().replaceAll("-", "/");
    const url = `/team-member/${teamMember.id}/unavailability/${datePath}/`;

    return this.RedirectResponse(context, url);
  }
}
