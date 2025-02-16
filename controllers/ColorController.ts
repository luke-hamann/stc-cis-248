import Color from "../models/entities/Color.ts";
import ColorRepository from "../models/repositories/ColorRepository.ts";
import ColorEditViewModel from "../models/viewModels/ColorEditViewModel.ts";
import ColorsViewModel from "../models/viewModels/ColorsViewModel.ts";
import DeleteViewModel from "../models/viewModels/DeleteViewModel.ts";
import { HTMLResponse, RedirectResponse } from "./_utilities.ts";

class ApplicationContext {
  csrf: string = "";
}

class Action {
  private _method: HTTPMethod;
  private _pattern: RegExp;
  private _handler: Handler;

  public constructor(method: HTTPMethod, pattern: string, handler: Handler) {
    this._method = method;
    this._pattern = new RegExp(`/^${pattern}$/g`);
    this._handler = handler;
  }

  public async execute(
    request: Request,
    context: ApplicationContext,
  ): HandlerResult {
    if (request.method != this._method) return context;
    const url = new URL(request.url);
    const match = url.pathname.matchAll(this._pattern).toArray()[0];
    if (!match) return context;
    return await this._handler(request, match, context);
  }
}

class Controller {
  private _actions: Action[] = [];

  public register(method: HTTPMethod, pattern: string, handler: Handler) {
    this._actions.push(new Action(method, pattern, handler));
  }

  public async execute(
    request: Request,
    context: ApplicationContext,
  ): HandlerResult {
    for (const action of this._actions) {
      const result = await action.execute(request, context);
      if (result instanceof Response) {
        return result;
      } else if (result instanceof ApplicationContext) {
        context = result;
      }
    }
    return context;
  }
}

const colorController = new Controller();

colorController.register(
  "GET",
  "/colors/",
  async (_request, _match, _context) => {
    const colors = await ColorRepository.getColors();
    const model = new ColorsViewModel(colors);
    return HTMLResponse("./views/color/list.html", model);
  },
);

colorController.register(
  "GET",
  "/colors/(\d+)/",
  async (_request, match, context) => {
    const id = Number(match[1]);
    if (isNaN(id)) return context;

    const color = await ColorRepository.getColor(id);
    if (color == null) return context;

    const model = new ColorEditViewModel(color, true, []);
    return HTMLResponse("./views/color/edit.html", model);
  },
);

export default colorController;

/*

export default async function colorController(
  request: Request,
): Promise<Response | void> {
  const path = new URL(request.url).pathname;
  let match = [];

  // Color list page
  if (request.method == "GET" && path == "/colors/") {
    const colors = await ColorRepository.getColors();
    const model = new ColorsViewModel(colors);
    return HTMLResponse("./views/color/list.html", model);
  }

  // Color add page
  if (request.method == "GET" && path == "/colors/add/") {
    const model = new ColorEditViewModel(new Color(0, "", ""), false, []);
    return HTMLResponse("./views/color/edit.html", model);
  }

  // Color add page
  if (request.method == "POST" && path == "/colors/add/") {
    const model = ColorEditViewModel.fromFormData(await request.formData());
    console.log(model);
    const errors = await ColorRepository.validateColor(model.color);

    if (errors.length > 0) {
      model.isEdit = false;
      model.errors = errors;
      return HTMLResponse("./views/color/edit.html", model);
    }

    await ColorRepository.addColor(model.color);
    return RedirectResponse("/colors/");
  }

  // Color edit page
  if (
    request.method == "GET" && (
      match = [...path.matchAll(/^\/color\/(\d+)\/$/g)][0]
    )
  ) {
    const id = Number(match[1]);
    if (isNaN(id)) return;

    const color = await ColorRepository.getColor(id);
    if (color == null) return;

    const model = new ColorEditViewModel(color, true, []);
    return HTMLResponse("./views/color/edit.html", model);
  }

  // Color edit page
  if (
    request.method == "POST" && (
      match = [...path.matchAll(/^\/color\/(\d+)\/$/g)][0]
    )
  ) {
    const model = ColorEditViewModel.fromFormData(await request.formData());
    model.color.id = Number(match[1]);
    const errors = await ColorRepository.validateColor(model.color);

    if (errors.length > 0) {
      model.isEdit = true;
      model.errors = errors;
      return HTMLResponse("./views/color/edit.html", model);
    }

    await ColorRepository.updateColor(model.color);
    return RedirectResponse("/colors/");
  }

  // Color delete page
  if (
    request.method == "GET" && (
      match = [...path.matchAll(/^\/color\/(\d+)\/delete\/$/g)][0]
    )
  ) {
    const id = Number(match[1]);
    if (isNaN(id)) return;
    const color = await ColorRepository.getColor(id);
    if (color == null) return;
    const model = new DeleteViewModel(
      color.name,
      `/color/${id}/delete/`,
      "/colors/",
    );
    return HTMLResponse("./views/shared/delete.html", model);
  }

  // Color delete page
  if (
    request.method == "POST" && (
      match = [...path.matchAll(/^\/color\/(\d+)\/delete\/$/g)][0]
    )
  ) {
    const id = Number(match[1]);
    if (isNaN(id)) return;
    const color = await ColorRepository.getColor(id);
    if (color == null) return;
    await ColorRepository.deleteColor(id);
    return RedirectResponse("/colors/");
  }
}

/*
export {
  editColor: async (_request: Request, _url: URL, match: string[]) => {
    const id = Number(match[1]);

    const color = await ColorRepository.getColor(id);
    if (color == null) return null;

    const model = new ColorEditViewModel(color);
    const view = nunjucks.render("./views/color/edit.html", { model });
    const options = { headers: new Headers({ "Content-Type": "text/html" }) };
    return new Response(view, options);
  },

  deleteColor: async (_request: Request, _url: URL, match: string[]) => {
    const id = Number(match[1]);

    const color = await ColorRepository.getColor(id);
    if (color == null) return null;

    const model = new DeleteViewModel(
      color.name,
      `/color/${id}/delete/`,
      `/colors/`,
    );
    const view = nunjucks.render("./views/shared/delete.html", { model });
    const options = { headers: new Headers({ "Content-Type": "text/html" }) };
    return new Response(view, options);
  },

  deleteColorPOST: async (_request: Request, _url: URL, match: string[]) => {
    const id = Number(match[1]);
    console.log(match);
    const color = await ColorRepository.getColor(id);
    if (color == null) return null;

    await ColorRepository.deleteColor(id);
    return new Response("", {
      status: 301,
      headers: new Headers({ "Location": "/colors/" }),
    });
  },
};
*/
