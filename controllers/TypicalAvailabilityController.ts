import Context from "../models/controllerLayer/Context.ts";
import Controller from "../models/controllerLayer/Controller.ts";

const typicalAviailbilityController = new Controller();
export default typicalAviailbilityController;

/**
 * Team member typical availability GET
 */
typicalAviailbilityController.register(
  "GET",
  "/team-member/(\\d+)/typical-availability/",
  async (context: Context) => {
  },
);

/**
 * Team member typical availability time slot add GET
 */
typicalAviailbilityController.register(
  "GET",
  "/team-member/(\\d+)/typical-availability/add/",
  async (context: Context) => {
  },
);

/**
 * Team member typical availability time slot add POST
 */
typicalAviailbilityController.register(
  "POST",
  "/team-member/(\\d+)/typical-availability/add/",
  async (context: Context) => {
  },
);

/**
 * Team member typical availability timeslot edit GET
 */
typicalAviailbilityController.register(
  "GET",
  "/team-member/(\\d+)/typical-availability/(\\d+)/edit/",
  async (context: Context) => {
  },
);

/**
 * Team member typical availability timeslot edit POST
 */
typicalAviailbilityController.register(
  "POST",
  "/team-member/(\\d+)/typical-availability/(\\d+)/edit/",
  async (context: Context) => {
  },
);

/**
 * Team member typical availability timeslot delete GET
 */
typicalAviailbilityController.register(
  "GET",
  "/team-member/(\\d+)/typical-availability/(\\d+)/delete/",
  async (context: Context) => {
  },
);

/**
 * Team member typical availability timeslot delete POST
 */
typicalAviailbilityController.register(
  "POST",
  "/team-member/(\\d+)/typical-availability/(\\d+)/delete/",
  async (context: Context) => {
  },
);
