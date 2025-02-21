import Context from "../models/controllerLayer/Context.ts";
import Controller from "../models/controllerLayer/Controller.ts";

const substitutesController = new Controller();
export default substitutesController;

/**
 * Substitute add GET
 */
substitutesController.register(
  "GET",
  "/substitutes/(\\d{4})/(\\d{2})/(\\d{2})/",
  async (context: Context) => {
  },
);

/**
 * Substitute add POST
 */
substitutesController.register(
  "GET",
  "/substitutes/(\\d{4})/(\\d{2})/(\\d{2})/",
  async (context: Context) => {
  },
);

/**
 * Substitute delete GET
 */
substitutesController.register(
  "GET",
  "/substitutes/(\\d{4})/(\\d{2})/(\\d{id})/(\\d+)/",
  async (context: Context) => {
  },
);

/**
 * Substitute delete POST
 */
substitutesController.register(
  "POST",
  "/substitutes/(\\d{4})/(\\d{2})/(\\d{id})/(\\d+)/",
  async (context: Context) => {
  },
);
