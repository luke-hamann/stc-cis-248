import Context from "./Context.ts";
import { HTTPMethod } from "./HTTPMethod.ts";
import ResponseWrapper from "./ResponseWrapper.ts";
import nunjucks from "npm:nunjucks";

export default class Controller {
  protected routes: {
    method: HTTPMethod;
    pattern: string;
    action: (
      context: Context,
    ) => void | ResponseWrapper | Promise<void | ResponseWrapper>;
  }[] = [];

  public async execute(context: Context): Promise<ResponseWrapper | void> {
    for (const route of this.routes) {
      const regex = new RegExp(`^${route.pattern}$`, "g");

      if (context.request.method != route.method) continue;

      const url = new URL(context.request.url);
      const match = url.pathname.matchAll(regex).toArray()[0];
      if (!match) continue;

      context.match = match;
      return await route.action.call(this, context);
    }
  }

  /**
   * Return an HTML response wrapper
   * @param context The current application context
   * @param view The path to the view file to render
   * @param model The view model
   * @returns The response wrapper object
   */
  protected HTMLResponse(
    context: Context,
    view: string,
    model: unknown,
  ): ResponseWrapper {
    context.response.body = nunjucks.render(view, { model });
    context.response.headers.set("Content-Type", "text/html");
    return context.response;
  }

  /**
   * Return a response wrapper for a redirect
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

  /**
   * Return a response wrapper for a 404 not found page
   * @param context The current application context
   * @returns The response wrapper object
   */
  protected NotFoundResponse(context: Context): ResponseWrapper {
    context.response.body = nunjucks.render("./views/_shared/404.html");
    context.response.status = 404;
    context.response.headers.set("Content-Type", "text/html");
    return context.response;
  }

  /**
   * Return a response wrapper for an attachment download
   * @param context The current application context
   * @param contentType The MIME type of the download
   * @param fileName The file name of the download
   * @param fileContent The file content of the download
   * @returns
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
