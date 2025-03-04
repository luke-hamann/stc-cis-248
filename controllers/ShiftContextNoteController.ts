import Context from "../models/controllerLayer/Context.ts";
import Controller from "../models/controllerLayer/Controller.ts";
import ColorRepository from "../models/repositories/ColorRepository.ts";
import ShiftContextNoteRepository from "../models/repositories/ShiftContextNoteRepository.ts";
import ShiftContextRepository from "../models/repositories/ShiftContextRepository.ts";
import ShiftContextNoteEditViewModel from "../models/viewModels/ShiftContextNoteEditViewModel.ts";
import { HTMLResponse, NotFoundResponse } from "./_utilities.ts";

export const shiftContextNoteController = new Controller();

/**
 * Shift context note edit GET
 */
shiftContextNoteController.register(
  "GET",
  "/shift-context/(\\d+)/note/(\\d{4})/(\\d{2})/(\\d{2})/",
  async (context: Context) => {
    const shiftContextId = parseInt(context.match[1]);

    if (isNaN(shiftContextId)) {
      return NotFoundResponse(context);
    }

    const year = context.match[2];
    const month = context.match[3];
    const day = context.match[4];

    const timestamp = Date.parse(`${year}-${month}-${day}`);
    if (isNaN(timestamp)) {
      return NotFoundResponse(context);
    }

    const date = new Date(timestamp);
    const shiftContextNote = await ShiftContextNoteRepository
      .getShiftContextNote(
        shiftContextId,
        date,
      );
    const colors = await ColorRepository.getColors();

    const model = new ShiftContextNoteEditViewModel(
      [],
      context.csrf_token,
      shiftContextNote,
      colors,
    );

    return HTMLResponse(
      context,
      "./views/shiftContextNote/edit.html",
      model,
    );
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
