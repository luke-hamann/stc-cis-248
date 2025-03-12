import Context from "../_framework/Context.ts";
import ShiftContext from "../models/entities/ShiftContext.ts";
import ShiftContextRepository from "../models/repositories/ShiftContextRepository.ts";
import DeleteViewModel from "../models/viewModels/DeleteViewModel.ts";
import ShiftContextEditViewModel from "../models/viewModels/ShiftContextEditViewModel.ts";
import ShiftContextsViewModel from "../models/viewModels/ShiftContextsViewModel.ts";
import Controller from "../_framework/Controller.ts";

export default class ShiftContextController extends Controller {
  private shiftContextRepository: ShiftContextRepository;

  constructor(shiftContextRepository: ShiftContextRepository) {
    super();
    this.shiftContextRepository = shiftContextRepository;
    this.routes = [
      { method: "GET", pattern: "/contexts/", action: this.list },
      { method: "GET", pattern: "/context/add/", action: this.addGet },
      { method: "POST", pattern: "/context/add/", action: this.addPost },
      { method: "GET", pattern: "/context/(\\d+)/", action: this.editGet },
      { method: "POST", pattern: "/context/(\\d+)/", action: this.editPost },
      {
        method: "GET",
        pattern: "/context/(\\d+)/delete/",
        action: this.deleteGet,
      },
      {
        method: "POST",
        pattern: "/context/(\\d+)/delete/",
        action: this.deletePost,
      },
    ];
  }

  /**
   * Shift context list
   */
  public async list(context: Context) {
    const shiftContexts = await this.shiftContextRepository.list();
    const model = new ShiftContextsViewModel(shiftContexts);
    return this.HTMLResponse(context, "./views/shiftContext/list.html", model);
  }

  /**
   * Shift context add GET
   */
  public addGet(context: Context) {
    const model = new ShiftContextEditViewModel(
      false,
      [],
      context.csrf_token,
      ShiftContext.empty(),
    );
    return this.HTMLResponse(context, "./views/shiftContext/edit.html", model);
  }

  /**
   * Shift context add POST
   */
  public async addPost(context: Context) {
    const model = ShiftContextEditViewModel.fromFormData(
      await context.request.formData(),
    );

    model.errors = await this.shiftContextRepository.validate(
      model.shiftContext,
    );
    if (!model.isValid()) {
      model.csrf_token = context.csrf_token;
      return this.HTMLResponse(
        context,
        "./views/shiftContext/edit.html",
        model,
      );
    }

    await this.shiftContextRepository.add(model.shiftContext);
    return this.RedirectResponse(context, "/contexts/");
  }

  /**
   * Shift context edit GET
   */
  public async editGet(context: Context) {
    const id = parseInt(context.match[1]);
    if (isNaN(id)) return;

    const shiftContext = await this.shiftContextRepository.get(id);
    if (shiftContext == null) return this.NotFoundResponse(context);

    const model = new ShiftContextEditViewModel(
      true,
      [],
      context.csrf_token,
      shiftContext,
    );
    return this.HTMLResponse(context, "./views/shiftContext/edit.html", model);
  }

  /**
   * Shift context edit POST
   */
  public async editPost(context: Context) {
    const model = await ShiftContextEditViewModel.fromRequest(context.request);

    model.errors = await this.shiftContextRepository.validate(
      model.shiftContext,
    );
    if (!model.isValid()) {
      model.isEdit = true;
      model.csrf_token = context.csrf_token;
      return this.HTMLResponse(
        context,
        "./views/shiftContext/edit.html",
        model,
      );
    }

    await this.shiftContextRepository.update(model.shiftContext);
    return this.RedirectResponse(context, "/contexts/");
  }

  /**
   * Shift context delete GET
   */
  public async deleteGet(context: Context) {
    const id = parseInt(context.match[1]);
    if (isNaN(id)) return this.NotFoundResponse(context);

    const shiftContext = await this.shiftContextRepository.get(id);
    if (shiftContext == null) return this.NotFoundResponse(context);

    const model = new DeleteViewModel(
      shiftContext.name,
      `/context/${id}/delete/`,
      "/contexts/",
      context.csrf_token,
    );
    return this.HTMLResponse(context, "./views/_shared/delete.html", model);
  }

  /**
   * Shift context delete POST
   */
  public async deletePost(context: Context) {
    const id = parseInt(context.match[1]);
    if (isNaN(id)) {
      return this.NotFoundResponse(context);
    }

    const shiftContext = await this.shiftContextRepository.get(id);
    if (shiftContext == null) {
      return this.NotFoundResponse(context);
    }

    await this.shiftContextRepository.delete(id);
    return this.RedirectResponse(context, "/contexts/");
  }
}
