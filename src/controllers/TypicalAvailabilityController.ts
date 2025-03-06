import Context from "../models/controllerLayer/Context.ts";
import Controller from "../models/controllerLayer/Controller.ts";

export const typicalAvailabilityController = new Controller();

/**
 * Team member typical availability GET
 */
typicalAvailabilityController.register(
  "GET",
  "/team-member/(\\d+)/typical-availability/",
  async (context: Context) => {
  },
);

/**
 * Team member typical availability time slot add GET
 */
typicalAvailabilityController.register(
  "GET",
  "/team-member/(\\d+)/typical-availability/add/",
  async (context: Context) => {
  },
);

/**
 * Team member typical availability time slot add POST
 */
typicalAvailabilityController.register(
  "POST",
  "/team-member/(\\d+)/typical-availability/add/",
  async (context: Context) => {
  },
);

/**
 * Team member typical availability timeslot edit GET
 */
typicalAvailabilityController.register(
  "GET",
  "/team-member/(\\d+)/typical-availability/(\\d+)/edit/",
  async (context: Context) => {
  },
);

/**
 * Team member typical availability timeslot edit POST
 */
typicalAvailabilityController.register(
  "POST",
  "/team-member/(\\d+)/typical-availability/(\\d+)/edit/",
  async (context: Context) => {
  },
);

/**
 * Team member typical availability timeslot delete GET
 */
typicalAvailabilityController.register(
  "GET",
  "/team-member/(\\d+)/typical-availability/(\\d+)/delete/",
  async (context: Context) => {
  },
);

/**
 * Team member typical availability timeslot delete POST
 */
typicalAvailabilityController.register(
  "POST",
  "/team-member/(\\d+)/typical-availability/(\\d+)/delete/",
  async (context: Context) => {
  },
);
