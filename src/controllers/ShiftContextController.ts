import Context from "../_framework/Context.ts";
import ShiftContext from "../models/entities/ShiftContext.ts";
import { IShiftContextRepository } from "../models/repositories/ShiftContextRepository.ts";
import DeleteViewModel from "../models/viewModels/_shared/DeleteViewModel.ts";
import ShiftContextEditViewModel from "../models/viewModels/shiftContext/ShiftContextEditViewModel.ts";
import ShiftContextsViewModel from "../models/viewModels/shiftContext/ShiftContextsViewModel.ts";
import Controller from "../_framework/Controller.ts";
import ResponseWrapper from "../_framework/ResponseWrapper.ts";
import ShiftContextReorderViewModel from "../models/viewModels/shiftContext/ShiftContextReorderViewModel.ts";

/** Controls the shift context pages */
export default class ShiftContextController extends Controller {
  /** The shift context repository */
  private _shiftContexts: IShiftContextRepository;

  /** Constructs the shift context controller using a shift context repository
   * @param shiftContexts The shift context repository
   */
  constructor(shiftContexts: IShiftContextRepository) {
    super();
    this._shiftContexts = shiftContexts;
    this.routes = [
      { method: "GET", pattern: "/contexts/", action: this.list },
      {
        method: "POST",
        pattern: "/contexts/",
        action: this.changeSortPriority,
      },
      { method: "GET", pattern: "/context/add/", action: this.addGet },
      { method: "POST", pattern: "/context/add/", action: this.addPost },
      {
        method: "GET",
        pattern: "/context/(\\d+)/",
        mappings: [[1, "id"]],
        action: this.editGet,
      },
      {
        method: "POST",
        pattern: "/context/(\\d+)/",
        mappings: [[1, "id"]],
        action: this.editPost,
      },
      {
        method: "GET",
        pattern: "/context/(\\d+)/delete/",
        mappings: [[1, "id"]],
        action: this.deleteGet,
      },
      {
        method: "POST",
        pattern: "/context/(\\d+)/delete/",
        mappings: [[1, "id"]],
        action: this.deletePost,
      },
    ];
  }

  /** Gets the shift context list page
   * @param context The application context
   * @returns The response
   */
  public async list(context: Context): Promise<ResponseWrapper> {
    const shiftContexts = await this._shiftContexts.list();
    const model = new ShiftContextsViewModel(shiftContexts);
    return this.HTMLResponse(context, "./views/shiftContext/list.html", model);
  }

  /** Changes the sort priority of a given shift context
   * @param context The application context
   * @returns A shift context list partial view response with the updated ordering
   */
  public async changeSortPriority(context: Context): Promise<ResponseWrapper> {
    const model = ShiftContextReorderViewModel.fromFormData(context.formData);

    if (model.isValid()) {
      await this._shiftContexts.changeSortPriority(
        model.shiftContextId,
        model.delta,
      );
    }

    if (context.request.headers.has("X-Refresh")) {
      return this.HTMLResponse(
        context,
        "./views/shiftContext/listPartial.html",
        new ShiftContextsViewModel(await this._shiftContexts.list()),
      );
    }

    return this.RedirectResponse(context, "/contexts/");
  }

  /** Gets the shift context add form
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

  /** Accepts a request to add a shift context
   * @param context The application context
   * @returns The response
   */
  public async addPost(context: Context): Promise<ResponseWrapper> {
    const model = await ShiftContextEditViewModel.fromRequest(context.request);

    model.errors = await this._shiftContexts.validate(
      model.shiftContext,
    );
    if (!model.isValid()) {
      return this.HTMLResponse(
        context,
        "./views/shiftContext/edit.html",
        model,
      );
    }

    await this._shiftContexts.add(model.shiftContext);
    return this.RedirectResponse(context, "/contexts/");
  }

  /** Gets the shift context edit form
   * @param context The application context
   * @returns The response
   */
  public async editGet(context: Context): Promise<ResponseWrapper> {
    const id = context.routeData.getInt("id");
    if (id == null) {
      return this.NotFoundResponse(context);
    }

    const shiftContext = await this._shiftContexts.get(id);
    if (shiftContext == null) return this.NotFoundResponse(context);

    const model = new ShiftContextEditViewModel(
      true,
      [],
      shiftContext,
    );
    return this.HTMLResponse(context, "./views/shiftContext/edit.html", model);
  }

  /** Accepts a request to edit a shift context
   * @param context The application context
   * @returns The response
   */
  public async editPost(context: Context): Promise<ResponseWrapper> {
    const model = await ShiftContextEditViewModel.fromRequest(context.request);

    model.errors = await this._shiftContexts.validate(
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

    await this._shiftContexts.update(model.shiftContext);
    return this.RedirectResponse(context, "/contexts/");
  }

  /** Gets the shift context delete confirmation form
   * @param context The application context
   * @returns The response
   */
  public async deleteGet(context: Context): Promise<ResponseWrapper> {
    const id = context.routeData.getInt("id");
    if (id == null) {
      return this.NotFoundResponse(context);
    }

    const shiftContext = await this._shiftContexts.get(id);
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

  /** Accepts a request to delete a shift context
   * @param context The application context
   * @returns The response
   */
  public async deletePost(context: Context): Promise<ResponseWrapper> {
    const id = context.routeData.getInt("id");
    if (id == null) {
      return this.NotFoundResponse(context);
    }

    const shiftContext = await this._shiftContexts.get(id);
    if (shiftContext == null) {
      return this.NotFoundResponse(context);
    }

    await this._shiftContexts.delete(id);
    return this.RedirectResponse(context, "/contexts/");
  }
}
