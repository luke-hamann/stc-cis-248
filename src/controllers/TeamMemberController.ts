import Context from "../_framework/Context.ts";
import { ITeamMemberRepository } from "../models/repositories/TeamMemberRepository.ts";
import DeleteViewModel from "../models/viewModels/_shared/DeleteViewModel.ts";
import TeamMemberEditViewModel from "../models/viewModels/teamMember/TeamMemberEditViewModel.ts";
import TeamMembersViewModel from "../models/viewModels/teamMember/TeamMembersViewModel.ts";
import Controller from "../_framework/Controller.ts";
import ResponseWrapper from "../_framework/ResponseWrapper.ts";

/** Controls the team member page */
export default class TeamMemberController extends Controller {
  /** The team members repository */
  private _teamMembers: ITeamMemberRepository;

  /** Constructs the controller using a team member repository
   * @param teamMemberRepository The team members repository
   */
  constructor(teamMemberRepository: ITeamMemberRepository) {
    super();
    this._teamMembers = teamMemberRepository;
    this.routes = [
      { method: "GET", pattern: "/team-members/", action: this.list },
      { method: "GET", pattern: "/team-member/(\\d+)/", action: this.profile },
      { method: "GET", pattern: "/team-members/add/", action: this.addGet },
      { method: "POST", pattern: "/team-members/add/", action: this.addPost },
      {
        method: "GET",
        pattern: "/team-member/(\\d+)/edit/",
        action: this.editGet,
      },
      {
        method: "POST",
        pattern: "/team-member/(\\d+)/edit/",
        action: this.editPost,
      },
      {
        method: "GET",
        pattern: "/team-member/(\\d+)/delete/",
        action: this.deleteGet,
      },
      {
        method: "POST",
        pattern: "/team-member/(\\d+)/delete/",
        action: this.deletePost,
      },
    ];
  }

  /** Gets the team member list page
   * @param context The application context
   * @returns The response
   */
  public async list(context: Context): Promise<ResponseWrapper> {
    const teamMembers = await this._teamMembers.list();
    const model = new TeamMembersViewModel(teamMembers);
    return this.HTMLResponse(context, "./views/teamMember/list.html", model);
  }

  /** Gets the team member profile page
   * @param context The application context
   * @returns The response
   */
  public async profile(context: Context): Promise<ResponseWrapper> {
    const id = parseInt(context.match[1]);
    if (isNaN(id)) return this.NotFoundResponse(context);

    const teamMember = await this._teamMembers.get(id);
    if (teamMember == null) return this.NotFoundResponse(context);

    const model = new TeamMemberEditViewModel(
      false,
      [],
      teamMember,
    );
    return this.HTMLResponse(context, "./views/teamMember/profile.html", model);
  }

  /** Gets the team member add form
   * @param context The application context
   * @returns The response
   */
  public addGet(context: Context): ResponseWrapper {
    const model = TeamMemberEditViewModel.empty();
    return this.HTMLResponse(context, "./views/teamMember/edit.html", model);
  }

  /** Accepts requests to add a team member
   * @param context The application context
   * @returns The response
   */
  public async addPost(context: Context): Promise<ResponseWrapper> {
    const model = await TeamMemberEditViewModel.fromRequest(context.request);

    model.errors = this._teamMembers.validate(
      model.teamMember,
    );
    if (!model.isValid()) {
      return this.HTMLResponse(context, "./views/teamMember/edit.html", model);
    }

    const id = await this._teamMembers.add(model.teamMember);
    return this.RedirectResponse(context, `/team-member/${id}/`);
  }

  /** Gets the team member edit form
   * @param context The application context
   * @returns The response
   */
  public async editGet(context: Context): Promise<ResponseWrapper> {
    const id = parseInt(context.match[1]);
    if (isNaN(id)) {
      return this.NotFoundResponse(context);
    }

    const teamMember = await this._teamMembers.get(id);
    if (teamMember == null) {
      return this.NotFoundResponse(context);
    }

    const model = new TeamMemberEditViewModel(
      true,
      [],
      teamMember,
    );
    return this.HTMLResponse(context, "./views/teamMember/edit.html", model);
  }

  /** Accepts requests to edit a team member
   * @param context The application context
   * @returns The response
   */
  public async editPost(context: Context): Promise<ResponseWrapper> {
    const id = parseInt(context.match[1]);
    if (isNaN(id)) {
      return this.NotFoundResponse(context);
    }

    const model = await TeamMemberEditViewModel.fromRequest(context.request);
    model.teamMember.id = id;

    model.errors = await this._teamMembers.validate(
      model.teamMember,
    );
    if (!model.isValid()) {
      model.isEdit = true;
      return this.HTMLResponse(context, "./views/teamMember/edit.html", model);
    }

    await this._teamMembers.update(model.teamMember);
    return this.RedirectResponse(context, `/team-member/${id}/`);
  }

  /** Gets the team member delete confirmation form
   * @param context The application context
   * @returns The response
   */
  public async deleteGet(context: Context): Promise<ResponseWrapper> {
    const id = parseInt(context.match[1]);
    if (isNaN(id)) {
      return this.NotFoundResponse(context);
    }

    const teamMember = await this._teamMembers.get(id);
    if (teamMember == null) {
      return this.NotFoundResponse(context);
    }

    const model = new DeleteViewModel(
      teamMember.fullName,
      `/team-member/${id}/delete/`,
      `/team-member/${id}/`,
      [
        "Time slots assigned to this team member will be unassigned.",
        "This team member will be removed from all substitute lists.",
      ],
    );
    return this.HTMLResponse(context, "./views/_shared/delete.html", model);
  }

  /** Accepts requests to delete a team member
   * @param context The application context
   * @returns The response
   */
  public async deletePost(context: Context): Promise<ResponseWrapper> {
    const id = parseInt(context.match[1]);
    if (isNaN(id)) {
      return this.NotFoundResponse(context);
    }

    const teamMember = await this._teamMembers.get(id);
    if (teamMember == null) {
      return this.NotFoundResponse(context);
    }

    await this._teamMembers.delete(id);
    return this.RedirectResponse(context, "/team-members/");
  }
}
