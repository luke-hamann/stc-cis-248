import Context from "../models/controllerLayer/Context.ts";
import Controller from "../models/controllerLayer/Controller.ts";

export const csrfMiddleware = new Controller();

csrfMiddleware.register(
  "GET",
  ".*",
  async (_request: Request, _match: string[], context: Context) => {
    context.csrf_token = "joe";
    return await Promise.resolve(context);
  },
);

csrfMiddleware.register(
  "POST",
  ".*",
  async (_request: Request, _match: string[], _context: Context) => {
    const formData = await _request.formData();
    const csrf_token = formData.get("csrf_token") ?? "";

    if (csrf_token != "joe") {
      return new Response("403 Forbidden", {
        status: 403,
        headers: new Headers({ "Content-Type": "text/plain" }),
      });
    }
  },
);
