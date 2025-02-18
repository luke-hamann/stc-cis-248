import Context from "../models/controllerLayer/Context.ts";
import Controller from "../models/controllerLayer/Controller.ts";
import ShiftContext from "../models/entities/ShiftContext.ts";
import ShiftContextRepository from "../models/repositories/ShiftContextRepository.ts";
import DeleteViewModel from "../models/viewModels/DeleteViewModel.ts";
import ShiftContextEditViewModel from "../models/viewModels/ShiftContextEditViewModel.ts";
import ShiftContextsViewModel from "../models/viewModels/ShiftContextsViewModel.ts";
import {
  HTMLResponse,
  NotFoundResponse,
  RedirectResponse,
} from "./_utilities.ts";

const shiftContextController = new Controller();
export default shiftContextController;

/**
 * Shift context list
 */
shiftContextController.register(
  "GET",
  "/contexts/",
  async (_request: Request, _match: string[], _context: Context) => {
    const shiftContexts = await ShiftContextRepository.getShiftContexts();
    const model = new ShiftContextsViewModel(shiftContexts);
    return HTMLResponse("./views/shiftContext/list.html", model);
  },
);

/**
 * Shift context add GET
 */
shiftContextController.register(
  "GET",
  "/context/add/",
  (_r: Request, _m: string[], _c: Context) => {
    const model = new ShiftContextEditViewModel(
      false,
      [],
      _c.csrf_token,
      ShiftContext.empty(),
    );
    return HTMLResponse(
      "./views/shiftContext/edit.html",
      model,
    );
  },
);

/**
 * Shift context add POST
 */
shiftContextController.register(
  "POST",
  "/context/add/",
  async (request: Request, _m: string[], context: Context) => {
    const model = ShiftContextEditViewModel.fromFormData(
      await request.formData(),
    );

    model.errors = await ShiftContextRepository.validate(model.shiftContext);
    if (!model.isValid()) {
      model.csrf_token = context.csrf_token;
      return HTMLResponse("./views/shiftContext/edit.html", model);
    }

    await ShiftContextRepository.addShiftContext(model.shiftContext);
    return RedirectResponse("/contexts/");
  },
);

/**
 * Shift context edit GET
 */
shiftContextController.register(
  "GET",
  "/context/(\\d+)/",
  async (_r: Request, match: string[], context: Context) => {
    const id = Number(match[1]);
    if (isNaN(id)) return;

    const shiftContext = await ShiftContextRepository.getShiftContext(id);
    if (shiftContext == null) return NotFoundResponse();

    const model = new ShiftContextEditViewModel(
      true,
      [],
      context.csrf_token,
      shiftContext,
    );
    return HTMLResponse("./views/shiftContext/edit.html", model);
  },
);

/**
 * Shift context edit POST
 */
shiftContextController.register(
  "POST",
  "/context/(\\d+)/",
  async (request: Request, _m: string[], context: Context) => {
    const model = await ShiftContextEditViewModel.fromRequest(request);

    model.errors = await ShiftContextRepository.validate(model.shiftContext);
    if (!model.isValid()) {
      model.isEdit = true;
      model.csrf_token = context.csrf_token;
      return HTMLResponse("./views/shiftContext/edit.html", model);
    }

    await ShiftContextRepository.updateShiftContext(model.shiftContext);
    return RedirectResponse("/contexts/");
  },
);

/**
 * Shift context delete GET
 */
shiftContextController.register(
  "GET",
  "/context/(\\d+)/delete/",
  async (_r: Request, match: string[], context: Context) => {
    const id = Number(match[1]);
    if (isNaN(id)) return NotFoundResponse();

    const shiftContext = await ShiftContextRepository.getShiftContext(id);
    if (shiftContext == null) return NotFoundResponse();

    const model = new DeleteViewModel(
      shiftContext.name,
      `/context/${id}/delete/`,
      "/contexts/",
      context.csrf_token,
    );
    return HTMLResponse("./views/shared/delete.html", model);
  },
);

/**
 * Shift context delete POST
 */
shiftContextController.register(
  "POST",
  "/context/(\\d+)/delete/",
  async (_r: Request, match: string[], _context: Context) => {
    const id = Number(match[1]);
    if (isNaN(id)) return NotFoundResponse();

    const shiftContext = await ShiftContextRepository.getShiftContext(id);
    if (shiftContext == null) return NotFoundResponse();

    await ShiftContextRepository.deleteShiftContext(id);
    return RedirectResponse("/contexts/");
  },
);
