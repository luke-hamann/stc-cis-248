import Context from "../models/controllerLayer/Context.ts";
import Controller from "../models/controllerLayer/Controller.ts";

const shiftContextNotesController = new Controller();
export default shiftContextNotesController;

/**
 * Shift context note edit GET
 */
shiftContextNotesController.register(
  "GET",
  "/shift-context/note/(\\d+)/",
  async (context: Context) => {
  },
);

/**
 * Shift context note edit POST
 */
shiftContextNotesController.register(
  "POST",
  "/shift-context/note/(\\d+)/",
  async (context: Context) => {
  },
);
