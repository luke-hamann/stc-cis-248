import Context from "../_framework/Context.ts";
import Controller from "../_framework/Controller.ts";
import TeamMember from "../models/entities/TeamMember.ts";
import TypicalAvailability from "../models/entities/TypicalAvailability.ts";
import TeamMemberRepository from "../models/repositories/TeamMemberRepository.ts";
import TypicalAvailabilityRepository from "../models/repositories/TypicalAvailabilityRepository.ts";
import TypicalAvailabilityEditViewModel from "../models/viewModels/TypicalAvailabilityEditViewModel.ts";
import TypicalAvailabilityListViewModel from "../models/viewModels/TypicalAvailabilityListViewModel.ts";

export default class TypicalAvailabilityController extends Controller {
  public teamMembers: TeamMemberRepository;
  public typicalAvailability: TypicalAvailabilityRepository;

  public constructor(
    teamMembers: TeamMemberRepository,
    typicalAvailability: TypicalAvailabilityRepository,
  ) {
    super();
    this.teamMembers = teamMembers;
    this.typicalAvailability = typicalAvailability;
    this.routes = [
      {
        method: "GET",
        pattern: "/team-member/(\\d+)/availability/",
        action: this.list,
      },
      {
        method: "GET",
        pattern: "/team-member/(\\d+)/availability/add/",
        action: this.addGet,
      },
      {
        method: "POST",
        pattern: "/team-member/(\\d+)/availability/add/",
        action: this.addPost,
      },
      {
        method: "GET",
        pattern: "/team-member/(\\d+)/availability/(\\d+)/edit/",
        action: this.editGet,
      },
      {
        method: "POST",
        pattern: "/team-member/(\\d+)/availability/(\\d+)/edit/",
        action: this.editPost,
      },
      {
        method: "GET",
        pattern: "/team-member/(\\d+)/availability/(\\d+)/delete/",
        action: this.deleteGet,
      },
      {
        method: "POST",
        pattern: "/team-member/(\\d+)/availability/(\\d+)/delete/",
        action: this.deletePost,
      },
    ];
  }

  private async getTeamMemberFromContext(
    context: Context,
  ): Promise<TeamMember | null> {
    const id = parseInt(context.match[1]);
    if (isNaN(id)) return null;
    return this.teamMembers.get(id);
  }

  private async getTypicalAvailabilityFromContext(
    context: Context,
  ): Promise<TypicalAvailability | null> {
    const id = parseInt(context.match[2]);
    if (isNaN(id)) return null;
    return this.typicalAvailability.get(id);
  }

  /**
   * Team member typical availability GET
   */
  public async list(context: Context) {
    const teamMember = await this.getTeamMemberFromContext(context);
    if (teamMember == null) return this.NotFoundResponse;

    const model = new TypicalAvailabilityListViewModel(
      teamMember,
      await this.typicalAvailability.list(teamMember.id),
    );

    return this.HTMLResponse(
      context,
      "./views/typicalAvailability/list.html",
      model,
    );
  }

  /**
   * Team member typical availability add GET
   */
  public async addGet(context: Context) {
    const teamMember = await this.getTeamMemberFromContext(context);
    if (teamMember == null) return this.NotFoundResponse(context);

    const typicalAvailability = new TypicalAvailability(
      0,
      teamMember.id,
      teamMember,
      null,
      null,
      null,
      true,
    );

    const model = new TypicalAvailabilityEditViewModel(
      typicalAvailability,
      false,
      [],
      context.csrf_token,
    );

    return this.HTMLResponse(
      context,
      "./views/typicalAvailability/edit.html",
      model,
    );
  }

  /**
   * Team member typical availability add POST
   */
  public async addPost(context: Context) {
    const teamMember = await this.getTeamMemberFromContext(context);
    if (teamMember == null) return this.NotFoundResponse(context);

    const model = await TypicalAvailabilityEditViewModel.fromRequest(
      context.request,
    );
    model.typicalAvailability.teamMemberId = teamMember.id;

    model.errors = await this.typicalAvailability.validate(
      model.typicalAvailability,
    );
    if (!model.isValid()) {
      model.csrf_token = context.csrf_token;
      return this.HTMLResponse(
        context,
        "./views/typicalAvailability/edit.html",
        model,
      );
    }

    await this.typicalAvailability.update(model.typicalAvailability);
    const url = `/team-member/${teamMember.id}/availability/`;
    return this.RedirectResponse(context, url);
  }

  /**
   * Team member typical availability GET
   */
  public async editGet(context: Context) {
    const typicalAvailability = await this.getTypicalAvailabilityFromContext(
      context,
    );
    if (typicalAvailability == null) return this.NotFoundResponse(context);
  }

  /**
   * Team member typical availability POST
   */
  public async editPost(context: Context) {
  }

  /**
   * Team member typical availability GET
   */
  public async deleteGet(context: Context) {
  }

  /**
   * Team member typical availability POST
   */
  public async deletePost(context: Context) {
  }
}
