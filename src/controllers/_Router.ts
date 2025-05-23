import Context from "../_framework/Context.ts";
import Controller from "../_framework/Controller.ts";
import ResponseWrapper from "../_framework/ResponseWrapper.ts";
import ErrorViewModel from "../models/viewModels/_shared/ErrorViewModel.ts";

/** A class for routing requests through an array of controllers
 *
 * Note:
 * Controllers are executed in the order they are provided.
 * If a controller does not produce a response, the pipeline continues through the next controller.
 * As such, the controllers function as middleware.
 */
export default class Router extends Controller {
  /** The controllers */
  private _controllers: Controller[];

  /** Sets the Content Security Policy header of a response
   *
   * Prevents [clickjacking](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/frame-ancestors).
   *
   * @param response The original response
   * @returns The new response
   */
  private _setContentSecurityPolicy(
    response: ResponseWrapper,
  ): ResponseWrapper {
    response.headers.set(
      "Content-Security-Policy",
      "frame-ancestors 'none';",
    );
    return response;
  }

  /** Constructs the router given an array of controllers
   * @param controllers
   */
  constructor(
    controllers: Controller[],
  ) {
    super();
    this._controllers = controllers;
  }

  /** Routes a request through the controllers to deliver a response
   *
   * * Returns a 500 Internal Server Error response if a controller throws an exception
   * * Returns a 404 Not Found response if no controller returns a response
   *
   * @param request An HTTP request
   * @returns An HTTP response
   */
  public async route(request: Request): Promise<Response> {
    let response: ResponseWrapper | void;
    const context = new Context(request, new ResponseWrapper());
    context.initializeFormData();

    // Controllers
    for (const controller of this._controllers) {
      try {
        response = await controller.execute(context);
      } catch (error: unknown) {
        const message = (error as Error).message + "\n\n" +
          (error as Error).stack;

        const isProduction = Deno.env.get("ENVIRONMENT") == "production";
        const model = new ErrorViewModel(
          "500 Internal Server Error",
          isProduction ? "Something went wrong on our end." : message,
          !isProduction,
        );

        response = this.ErrorResponse(
          context,
          500,
          "./views/_shared/error.html",
          model,
        );
      }

      if (response) {
        this._setContentSecurityPolicy(response);
        return response.toResponse();
      }
    }

    response = this.NotFoundResponse(context);
    this._setContentSecurityPolicy(response);
    return response.toResponse();
  }
}
