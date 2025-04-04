import { IColorRepository } from "../models/repositories/ColorRepository.ts";
import Context from "../_framework/Context.ts";
import ColorEditViewModel from "../models/viewModels/color/ColorEditViewModel.ts";
import ColorsViewModel from "../models/viewModels/color/ColorsViewModel.ts";
import DeleteViewModel from "../models/viewModels/_shared/DeleteViewModel.ts";
import Controller from "../_framework/Controller.ts";
import ResponseWrapper from "../_framework/ResponseWrapper.ts";

/**
 * Controls the color pages of the application
 */
export default class ColorController extends Controller {
  /** The data store for color CRUD */
  private _colorRepository: IColorRepository;

  /**
   * Constructs the color controller given the color repository
   *
   * @constructor
   */
  constructor(colorRepository: IColorRepository) {
    super();
    this._colorRepository = colorRepository;
    this.routes = [
      { method: "GET", pattern: "/colors/", action: this.list },
      { method: "GET", pattern: "/colors/add/", action: this.addGet },
      { method: "POST", pattern: "/colors/add/", action: this.addPost },
      {
        method: "GET",
        pattern: "/color/(\\d+)/",
        mappings: [[1, "id"]],
        action: this.editGet,
      },
      {
        method: "POST",
        pattern: "/color/(\\d+)/",
        mappings: [[1, "id"]],
        action: this.editPost,
      },
      {
        method: "GET",
        pattern: "/color/(\\d+)/delete/",
        mappings: [[1, "id"]],
        action: this.deleteGet,
      },
      {
        method: "POST",
        pattern: "/color/(\\d+)/delete/",
        mappings: [[1, "id"]],
        action: this.deletePost,
      },
    ];
  }

  /**
   * Gets the color list page
   * @param context The application context
   * @returns The response
   */
  public async list(context: Context): Promise<ResponseWrapper> {
    const colors = await this._colorRepository.list();
    const model = new ColorsViewModel(colors);
    return this.HTMLResponse(context, "./views/color/list.html", model);
  }

  /**
   * Gets the color add form
   * @param context The application context
   * @returns The response
   */
  public addGet(context: Context): ResponseWrapper {
    return this.HTMLResponse(
      context,
      "./views/color/edit.html",
      ColorEditViewModel.empty(),
    );
  }

  /**
   * Accepts requests to add a color
   * @param context The application context
   * @returns The response
   */
  public async addPost(context: Context): Promise<ResponseWrapper> {
    const model = await ColorEditViewModel.fromRequest(context.request);

    model.errors = await this._colorRepository.validate(model.color);
    if (!model.isValid()) {
      return this.HTMLResponse(context, "./views/color/edit.html", model);
    }

    await this._colorRepository.add(model.color);
    return this.RedirectResponse(context, "/colors/");
  }

  /**
   * Gets the color edit form
   * @param context The application context
   * @returns The response
   */
  public async editGet(context: Context): Promise<ResponseWrapper> {
    const id = parseInt(context.match[1]);
    if (isNaN(id)) {
      return this.NotFoundResponse(context);
    }

    const color = await this._colorRepository.get(id);
    if (color == null) {
      return this.NotFoundResponse(context);
    }

    const model = new ColorEditViewModel(true, [], color);
    return this.HTMLResponse(context, "./views/color/edit.html", model);
  }

  /**
   * Accepts a request to edit a color
   * @param context The application context
   * @returns The response
   */
  public async editPost(context: Context): Promise<ResponseWrapper> {
    const model = await ColorEditViewModel.fromRequest(context.request);
    model.color.id = parseInt(context.match[1]);

    model.errors = await this._colorRepository.validate(model.color);
    if (!model.isValid()) {
      model.isEdit = true;
      model.csrf_token = context.csrf_token;
      return this.HTMLResponse(context, "./views/color/edit.html", model);
    }

    await this._colorRepository.update(model.color);
    return this.RedirectResponse(context, "/colors/");
  }

  /**
   * Gets the delete color confirmation form
   *
   * @param context The application context
   * @returns The response
   */
  public async deleteGet(context: Context): Promise<ResponseWrapper> {
    const id = parseInt(context.match[1]);
    if (isNaN(id)) {
      return this.NotFoundResponse(context);
    }

    const color = await this._colorRepository.get(id);
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
   * Accepts a request to delete a color
   * @param context The application context
   * @returns The response
   */
  public async deletePost(context: Context): Promise<ResponseWrapper> {
    const id = parseInt(context.match[1]);
    if (isNaN(id)) {
      return this.NotFoundResponse(context);
    }

    const color = await this._colorRepository.get(id);
    if (color == null) {
      return this.NotFoundResponse(context);
    }

    await this._colorRepository.delete(id);
    return this.RedirectResponse(context, "/colors/");
  }
}
