import Context from "../models/controllerLayer/Context.ts";
import Controller from "../models/controllerLayer/Controller.ts";

export const shiftContextNoteController = new Controller();

/**
 * Shift context note edit GET
 */
shiftContextNoteController.register(
  "GET",
  "/shift-context/note/(\\d+)/",
  async (context: Context) => {
  },
);

/**
 * Shift context note edit POST
 */
shiftContextNoteController.register(
  "POST",
  "/shift-context/note/(\\d+)/",
  async (context: Context) => {
  },
);
