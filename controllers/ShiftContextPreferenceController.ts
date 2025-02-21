import Context from "../models/controllerLayer/Context.ts";
import Controller from "../models/controllerLayer/Controller.ts";

const shiftContextPreferencesController = new Controller();
export default shiftContextPreferencesController;

/**
 * Shift context preferences GET
 */
shiftContextPreferencesController.register(
  "GET",
  "/team-member/(\\d+)/preferences/",
  async (context: Context) => {
  },
);

/**
 * Shift context preferences POST
 */
shiftContextPreferencesController.register(
  "POST",
  "/team-member/(\\d+)/preferences/",
  async (context: Context) => {
  },
);
