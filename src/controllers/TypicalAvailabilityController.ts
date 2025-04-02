import Context from "../_framework/Context.ts";
import Controller from "../_framework/Controller.ts";
import TeamMember from "../models/entities/TeamMember.ts";
import TypicalAvailability, {
  DayOfWeek,
} from "../models/entities/TypicalAvailability.ts";
import TeamMemberRepository from "../models/repositories/TeamMemberRepository.ts";
import TypicalAvailabilityRepository from "../models/repositories/TypicalAvailabilityRepository.ts";
import TypicalAvailabilityEditViewModel from "../models/viewModels/typicalAvailability/TypicalAvailabilityEditViewModel.ts";
import TypicalAvailabilityListViewModel from "../models/viewModels/typicalAvailability/TypicalAvailabilityListViewModel.ts";
import DeleteViewModel from "../models/viewModels/_shared/DeleteViewModel.ts";
import ResponseWrapper from "../_framework/ResponseWrapper.ts";

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
        pattern: "/team-member/(\\d+)/availability/add/((\\d+)/)?",
        action: this.addGet,
      },
      {
        method: "POST",
        pattern: "/team-member/(\\d+)/availability/add/",
        action: this.addPost,
      },
      {
        method: "GET",
        pattern: "/team-member/(\\d+)/availability/(\\d+)/",
        action: this.editGet,
      },
      {
        method: "POST",
        pattern: "/team-member/(\\d+)/availability/(\\d+)/",
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
    const teamMemberId = parseInt(context.match[1]);
    if (isNaN(teamMemberId)) return null;
    return await this.teamMembers.get(teamMemberId);
  }

  private async getObjectsFromContext(
    context: Context,
  ): Promise<[
    teamMember: TeamMember | null,
    typicalAvailability: TypicalAvailability | null,
  ]> {
    const teamMemberId = parseInt(context.match[1]);
    let teamMember: TeamMember | null = null;
    if (!isNaN(teamMemberId)) {
      teamMember = await this.teamMembers.get(teamMemberId);
    }

    const typicalAvailabilityId = parseInt(context.match[2]);
    let typicalAvailability: TypicalAvailability | null = null;
    if (!isNaN(typicalAvailabilityId)) {
      typicalAvailability = await this.typicalAvailability.get(
        typicalAvailabilityId,
      );
    }

    return [teamMember, typicalAvailability];
  }

  /**
   * Team member typical availability GET
   */
  public async list(context: Context): Promise<ResponseWrapper> {
    const teamMember = await this.getTeamMemberFromContext(context);
    if (teamMember == null) return this.NotFoundResponse(context);

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
  public async addGet(context: Context): Promise<ResponseWrapper> {
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

    if (context.match.length > 3) {
      typicalAvailability.dayOfWeek = parseInt(context.match[3]) as DayOfWeek;
    }

    const model = new TypicalAvailabilityEditViewModel(
      teamMember,
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
  public async addPost(context: Context): Promise<ResponseWrapper> {
    const teamMember = await this.getTeamMemberFromContext(context);
    if (teamMember == null) return this.NotFoundResponse(context);

    const model = await TypicalAvailabilityEditViewModel.fromRequest(
      context.request,
    );
    model.teamMember = teamMember;
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

    await this.typicalAvailability.add(model.typicalAvailability);
    const url = `/team-member/${teamMember.id}/availability/`;
    return this.RedirectResponse(context, url);
  }

  /**
   * Team member typical availability edit GET
   */
  public async editGet(context: Context): Promise<ResponseWrapper> {
    const [teamMember, typicalAvailability] = await this.getObjectsFromContext(
      context,
    );
    if (teamMember == null || typicalAvailability == null) {
      return this.NotFoundResponse(context);
    }

    const model = new TypicalAvailabilityEditViewModel(
      teamMember,
      typicalAvailability,
      true,
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
   * Team member typical availability edit POST
   */
  public async editPost(context: Context): Promise<ResponseWrapper> {
    const [teamMember, typicalAvailability] = await this.getObjectsFromContext(
      context,
    );
    if (teamMember == null || typicalAvailability == null) {
      return this.NotFoundResponse(context);
    }

    const model = await TypicalAvailabilityEditViewModel.fromRequest(
      context.request,
    );
    model.typicalAvailability.teamMemberId = teamMember.id;
    model.typicalAvailability.id = typicalAvailability.id;

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
   * Team member typical availability delete GET
   */
  public async deleteGet(context: Context): Promise<ResponseWrapper> {
    const [teamMember, availability] = await this.getObjectsFromContext(
      context,
    );
    if (teamMember == null || availability == null) {
      return this.NotFoundResponse(context);
    }

    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const description = [
      dayNames[availability.dayOfWeek!],
      availability.startTime,
      availability.endTime,
      "for",
      teamMember.fullName,
    ].join(" ");
    const action =
      `/team-member/${teamMember.id}/availability/${availability.id}/delete/`;
    const cancel = `/team-member/${teamMember.id}/availability/`;

    const model = new DeleteViewModel(
      description,
      action,
      cancel,
      [],
    );
    return this.HTMLResponse(context, "./views/_shared/delete.html", model);
  }

  /**
   * Team member typical availability delete POST
   */
  public async deletePost(context: Context): Promise<ResponseWrapper> {
    const [teamMember, typicalAvailability] = await this.getObjectsFromContext(
      context,
    );
    if (teamMember == null || typicalAvailability == null) {
      return this.NotFoundResponse(context);
    }

    await this.typicalAvailability.delete(typicalAvailability.id);
    const url = `/team-member/${teamMember.id}/availability/`;
    return this.RedirectResponse(context, url);
  }
}
