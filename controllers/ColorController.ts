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

const colorController = new Controller();
export default colorController;

/**
 * Color list
 */
colorController.register(
  "GET",
  "/colors/",
  async (_request: Request, _match: string[], context: Context) => {
    const colors = await ColorRepository.getColors();
    const model = new ColorsViewModel(colors, context.csrf_token);
    return HTMLResponse("./views/color/list.html", model);
  },
);

/**
 * Color add GET
 */
colorController.register(
  "GET",
  "/colors/add/",
  (_request: Request, _match: string[], _context: Context) => {
    return HTMLResponse("./views/color/edit.html", ColorEditViewModel.empty());
  },
);

/**
 * Color add POST
 */
colorController.register(
  "POST",
  "/colors/add/",
  async (request: Request, _match: string[], context: Context) => {
    const model = await ColorEditViewModel.fromRequest(request);

    model.errors = await ColorRepository.validateColor(model.color);
    if (!model.isValid()) {
      model.csrf_token = context.csrf_token;
      return HTMLResponse("./views/color/edit.html", model);
    }

    await ColorRepository.addColor(model.color);
    return RedirectResponse("/colors/");
  },
);

/**
 * Color edit GET
 */
colorController.register(
  "GET",
  "/color/(\\d+)/",
  async (_request: Request, match: string[], context: Context) => {
    const id = Number(match[1]);
    if (isNaN(id)) return NotFoundResponse();

    const color = await ColorRepository.getColor(id);
    if (color == null) return NotFoundResponse();

    const model = new ColorEditViewModel(true, [], context.csrf_token, color);
    return HTMLResponse("./views/color/edit.html", model);
  },
);

/**
 * Color edit POST
 */
colorController.register(
  "POST",
  "/color/(\\d+)/",
  async (request: Request, match: string[], context: Context) => {
    const model = ColorEditViewModel.fromFormData(await request.formData());
    model.color.id = Number(match[1]);

    model.errors = await ColorRepository.validateColor(model.color);
    if (!model.isValid()) {
      model.isEdit = true;
      model.csrf_token = context.csrf_token;
      return HTMLResponse("./views/color/edit.html", model);
    }

    await ColorRepository.updateColor(model.color);
    return RedirectResponse("/colors/");
  },
);

/**
 * Color delete GET
 */
colorController.register(
  "GET",
  "/color/(\\d+)/delete/",
  async (_request: Request, match: string[], context: Context) => {
    const id = Number(match[1]);
    if (isNaN(id)) return NotFoundResponse();

    const color = await ColorRepository.getColor(id);
    if (color == null) return NotFoundResponse();

    const model = new DeleteViewModel(
      color.name,
      `/color/${id}/delete/`,
      "/colors/",
      context.csrf_token,
    );

    return HTMLResponse("./views/shared/delete.html", model);
  },
);

/**
 * Color delete POST
 */
colorController.register(
  "POST",
  "/color/(\\d+)/delete/",
  async (_request: Request, match: string[], _context: Context) => {
    const id = Number(match[1]);
    if (isNaN(id)) return NotFoundResponse();

    const color = await ColorRepository.getColor(id);
    if (color == null) return NotFoundResponse();

    await ColorRepository.deleteColor(id);
    return RedirectResponse("/colors/");
  },
);
