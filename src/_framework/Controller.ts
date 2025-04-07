import Context from "./Context.ts";
import ErrorViewModel from "../models/viewModels/_shared/ErrorViewModel.ts";
import ResponseWrapper from "./ResponseWrapper.ts";
import nunjucks from "npm:nunjucks";
import ViewModel from "../models/viewModels/_shared/_ViewModel.ts";
import Route from "./Route.ts";
import MapWrapper from "./MapWrapper.ts";

/** Controls routing to action methods based on HTTP method and url patterns */
export default class Controller {
  /** Maps HTTP methods and URL patterns to action methods */
  protected routes: Route[] = [];

  /** Executes the controller
   *
   * Interates over each route and calls matching action methods.
   * If an action method returns a response wrapper, that response wrapper is returned.
   * If an action method returns void, the next route and action method are checked.
   *
   * @param context The application context
   * @returns A promise of a response wrapper or void
   */
  public async execute(context: Context): Promise<ResponseWrapper | void> {
    for (const route of this.routes) {
      const regex = new RegExp(`^${route.pattern}$`, "g");

      if (context.request.method != route.method) continue;

      const url = new URL(context.request.url);
      const match = url.pathname.matchAll(regex).toArray()[0];
      if (!match) continue;

      context.match = match;

      if (route.mappings) {
        context.routeData = MapWrapper.fromRouteData(
          context.match,
          route.mappings,
        );
      }

      return await route.action.call(this, context);
    }
  }

  /** Returns an HTML response wrapper
   * @param context The current application context
   * @param view The path to the view file to render
   * @param model The view model
   * @returns The response wrapper object
   */
  protected HTMLResponse(
    context: Context,
    view: string,
    model: ViewModel,
  ): ResponseWrapper {
    model.csrf_token = context.csrf_token;

    context.response.body = nunjucks.render(view, { model });
    context.response.headers.set("Content-Type", "text/html");
    return context.response;
  }

  /** Returns a response wrapper for a redirect
   * @param context The current application context
   * @param url The URL to redirect to
   * @returns The response wrapper object
   */
  protected RedirectResponse(context: Context, url: string): ResponseWrapper {
    context.response.body = "";
    context.response.status = 302;
    context.response.headers.set("Location", url);
    return context.response;
  }

  /** Returns an response wrapper for a generic error
   * @param context The application context
   * @param status The status code
   * @param view The view to render
   * @param model The view model to render in the view
   * @returns A response wrapper for the error
   */
  protected ErrorResponse(
    context: Context,
    status: number,
    view: string,
    model: ViewModel,
  ) {
    model.csrf_token = context.csrf_token;

    context.response.status = status;
    context.response = this.HTMLResponse(context, view, model);
    return context.response;
  }

  /** Returns a response wrapper for a 404 not found page
   * @param context The current application context
   * @returns The response wrapper object
   */
  protected NotFoundResponse(context: Context): ResponseWrapper {
    return this.ErrorResponse(
      context,
      404,
      "./views/_shared/error.html",
      new ErrorViewModel(
        "404 Not Found",
        "The requested page could not be found.",
        false,
      ),
    );
  }

  /** Returns a response wrapper for an attachment download
   * @param context The current application context
   * @param contentType The MIME type of the download
   * @param fileName The file name of the download
   * @param fileContent The file content of the download
   * @returns The response wrapper
   */
  protected AttachmentResponse(
    context: Context,
    contentType: string,
    fileName: string,
    fileContent: string | ArrayBuffer,
  ): ResponseWrapper {
    context.response.headers.set("Content-Type", contentType);
    context.response.headers.set(
      "Content-Disposition",
      `attachment; filename="${fileName}"`,
    );
    context.response.body = fileContent;
    return context.response;
  }
}
