import Context from "../models/controllerLayer/Context.ts";
import Controller from "../models/controllerLayer/Controller.ts";
import TeamMemberRepository from "../models/repositories/TeamMemberRepository.ts";
import TeamMemberEditViewModel from "../models/viewModels/TeamMemberEditViewModel.ts";
import TeamMembersViewModel from "../models/viewModels/TeamMembersViewModel.ts";
import { HTMLResponse } from "./_utilities.ts";

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
    const id = Number(context.match[1]);
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
  async (context: Context) => {
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
  },
);

/**
 * Team member edit GET
 */
teamMemberController.register(
  "GET",
  "/team-member/(\\d+)/edit/",
  async (context: Context) => {
  },
);

/**
 * Team member edit POST
 */
teamMemberController.register(
  "POST",
  "/team-member/(\\d+)/edit/",
  async (context: Context) => {
  },
);

/**
 * Team member delete GET
 */
teamMemberController.register(
  "GET",
  "/team-member/(\\d+)/delete/",
  async (context: Context) => {
  },
);

/**
 * Team member delete POST
 */
teamMemberController.register(
  "POST",
  "/team-member/(\\d+)/delete/",
  async (context: Context) => {
  },
);
