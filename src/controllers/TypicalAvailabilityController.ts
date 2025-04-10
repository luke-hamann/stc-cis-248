import Context from "../_framework/Context.ts";
import Controller from "../_framework/Controller.ts";
import TeamMember from "../models/entities/TeamMember.ts";
import TypicalAvailability, {
  DayOfWeek,
} from "../models/entities/TypicalAvailability.ts";
import { ITeamMemberRepository } from "../models/repositories/TeamMemberRepository.ts";
import { ITypicalAvailabilityRepository } from "../models/repositories/TypicalAvailabilityRepository.ts";
import TypicalAvailabilityEditViewModel from "../models/viewModels/typicalAvailability/TypicalAvailabilityEditViewModel.ts";
import TypicalAvailabilityListViewModel from "../models/viewModels/typicalAvailability/TypicalAvailabilityListViewModel.ts";
import DeleteViewModel from "../models/viewModels/_shared/DeleteViewModel.ts";
import ResponseWrapper from "../_framework/ResponseWrapper.ts";

/** Controls the typical availability pages */
export default class TypicalAvailabilityController extends Controller {
  /** The team member repository */
  public _teamMembers: ITeamMemberRepository;

  /** The typical availability repository */
  public _typicalAvailability: ITypicalAvailabilityRepository;

  /** Constructs the controller using the necessary repositories
   * @param teamMembers The team member repository
   * @param typicalAvailability The typical availability repository
   */
  public constructor(
    teamMembers: ITeamMemberRepository,
    typicalAvailability: ITypicalAvailabilityRepository,
  ) {
    super();
    this._teamMembers = teamMembers;
    this._typicalAvailability = typicalAvailability;
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

  /** Gets a team member object based on the application context url, or null if they do not exist
   * @param context The application context
   * @returns The team member or null
   */
  private async getTeamMemberFromContext(
    context: Context,
  ): Promise<TeamMember | null> {
    const teamMemberId = parseInt(context.match[1]);
    if (isNaN(teamMemberId)) return null;
    return await this._teamMembers.get(teamMemberId);
  }

  /** Attempts to get a team member object and typical availability objects based on the context
   *
   * Returns null if either objects cannot be retrieved
   *
   * @param context The application context
   * @returns The team member or null, and the typical availability or null
   */
  private async getObjectsFromContext(
    context: Context,
  ): Promise<[
    teamMember: TeamMember | null,
    typicalAvailability: TypicalAvailability | null,
  ]> {
    const teamMemberId = parseInt(context.match[1]);
    let teamMember: TeamMember | null = null;
    if (!isNaN(teamMemberId)) {
      teamMember = await this._teamMembers.get(teamMemberId);
    }

    const typicalAvailabilityId = parseInt(context.match[2]);
    let typicalAvailability: TypicalAvailability | null = null;
    if (!isNaN(typicalAvailabilityId)) {
      typicalAvailability = await this._typicalAvailability.get(
        typicalAvailabilityId,
      );
    }

    return [teamMember, typicalAvailability];
  }

  /** Gets the team member typical availability list page
   * @param context The application context
   * @returns The response
   */
  public async list(context: Context): Promise<ResponseWrapper> {
    const teamMember = await this.getTeamMemberFromContext(context);
    if (teamMember == null) return this.NotFoundResponse(context);

    const model = new TypicalAvailabilityListViewModel(
      teamMember,
      await this._typicalAvailability.list(teamMember.id),
    );

    return this.HTMLResponse(
      context,
      "./views/typicalAvailability/list.html",
      model,
    );
  }

  /** Gets the typical availability add form
   * @param context The application context
   * @returns The response
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
    );

    return this.HTMLResponse(
      context,
      "./views/typicalAvailability/edit.html",
      model,
    );
  }

  /** Accepts requests to add a typical availability
   * @param context The application context
   * @returns The response
   */
  public async addPost(context: Context): Promise<ResponseWrapper> {
    const teamMember = await this.getTeamMemberFromContext(context);
    if (teamMember == null) return this.NotFoundResponse(context);

    const model = await TypicalAvailabilityEditViewModel.fromRequest(
      context.request,
    );
    model.teamMember = teamMember;
    model.typicalAvailability.teamMemberId = teamMember.id;

    model.errors = await this._typicalAvailability.validate(
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

    await this._typicalAvailability.add(model.typicalAvailability);
    const url = `/team-member/${teamMember.id}/availability/`;
    return this.RedirectResponse(context, url);
  }

  /** Gets the typical availability edit form
   * @param context The application context
   * @returns The response
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
    );

    return this.HTMLResponse(
      context,
      "./views/typicalAvailability/edit.html",
      model,
    );
  }

  /** Accepts requests to edit a typical availability
   * @param context The application context
   * @returns The response
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

    model.errors = await this._typicalAvailability.validate(
      model.typicalAvailability,
    );
    if (!model.isValid()) {
      return this.HTMLResponse(
        context,
        "./views/typicalAvailability/edit.html",
        model,
      );
    }

    await this._typicalAvailability.update(model.typicalAvailability);
    const url = `/team-member/${teamMember.id}/availability/`;
    return this.RedirectResponse(context, url);
  }

  /** Gets the typical availability delete confirmation form
   * @param context The application context
   * @returns The response
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

  /** Accepts requests to delete a typical availability
   * @param context The application context
   * @returns The response
   */
  public async deletePost(context: Context): Promise<ResponseWrapper> {
    const [teamMember, typicalAvailability] = await this.getObjectsFromContext(
      context,
    );
    if (teamMember == null || typicalAvailability == null) {
      return this.NotFoundResponse(context);
    }

    await this._typicalAvailability.delete(typicalAvailability.id);
    const url = `/team-member/${teamMember.id}/availability/`;
    return this.RedirectResponse(context, url);
  }
}
