import Context from "../models/controllerLayer/Context.ts";
import ColorEditViewModel from "../models/viewModels/ColorEditViewModel.ts";
import ColorRepository from "../models/repositories/ColorRepository.ts";
import ColorsViewModel from "../models/viewModels/ColorsViewModel.ts";
import Controller from "../models/controllerLayer/Controller.ts";
import {
  HTMLResponse,
  NotFoundResponse,
  RedirectResponse,
} from "./_utilities.ts";
import DeleteViewModel from "../models/viewModels/DeleteViewModel.ts";

export const colorController = new Controller();

/**
 * Color list
 */
colorController.register(
  "GET",
  "/colors/",
  async (context: Context) => {
    const colors = await ColorRepository.getColors();
    const model = new ColorsViewModel(colors, context.csrf_token);
    return HTMLResponse(context, "./views/color/list.html", model);
  },
);

/**
 * Color add GET
 */
colorController.register(
  "GET",
  "/colors/add/",
  (context: Context) => {
    return HTMLResponse(
      context,
      "./views/color/edit.html",
      ColorEditViewModel.empty(),
    );
  },
);

/**
 * Color add POST
 */
colorController.register(
  "POST",
  "/colors/add/",
  async (context: Context) => {
    const model = await ColorEditViewModel.fromRequest(context.request);

    model.errors = await ColorRepository.validateColor(model.color);
    if (!model.isValid()) {
      model.csrf_token = context.csrf_token;
      return HTMLResponse(context, "./views/color/edit.html", model);
    }

    await ColorRepository.addColor(model.color);
    return RedirectResponse(context, "/colors/");
  },
);

/**
 * Color edit GET
 */
colorController.register(
  "GET",
  "/color/(\\d+)/",
  async (context: Context) => {
    const id = parseInt(context.match[1]);
    if (isNaN(id)) {
      return NotFoundResponse(context);
    }

    const color = await ColorRepository.getColor(id);
    if (color == null) {
      return NotFoundResponse(context);
    }

    const model = new ColorEditViewModel(true, [], context.csrf_token, color);
    return HTMLResponse(context, "./views/color/edit.html", model);
  },
);

/**
 * Color edit POST
 */
colorController.register(
  "POST",
  "/color/(\\d+)/",
  async (context: Context) => {
    const model = ColorEditViewModel.fromFormData(
      await context.request.formData(),
    );
    model.color.id = parseInt(context.match[1]);

    model.errors = await ColorRepository.validateColor(model.color);
    if (!model.isValid()) {
      model.isEdit = true;
      model.csrf_token = context.csrf_token;
      return HTMLResponse(context, "./views/color/edit.html", model);
    }

    await ColorRepository.updateColor(model.color);
    return RedirectResponse(context, "/colors/");
  },
);

/**
 * Color delete GET
 */
colorController.register(
  "GET",
  "/color/(\\d+)/delete/",
  async (context: Context) => {
    const id = parseInt(context.match[1]);
    if (isNaN(id)) {
      return NotFoundResponse(context);
    }

    const color = await ColorRepository.getColor(id);
    if (color == null) {
      return NotFoundResponse(context);
    }

    const model = new DeleteViewModel(
      color.name,
      `/color/${id}/delete/`,
      "/colors/",
      context.csrf_token,
    );

    return HTMLResponse(context, "./views/shared/delete.html", model);
  },
);

/**
 * Color delete POST
 */
colorController.register(
  "POST",
  "/color/(\\d+)/delete/",
  async (context: Context) => {
    const id = parseInt(context.match[1]);
    if (isNaN(id)) {
      return NotFoundResponse(context);
    }

    const color = await ColorRepository.getColor(id);
    if (color == null) {
      return NotFoundResponse(context);
    }

    await ColorRepository.deleteColor(id);
    return RedirectResponse(context, "/colors/");
  },
);
