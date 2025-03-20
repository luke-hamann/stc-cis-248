import Context from "../_framework/Context.ts";
import Controller from "../_framework/Controller.ts";
import ResponseWrapper from "../_framework/ResponseWrapper.ts";
import ErrorViewModel from "../models/viewModels/_shared/ErrorViewModel.ts";

export default class Router extends Controller {
  private controllers: Controller[];

  constructor(controllers: Controller[]) {
    super();
    this.controllers = controllers;
  }

  public async route(request: Request): Promise<Response> {
    let response: ResponseWrapper | void;
    const context = new Context(request, new ResponseWrapper());

    // Controllers
    for (const controller of this.controllers) {
      try {
        response = await controller.execute(context);
      } catch (error: unknown) {
        const message = (error as Error).message + "\n\n" +
          (error as Error).stack;

        const model = new ErrorViewModel(
          "500 Internal Server Error",
          message,
          true,
          context.csrf_token,
        );

        response = this.ErrorResponse(
          context,
          500,
          "./views/_shared/error.html",
          model,
        );
      }

      if (response) {
        return response.toResponse();
      }
    }

    return this.NotFoundResponse(context).toResponse();
  }
}
