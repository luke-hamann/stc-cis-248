import Context from "../models/controllerLayer/Context.ts";
import Controller from "../models/controllerLayer/Controller.ts";

export const teamMemberController = new Controller();

/**
 * Team member list GET
 */
teamMemberController.register(
  "GET",
  "/team-members/",
  async (context: Context) => {
  },
);

/**
 * Team member profile GET
 */
teamMemberController.register(
  "GET",
  "/team-member/(\\d+)/",
  async (context: Context) => {
  },
);

/**
 * Team member add GET
 */
teamMemberController.register(
  "GET",
  "/team-member/add/",
  async (context: Context) => {
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
