import Context from "../_framework/Context.ts";
import ShiftContext from "../models/entities/ShiftContext.ts";
import ShiftContextRepository from "../models/repositories/ShiftContextRepository.ts";
import DeleteViewModel from "../models/viewModels/_shared/DeleteViewModel.ts";
import ShiftContextEditViewModel from "../models/viewModels/shiftContext/ShiftContextEditViewModel.ts";
import ShiftContextsViewModel from "../models/viewModels/shiftContext/ShiftContextsViewModel.ts";
import Controller from "../_framework/Controller.ts";
import ResponseWrapper from "../_framework/ResponseWrapper.ts";

/** Controls the shift context pages */
export default class ShiftContextController extends Controller {
  /** The shift context repository */
  private shiftContextRepository: ShiftContextRepository;

  /**
   * Constructs the shift context controller using a shift context repository
   * @param shiftContextRepository The shift context repository
   */
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
   * Gets the shift context list page
   * @param context The application context
   * @returns The response
   */
  public async list(context: Context): Promise<ResponseWrapper> {
    const shiftContexts = await this.shiftContextRepository.list();
    const model = new ShiftContextsViewModel(shiftContexts);
    return this.HTMLResponse(context, "./views/shiftContext/list.html", model);
  }

  /**
   * Gets the shift context add form
   * @param context The application context
   * @returns The response
   */
  public addGet(context: Context): ResponseWrapper {
    const model = new ShiftContextEditViewModel(
      false,
      [],
      ShiftContext.empty(),
    );
    return this.HTMLResponse(context, "./views/shiftContext/edit.html", model);
  }

  /**
   * Accepts requests to add a shift context
   * @param context The application context
   * @returns The response
   */
  public async addPost(context: Context): Promise<ResponseWrapper> {
    const model = await ShiftContextEditViewModel.fromRequest(context.request);

    model.errors = await this.shiftContextRepository.validate(
      model.shiftContext,
    );
    if (!model.isValid()) {
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
   * Gets the shift context edit form
   * @param context The application context
   * @returns The response
   */
  public async editGet(context: Context): Promise<ResponseWrapper> {
    const id = parseInt(context.match[1]);
    if (isNaN(id)) return this.NotFoundResponse(context);

    const shiftContext = await this.shiftContextRepository.get(id);
    if (shiftContext == null) return this.NotFoundResponse(context);

    const model = new ShiftContextEditViewModel(
      true,
      [],
      shiftContext,
    );
    return this.HTMLResponse(context, "./views/shiftContext/edit.html", model);
  }

  /**
   * Accepts requests to edit a shift context
   * @param context The application context
   * @returns The response
   */
  public async editPost(context: Context): Promise<ResponseWrapper> {
    const model = await ShiftContextEditViewModel.fromRequest(context.request);

    model.errors = await this.shiftContextRepository.validate(
      model.shiftContext,
    );
    if (!model.isValid()) {
      model.isEdit = true;
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
   * Gets the shift context delete confirmation form
   * @param context The application context
   * @returns The response
   */
  public async deleteGet(context: Context): Promise<ResponseWrapper> {
    const id = parseInt(context.match[1]);
    if (isNaN(id)) return this.NotFoundResponse(context);

    const shiftContext = await this.shiftContextRepository.get(id);
    if (shiftContext == null) return this.NotFoundResponse(context);

    const model = new DeleteViewModel(
      shiftContext.name,
      `/context/${id}/delete/`,
      "/contexts/",
      [
        "Time slots and notes associated with this shift context will be deleted.",
      ],
    );
    return this.HTMLResponse(context, "./views/_shared/delete.html", model);
  }

  /**
   * Accepts requests to delete a shift context
   * @param context The application context
   * @returns The response
   */
  public async deletePost(context: Context): Promise<ResponseWrapper> {
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
