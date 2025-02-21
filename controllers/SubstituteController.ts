import Context from "../models/controllerLayer/Context.ts";
import Controller from "../models/controllerLayer/Controller.ts";

export const substituteController = new Controller();

/**
 * Substitute add GET
 */
substituteController.register(
  "GET",
  "/substitutes/(\\d{4})/(\\d{2})/(\\d{2})/",
  async (context: Context) => {
  },
);

/**
 * Substitute add POST
 */
substituteController.register(
  "GET",
  "/substitutes/(\\d{4})/(\\d{2})/(\\d{2})/",
  async (context: Context) => {
  },
);

/**
 * Substitute delete GET
 */
substituteController.register(
  "GET",
  "/substitutes/(\\d{4})/(\\d{2})/(\\d{id})/(\\d+)/",
  async (context: Context) => {
  },
);

/**
 * Substitute delete POST
 */
substituteController.register(
  "POST",
  "/substitutes/(\\d{4})/(\\d{2})/(\\d{id})/(\\d+)/",
  async (context: Context) => {
  },
);
