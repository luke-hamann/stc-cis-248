import Context from "../models/controllerLayer/Context.ts";
import Controller from "../models/controllerLayer/Controller.ts";
import ShiftContextRepository from "../models/repositories/ShiftContextRepository.ts";
import ShiftContextPreferenceRepository from "../models/repositories/ShiftContextPreferenceRepository.ts";
import TeamMemberRepository from "../models/repositories/TeamMemberRepository.ts";
import { HTMLResponse, NotFoundResponse } from "./_utilities.ts";
import ShiftContextPreference from "../models/entities/ShiftContextPreference.ts";
import ShiftContextEditViewModel from "../models/viewModels/ShiftContextEditViewModel.ts";
import ShiftContextPreferencesEditViewModel from "../models/viewModels/ShiftContextPreferencesEditViewModel.ts";

export const shiftContextPreferenceController = new Controller();

/**
 * Shift context preferences GET
 */
shiftContextPreferenceController.register(
  "GET",
  "/team-member/(\\d+)/preferences/",
  async (context: Context) => {
    const id = Number(context.match[1]);
    if (isNaN(id)) {
      return NotFoundResponse(context);
    }

    const teamMember = await TeamMemberRepository.getTeamMember(id);
    if (teamMember == null) {
      return NotFoundResponse(context);
    }

    const shiftContexts = await ShiftContextRepository.getShiftContexts();
    const shiftContextPreferences = await ShiftContextPreferenceRepository
      .getShiftContextPreferences(id);

    const model = new ShiftContextPreferencesEditViewModel(
      context.csrf_token,
      teamMember,
      shiftContexts,
      shiftContextPreferences,
    );

    return HTMLResponse(context, "./views/shiftContextPreference/edit.html", model);
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
