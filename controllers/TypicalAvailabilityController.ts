import Context from "../models/controllerLayer/Context.ts";
import Controller from "../models/controllerLayer/Controller.ts";

export const typicalAvailbilityController = new Controller();

/**
 * Team member typical availability GET
 */
typicalAvailbilityController.register(
  "GET",
  "/team-member/(\\d+)/typical-availability/",
  async (context: Context) => {
  },
);

/**
 * Team member typical availability time slot add GET
 */
typicalAvailbilityController.register(
  "GET",
  "/team-member/(\\d+)/typical-availability/add/",
  async (context: Context) => {
  },
);

/**
 * Team member typical availability time slot add POST
 */
typicalAvailbilityController.register(
  "POST",
  "/team-member/(\\d+)/typical-availability/add/",
  async (context: Context) => {
  },
);

/**
 * Team member typical availability timeslot edit GET
 */
typicalAvailbilityController.register(
  "GET",
  "/team-member/(\\d+)/typical-availability/(\\d+)/edit/",
  async (context: Context) => {
  },
);

/**
 * Team member typical availability timeslot edit POST
 */
typicalAvailbilityController.register(
  "POST",
  "/team-member/(\\d+)/typical-availability/(\\d+)/edit/",
  async (context: Context) => {
  },
);

/**
 * Team member typical availability timeslot delete GET
 */
typicalAvailbilityController.register(
  "GET",
  "/team-member/(\\d+)/typical-availability/(\\d+)/delete/",
  async (context: Context) => {
  },
);

/**
 * Team member typical availability timeslot delete POST
 */
typicalAvailbilityController.register(
  "POST",
  "/team-member/(\\d+)/typical-availability/(\\d+)/delete/",
  async (context: Context) => {
  },
);
