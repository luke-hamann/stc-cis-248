import Context from "../models/controllerLayer/Context.ts";
import ColorEditViewModel from "../models/viewModels/ColorEditViewModel.ts";
import ColorsViewModel from "../models/viewModels/ColorsViewModel.ts";
import DeleteViewModel from "../models/viewModels/DeleteViewModel.ts";
import { Controller2 } from "./_Controller2.ts";

/** */
export class ColorController extends Controller2 {
  private colorRepository: IColorRepository;

  constructor(colorRepository: IColorRepository) {
    super();
    this.colorRepository = colorRepository;
    this.routes = [
      { method: "GET", pattern: "/colors/", action: this.listColors },
      { method: "GET", pattern: "/colors/add/", action: this.addColorGet },
      { method: "POST", pattern: "/colors/add/", action: this.addColorPost },
      { method: "GET", pattern: "/color/(\\d+)/", action: this.editColorGet },
      { method: "POST", pattern: "/color/(\\d+)/", action: this.editColorPost },
      {
        method: "GET",
        pattern: "/color/(\\d+)/delete/",
        action: this.deleteColorGet,
      },
      {
        method: "POST",
        pattern: "/color/(\\d+)/delete/",
        action: this.deleteColorPost,
      },
    ];
  }

  /**
   * @param context
   * @returns
   */
  public async listColors(context: Context) {
    const colors = await this.colorRepository.getColors();
    const model = new ColorsViewModel(colors, context.csrf_token);
    return this.HTMLResponse(context, "./views/color/list.html", model);
  }

  /**
   * @param context
   * @returns
   */
  public addColorGet(context: Context) {
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
  public async addColorPost(context: Context) {
    const model = await ColorEditViewModel.fromRequest(context.request);

    model.errors = await this.colorRepository.validateColor(model.color);
    if (!model.isValid()) {
      model.csrf_token = context.csrf_token;
      return this.HTMLResponse(context, "./views/color/edit.html", model);
    }

    await this.colorRepository.addColor(model.color);
    return this.RedirectResponse(context, "/colors/");
  }

  /**
   * @param context
   * @returns
   */
  public async editColorGet(context: Context) {
    const id = parseInt(context.match[1]);
    if (isNaN(id)) {
      return this.NotFoundResponse(context);
    }

    const color = await this.colorRepository.getColor(id);
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
  public async editColorPost(context: Context) {
    const model = ColorEditViewModel.fromFormData(
      await context.request.formData(),
    );
    model.color.id = parseInt(context.match[1]);

    model.errors = await this.colorRepository.validateColor(model.color);
    if (!model.isValid()) {
      model.isEdit = true;
      model.csrf_token = context.csrf_token;
      return this.HTMLResponse(context, "./views/color/edit.html", model);
    }

    await this.colorRepository.updateColor(model.color);
    return this.RedirectResponse(context, "/colors/");
  }

  /**
   * @param context
   * @returns
   */
  public async deleteColorGet(context: Context) {
    const id = parseInt(context.match[1]);
    if (isNaN(id)) {
      return this.NotFoundResponse(context);
    }

    const color = await this.colorRepository.getColor(id);
    if (color == null) {
      return this.NotFoundResponse(context);
    }

    const model = new DeleteViewModel(
      color.name,
      `/color/${id}/delete/`,
      "/colors/",
      context.csrf_token,
    );

    return this.HTMLResponse(context, "./views/shared/delete.html", model);
  }

  /**
   * @param context
   * @returns
   */
  public async deleteColorPost(context: Context) {
    const id = parseInt(context.match[1]);
    if (isNaN(id)) {
      return this.NotFoundResponse(context);
    }

    const color = await this.colorRepository.getColor(id);
    if (color == null) {
      return this.NotFoundResponse(context);
    }

    await this.colorRepository.deleteColor(id);
    return this.RedirectResponse(context, "/colors/");
  }
}
