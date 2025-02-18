import Context from "../models/controllerLayer/Context.ts";
import Controller from "../models/controllerLayer/Controller.ts";

const csrfMiddleware = new Controller();
export default csrfMiddleware;

csrfMiddleware.register(
  "GET",
  ".*",
  (_request: Request, _match: string[], context: Context) => {
    context.csrf_token = "joe";
    return context;
  },
);

csrfMiddleware.register(
  "POST",
  ".*",
  async (request: Request, _m: string[], _c: Context) => {
    const formData = await request.clone().formData();
    const csrf_token = formData.get("csrf_token") as string ?? "";

    if (csrf_token != "joe") {
      return new Response("403 Forbidden", {
        status: 403,
        headers: new Headers({ "Content-Type": "text/plain" }),
      });
    }
  },
);
