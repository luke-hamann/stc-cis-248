import ColorRepository from "../models/repositories/ColorRepository.ts";
import ColorEditViewModel from "../models/viewModels/ColorEditViewModel.ts";
import ColorListViewModel from "../models/viewModels/ColorsViewModel.ts";
import nunjucks from "npm:nunjucks";

nunjucks.configure('.', { noCache: true });

export default {
  listColors: async () => {
    const colors = await ColorRepository.listColors();
    const model = new ColorListViewModel(colors);
    const view = nunjucks.render("./views/color/list.html", { model });
    const options = { headers: new Headers({ "Content-Type": "text/html" }) };
    return new Response(view, options);
  },

  addColor: async () => {
    return new Response("adding a color...");
  },

  editColor: async (_request: Request, _url: URL, match: string[]) => {
    const id = Number(match[1]);
    const color = await ColorRepository.getColor(id);
    console.log(color);
    if (color == null) return new Response();
    const model = new ColorEditViewModel(color);
    const view = nunjucks.render("./views/color/edit.html", { model });
    const options = { headers: new Headers({ "Content-Type": "text/html" }) };
    return new Response(view, options);
  }
};
