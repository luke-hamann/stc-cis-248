import Context from "../_framework/Context.ts";
import TeamMemberRepository from "../models/repositories/TeamMemberRepository.ts";
import DeleteViewModel from "../models/viewModels/DeleteViewModel.ts";
import TeamMemberEditViewModel from "../models/viewModels/TeamMemberEditViewModel.ts";
import TeamMembersViewModel from "../models/viewModels/TeamMembersViewModel.ts";
import Controller from "../_framework/Controller.ts";

export default class TeamMemberController extends Controller {
  private teamMemberRepository: TeamMemberRepository;

  constructor(teamMemberRepository: TeamMemberRepository) {
    super();
    this.teamMemberRepository = teamMemberRepository;
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

  /**
   * Team member list GET
   */
  public async list(context: Context) {
    const teamMembers = await this.teamMemberRepository.list();
    const model = new TeamMembersViewModel(teamMembers);
    return this.HTMLResponse(context, "./views/teamMember/list.html", model);
  }

  /**
   * Team member profile GET
   */
  public async profile(context: Context) {
    const id = parseInt(context.match[1]);
    if (isNaN(id)) {
      return;
    }

    const teamMember = await this.teamMemberRepository.get(id);
    if (teamMember == null) {
      return;
    }

    const model = new TeamMemberEditViewModel(
      false,
      [],
      context.csrf_token,
      teamMember,
    );
    return this.HTMLResponse(context, "./views/teamMember/profile.html", model);
  }

  /**
   * Team member add GET
   */
  public addGet(context: Context) {
    const model = TeamMemberEditViewModel.empty();
    model.csrf_token = context.csrf_token;
    return this.HTMLResponse(context, "./views/teamMember/edit.html", model);
  }

  /**
   * Team member add POST
   */
  public async addPost(context: Context) {
    const model = await TeamMemberEditViewModel.fromRequest(context.request);

    model.errors = await this.teamMemberRepository.validate(
      model.teamMember,
    );
    if (!model.isValid()) {
      model.csrf_token = context.csrf_token;
      return this.HTMLResponse(context, "./views/teamMember/edit.html", model);
    }

    const id = await this.teamMemberRepository.add(model.teamMember);
    return this.RedirectResponse(context, `/team-member/${id}/`);
  }

  /**
   * Team member edit GET
   */
  public async editGet(context: Context) {
    const id = parseInt(context.match[1]);
    if (isNaN(id)) {
      return this.NotFoundResponse(context);
    }

    const teamMember = await this.teamMemberRepository.get(id);
    if (teamMember == null) {
      return this.NotFoundResponse(context);
    }

    const model = new TeamMemberEditViewModel(
      true,
      [],
      context.csrf_token,
      teamMember,
    );
    return this.HTMLResponse(context, "./views/teamMember/edit.html", model);
  }

  /**
   * Team member edit POST
   */
  public async editPost(context: Context) {
    const id = parseInt(context.match[1]);
    if (isNaN(id)) {
      return this.NotFoundResponse(context);
    }

    const model = await TeamMemberEditViewModel.fromRequest(context.request);
    model.teamMember.id = id;

    model.errors = await this.teamMemberRepository.validate(
      model.teamMember,
    );
    if (!model.isValid()) {
      model.isEdit = true;
      return this.HTMLResponse(context, "./views/teamMember/edit.html", model);
    }

    await this.teamMemberRepository.update(model.teamMember);
    return this.RedirectResponse(context, `/team-member/${id}/`);
  }

  /**
   * Team member delete GET
   */
  public async deleteGet(context: Context) {
    const id = parseInt(context.match[1]);
    if (isNaN(id)) {
      return this.NotFoundResponse(context);
    }

    const teamMember = await this.teamMemberRepository.get(id);
    if (teamMember == null) {
      return this.NotFoundResponse(context);
    }

    const model = new DeleteViewModel(
      teamMember.fullName,
      `/team-member/${id}/delete/`,
      `/team-member/${id}/`,
      context.csrf_token,
    );
    return this.HTMLResponse(context, "./views/_shared/delete.html", model);
  }

  /**
   * Team member delete POST
   */
  public async deletePost(context: Context) {
    const id = parseInt(context.match[1]);
    if (isNaN(id)) {
      return this.NotFoundResponse(context);
    }

    const teamMember = await this.teamMemberRepository.get(id);
    if (teamMember == null) {
      return this.NotFoundResponse(context);
    }

    await this.teamMemberRepository.delete(id);
    return this.RedirectResponse(context, "/team-members/");
  }
}
