import Context from "../models/controllerLayer/Context.ts";
import Controller from "../models/controllerLayer/Controller.ts";
import TeamMemberRepository from "../models/repositories/TeamMemberRepository.ts";
import DeleteViewModel from "../models/viewModels/DeleteViewModel.ts";
import TeamMemberEditViewModel from "../models/viewModels/TeamMemberEditViewModel.ts";
import TeamMembersViewModel from "../models/viewModels/TeamMembersViewModel.ts";
import {
  HTMLResponse,
  NotFoundResponse,
  RedirectResponse,
} from "./_utilities.ts";

export const teamMemberController = new Controller();

/**
 * Team member list GET
 */
teamMemberController.register(
  "GET",
  "/team-members/",
  async (context: Context) => {
    const teamMembers = await TeamMemberRepository.getTeamMembers();
    const model = new TeamMembersViewModel(teamMembers);
    return HTMLResponse(context, "./views/teamMember/list.html", model);
  },
);

/**
 * Team member profile GET
 */
teamMemberController.register(
  "GET",
  "/team-member/(\\d+)/",
  async (context: Context) => {
    const id = parseInt(context.match[1]);
    if (isNaN(id)) {
      return;
    }

    const teamMember = await TeamMemberRepository.getTeamMember(id);
    if (teamMember == null) {
      return;
    }

    const model = new TeamMemberEditViewModel(
      false,
      [],
      context.csrf_token,
      teamMember,
    );
    return HTMLResponse(context, "./views/teamMember/profile.html", model);
  },
);

/**
 * Team member add GET
 */
teamMemberController.register(
  "GET",
  "/team-members/add/",
  (context: Context) => {
    const model = TeamMemberEditViewModel.empty();
    model.csrf_token = context.csrf_token;
    return HTMLResponse(context, "./views/teamMember/edit.html", model);
  },
);

/**
 * Team member add POST
 */
teamMemberController.register(
  "POST",
  "/team-member/add/",
  async (context: Context) => {
    const model = await TeamMemberEditViewModel.fromRequest(context.request);

    model.errors = await TeamMemberRepository.validateTeamMember(
      model.teamMember,
    );
    if (!model.isValid()) {
      model.csrf_token = context.csrf_token;
      return HTMLResponse(context, "./views/teamMember/edit.html", model);
    }

    const id = await TeamMemberRepository.addTeamMember(model.teamMember);
    return RedirectResponse(context, `/team-member/${id}/`);
  },
);

/**
 * Team member edit GET
 */
teamMemberController.register(
  "GET",
  "/team-member/(\\d+)/edit/",
  async (context: Context) => {
    const id = parseInt(context.match[1]);
    if (isNaN(id)) {
      return NotFoundResponse(context);
    }

    const teamMember = await TeamMemberRepository.getTeamMember(id);
    if (teamMember == null) {
      return NotFoundResponse(context);
    }

    const model = new TeamMemberEditViewModel(
      true,
      [],
      context.csrf_token,
      teamMember,
    );
    return HTMLResponse(context, "./views/teamMember/edit.html", model);
  },
);

/**
 * Team member edit POST
 */
teamMemberController.register(
  "POST",
  "/team-member/(\\d+)/edit/",
  async (context: Context) => {
    const id = parseInt(context.match[1]);
    if (isNaN(id)) {
      return NotFoundResponse(context);
    }

    const model = await TeamMemberEditViewModel.fromRequest(context.request);
    model.teamMember.id = id;

    model.errors = await TeamMemberRepository.validateTeamMember(
      model.teamMember,
    );
    if (!model.isValid()) {
      model.isEdit = true;
      return HTMLResponse(context, "./views/teamMember/edit.html", model);
    }

    await TeamMemberRepository.updateTeamMember(model.teamMember);
    return RedirectResponse(context, `/team-member/${id}/`);
  },
);

/**
 * Team member delete GET
 */
teamMemberController.register(
  "GET",
  "/team-member/(\\d+)/delete/",
  async (context: Context) => {
    const id = parseInt(context.match[1]);
    if (isNaN(id)) {
      return NotFoundResponse(context);
    }

    const teamMember = await TeamMemberRepository.getTeamMember(id);
    if (teamMember == null) {
      return NotFoundResponse(context);
    }

    const model = new DeleteViewModel(
      teamMember.fullName,
      `/team-member/${id}/delete/`,
      `/team-member/${id}/`,
      context.csrf_token,
    );
    return HTMLResponse(context, "./views/shared/delete.html", model);
  },
);

/**
 * Team member delete POST
 */
teamMemberController.register(
  "POST",
  "/team-member/(\\d+)/delete/",
  async (context: Context) => {
    const id = parseInt(context.match[1]);
    if (isNaN(id)) {
      return NotFoundResponse(context);
    }

    const teamMember = await TeamMemberRepository.getTeamMember(id);
    if (teamMember == null) {
      return NotFoundResponse(context);
    }

    await TeamMemberRepository.deleteTeamMember(id);
    return RedirectResponse(context, "/team-members/");
  },
);
