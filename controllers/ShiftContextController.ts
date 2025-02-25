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

export const shiftContextController = new Controller();

/**
 * Shift context list
 */
shiftContextController.register(
  "GET",
  "/contexts/",
  async (context: Context) => {
    const shiftContexts = await ShiftContextRepository.getShiftContexts();
    const model = new ShiftContextsViewModel(shiftContexts);
    return HTMLResponse(context, "./views/shiftContext/list.html", model);
  },
);

/**
 * Shift context add GET
 */
shiftContextController.register(
  "GET",
  "/context/add/",
  (context: Context) => {
    const model = new ShiftContextEditViewModel(
      false,
      [],
      context.csrf_token,
      ShiftContext.empty(),
    );
    return HTMLResponse(context, "./views/shiftContext/edit.html", model);
  },
);

/**
 * Shift context add POST
 */
shiftContextController.register(
  "POST",
  "/context/add/",
  async (context: Context) => {
    const model = ShiftContextEditViewModel.fromFormData(
      await context.request.formData(),
    );

    model.errors = await ShiftContextRepository.validate(model.shiftContext);
    if (!model.isValid()) {
      model.csrf_token = context.csrf_token;
      return HTMLResponse(context, "./views/shiftContext/edit.html", model);
    }

    await ShiftContextRepository.addShiftContext(model.shiftContext);
    return RedirectResponse(context, "/contexts/");
  },
);

/**
 * Shift context edit GET
 */
shiftContextController.register(
  "GET",
  "/context/(\\d+)/",
  async (context: Context) => {
    const id = Number(context.match[1]);
    if (isNaN(id)) return;

    const shiftContext = await ShiftContextRepository.getShiftContext(id);
    if (shiftContext == null) return NotFoundResponse(context);

    const model = new ShiftContextEditViewModel(
      true,
      [],
      context.csrf_token,
      shiftContext,
    );
    return HTMLResponse(context, "./views/shiftContext/edit.html", model);
  },
);

/**
 * Shift context edit POST
 */
shiftContextController.register(
  "POST",
  "/context/(\\d+)/",
  async (context: Context) => {
    const model = await ShiftContextEditViewModel.fromRequest(context.request);

    model.errors = await ShiftContextRepository.validate(model.shiftContext);
    if (!model.isValid()) {
      model.isEdit = true;
      model.csrf_token = context.csrf_token;
      return HTMLResponse(context, "./views/shiftContext/edit.html", model);
    }

    await ShiftContextRepository.updateShiftContext(model.shiftContext);
    return RedirectResponse(context, "/contexts/");
  },
);

/**
 * Shift context delete GET
 */
shiftContextController.register(
  "GET",
  "/context/(\\d+)/delete/",
  async (context: Context) => {
    const id = Number(context.match[1]);
    if (isNaN(id)) return NotFoundResponse(context);

    const shiftContext = await ShiftContextRepository.getShiftContext(id);
    if (shiftContext == null) return NotFoundResponse(context);

    const model = new DeleteViewModel(
      shiftContext.name,
      `/context/${id}/delete/`,
      "/contexts/",
      context.csrf_token,
    );
    return HTMLResponse(context, "./views/shared/delete.html", model);
  },
);

/**
 * Shift context delete POST
 */
shiftContextController.register(
  "POST",
  "/context/(\\d+)/delete/",
  async (context: Context) => {
    const id = Number(context.match[1]);
    if (isNaN(id)) {
      return NotFoundResponse(context);
    }

    const shiftContext = await ShiftContextRepository.getShiftContext(id);
    if (shiftContext == null) {
      return NotFoundResponse(context);
    }

    await ShiftContextRepository.deleteShiftContext(id);
    return RedirectResponse(context, "/contexts/");
  },
);
