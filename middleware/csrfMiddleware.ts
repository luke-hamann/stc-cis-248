import Context from "../models/controllerLayer/Context.ts";
import Controller from "../models/controllerLayer/Controller.ts";

const csrfMiddleware = new Controller();
export default csrfMiddleware;

csrfMiddleware.register(
  "GET",
  ".*",
  (context: Context) => {
    context.csrf_token = "joe";
  },
);

csrfMiddleware.register(
  "POST",
  ".*",
  async (context: Context) => {
    const formData = await context.request.clone().formData();
    context.csrf_token = formData.get("csrf_token") as string ?? "";

    if (context.csrf_token != "joe") {
      context.response.status = 403;
      context.response.body = "403 Forbidden";
      context.response.headers.set("Content-Type", "text/plain");
      return context.response;
    }
  },
);
