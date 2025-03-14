import BetterDate from "../_dates/BetterDate.ts";
import DateLib from "../_dates/DateLib.ts";
import Context from "../_framework/Context.ts";
import Controller from "../_framework/Controller.ts";
import TeamMember from "../models/entities/TeamMember.ts";
import Unavailability from "../models/entities/Unavailability.ts";
import TeamMemberRepository from "../models/repositories/TeamMemberRepository.ts";
import UnavailabilityRepository from "../models/repositories/UnavailabilityRepository.ts";
import CalendarYearViewModel from "../models/viewModels/CalendarYearViewModel.ts";
import UnavailabilityWeekViewModel from "../models/viewModels/UnavailabilityWeekViewModel.ts";

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
        action: this.calendar,
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
  public async calendar(context: Context) {
    const teamMember = await this.getTeamMemberFromContext(context);
    if (teamMember == null) return this.NotFoundResponse(context);

    const year = parseInt(context.match[2]);
    if (isNaN(year)) return this.NotFoundResponse(context);

    const model = new CalendarYearViewModel(
      `Unavailability of ${teamMember.fullName}`,
      context.csrf_token,
      year,
      `/team-member/${teamMember.id}/unavailability/`,
    );

    return this.HTMLResponse(context, "./views/_shared/calendar.html", model);
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

    const unavailabilities = await this.unavailabilities.getInRange(
      teamMember.id,
      startDate,
      DateLib.addDays(startDate, 6),
    );

    const model = new UnavailabilityWeekViewModel(
      teamMember,
      startDate,
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
  }

  /**
   * Team member unavailability week timeslot add POST
   */
  public async addPost(context: Context) {
  }

  /**
   * Team member unavailability week timeslot edit GET
   */
  public async editGet(context: Context) {
  }

  /**
   * Team member unavailability week timeslot edit POST
   */
  public async editPost(context: Context) {
  }

  /**
   * Team member unavailability week timeslot delete GET
   */
  public async deleteGet(context: Context) {
  }

  /**
   * Team member unavailability week timeslot delete POST
   */
  public async deletePost(context: Context) {
  }
}
