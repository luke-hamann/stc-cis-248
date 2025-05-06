import Context from "../_framework/Context.ts";
import Controller from "../_framework/Controller.ts";
import ResponseWrapper from "../_framework/ResponseWrapper.ts";
import ErrorViewModel from "../models/viewModels/_shared/ErrorViewModel.ts";

/** Middleware for enforcing anti request forgery */
export default class CsrfMiddleware extends Controller {
  /** Constructs the middleware */
  constructor() {
    super();
    this.routes = [
      { method: "POST", pattern: ".*", action: this.checkCsrfToken },
    ];
  }

  /** Ensures that requests include the correct anti request forgery token
   * @param context The application context
   * @returns A 403 Forbidden response wrapper if the request appears forged, void otherwise
   */
  public async checkCsrfToken(
    context: Context,
  ): Promise<ResponseWrapper | void> {
    const formData = await context.request.clone().formData();
    const submitted_csrf_token = formData.get("csrf_token") as string ?? "";

    if (submitted_csrf_token != context.csrf_token) {
      const model = new ErrorViewModel(
        "403 Forbidden",
        "Your session expired. Please refresh the page.",
        false,
      );

      return this.ErrorResponse(
        context,
        403,
        "./views/_shared/error.html",
        model,
      );
    }
  }
}
