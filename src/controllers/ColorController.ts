import { IColorRepository } from "../models/repositories/ColorRepository.ts";
import Context from "../_framework/Context.ts";
import ColorEditViewModel from "../models/viewModels/color/ColorEditViewModel.ts";
import ColorsViewModel from "../models/viewModels/color/ColorsViewModel.ts";
import DeleteViewModel from "../models/viewModels/_shared/DeleteViewModel.ts";
import Controller from "../_framework/Controller.ts";

/**
 * Controls the color pages of the application
 */
export default class ColorController extends Controller {
  /** The data store for color CRUD */
  private colorRepository: IColorRepository;

  /**
   * @param colorRepository
   */
  constructor(colorRepository: IColorRepository) {
    super();
    this.colorRepository = colorRepository;
    this.routes = [
      { method: "GET", pattern: "/colors/", action: this.list },
      { method: "GET", pattern: "/colors/add/", action: this.addGet },
      { method: "POST", pattern: "/colors/add/", action: this.addPost },
      { method: "GET", pattern: "/color/(\\d+)/", action: this.editGet },
      { method: "POST", pattern: "/color/(\\d+)/", action: this.editPost },
      {
        method: "GET",
        pattern: "/color/(\\d+)/delete/",
        action: this.deleteGet,
      },
      {
        method: "POST",
        pattern: "/color/(\\d+)/delete/",
        action: this.deletePost,
      },
    ];
  }

  /**
   * @param context
   * @returns
   */
  public async list(context: Context) {
    const colors = await this.colorRepository.list();
    const model = new ColorsViewModel(colors, context.csrf_token);
    return this.HTMLResponse(context, "./views/color/list.html", model);
  }

  /**
   * @param context
   * @returns
   */
  public addGet(context: Context) {
    return this.HTMLResponse(
      context,
      "./views/color/edit.html",
      ColorEditViewModel.empty(),
    );
  }

  /**
   * @param context
   * @returns
   */
  public async addPost(context: Context) {
    const model = await ColorEditViewModel.fromRequest(context.request);

    model.errors = await this.colorRepository.validate(model.color);
    if (!model.isValid()) {
      return this.HTMLResponse(context, "./views/color/edit.html", model);
    }

    await this.colorRepository.add(model.color);
    return this.RedirectResponse(context, "/colors/");
  }

  /**
   * @param context
   * @returns
   */
  public async editGet(context: Context) {
    const id = parseInt(context.match[1]);
    if (isNaN(id)) {
      return this.NotFoundResponse(context);
    }

    const color = await this.colorRepository.get(id);
    if (color == null) {
      return this.NotFoundResponse(context);
    }

    const model = new ColorEditViewModel(true, [], context.csrf_token, color);
    return this.HTMLResponse(context, "./views/color/edit.html", model);
  }

  /**
   * @param context
   * @returns
   */
  public async editPost(context: Context) {
    const model = await ColorEditViewModel.fromRequest(context.request);
    model.color.id = parseInt(context.match[1]);

    model.errors = await this.colorRepository.validate(model.color);
    if (!model.isValid()) {
      model.isEdit = true;
      model.csrf_token = context.csrf_token;
      return this.HTMLResponse(context, "./views/color/edit.html", model);
    }

    await this.colorRepository.update(model.color);
    return this.RedirectResponse(context, "/colors/");
  }

  /**
   * @param context
   * @returns
   */
  public async deleteGet(context: Context) {
    const id = parseInt(context.match[1]);
    if (isNaN(id)) {
      return this.NotFoundResponse(context);
    }

    const color = await this.colorRepository.get(id);
    if (color == null) {
      return this.NotFoundResponse(context);
    }

    const model = new DeleteViewModel(
      color.name,
      `/color/${id}/delete/`,
      "/colors/",
      [
        "Notes with this color will be marked colorless.",
      ],
    );

    return this.HTMLResponse(context, "./views/_shared/delete.html", model);
  }

  /**
   * @param context
   * @returns
   */
  public async deletePost(context: Context) {
    const id = parseInt(context.match[1]);
    if (isNaN(id)) {
      return this.NotFoundResponse(context);
    }

    const color = await this.colorRepository.get(id);
    if (color == null) {
      return this.NotFoundResponse(context);
    }

    await this.colorRepository.delete(id);
    return this.RedirectResponse(context, "/colors/");
  }
}
