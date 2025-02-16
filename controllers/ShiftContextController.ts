import ShiftContext from "../models/entities/ShiftContext.ts";
import ShiftContextRepository from "../models/repositories/ShiftContextRepository.ts";
import ShiftContextEditViewModel from "../models/viewModels/ShiftContextEditViewModel.ts";
import ShiftContextsViewModel from "../models/viewModels/ShiftContextsViewModel.ts";
import { HTMLResponse } from "./_utilities.ts";

export async function shiftContextController(
  request: Request,
): Promise<Response | void> {
  const path = new URL(request.url).pathname;

  // Shift context list page
  if (request.method == "GET" && path == "/contexts/") {
    const shiftContexts = await ShiftContextRepository.getShiftContexts();
    const model = new ShiftContextsViewModel(shiftContexts);
    return HTMLResponse("./views/shiftContext/list.html", model);
  }

  // Shift context add page
  if (request.method == "GET" && path == "/context/add/") {
    const model = new ShiftContextEditViewModel(
      new ShiftContext(0, "", "", "", ""),
      false,
      [],
    );
    return HTMLResponse("./views/shiftContext/edit.html", model);
  }

  return;
}
