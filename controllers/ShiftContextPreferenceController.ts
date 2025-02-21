import Context from "../models/controllerLayer/Context.ts";
import Controller from "../models/controllerLayer/Controller.ts";

export const shiftContextPreferenceController = new Controller();

/**
 * Shift context preferences GET
 */
shiftContextPreferenceController.register(
  "GET",
  "/team-member/(\\d+)/preferences/",
  async (context: Context) => {
  },
);

/**
 * Shift context preferences POST
 */
shiftContextPreferenceController.register(
  "POST",
  "/team-member/(\\d+)/preferences/",
  async (context: Context) => {
  },
);
