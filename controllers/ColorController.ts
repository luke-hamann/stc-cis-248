import Color from "../models/entities/Color.ts";
import ColorRepository from "../models/repositories/ColorRepository.ts";
import ColorEditViewModel from "../models/viewModels/ColorEditViewModel.ts";
import ColorListViewModel from "../models/viewModels/ColorsViewModel.ts";
import DeleteViewModel from "../models/viewModels/DeleteViewModel.ts";
import { HTMLResponse, RedirectResponse } from "./_utilities.ts";

export default async function colorController(
  request: Request,
): Promise<Response | void> {
  const path = new URL(request.url).pathname;
  let match = [];

  // Color list page
  if (request.method == "GET" && path == "/colors/") {
    const colors = await ColorRepository.listColors();
    const model = new ColorListViewModel(colors);
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
