import Context from "../models/controllerLayer/Context.ts";
import nunjucks from "npm:nunjucks";

nunjucks.configure(".", { noCache: true });

/**
 * Return an HTML response wrapper
 * @param context The current application context
 * @param view The path to the view file to render
 * @param model The view model
 * @returns The response wrapper object
 */
export function HTMLResponse(context: Context, view: string, model: unknown) {
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
export function RedirectResponse(context: Context, url: string) {
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
export function NotFoundResponse(context: Context) {
  context.response.body = nunjucks.render("./views/shared/404.html");
  context.response.status = 404;
  context.response.headers.set("Content-Type", "text/html");
  return context.response;
}
