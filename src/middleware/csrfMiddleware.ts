import Context from "../_framework/Context.ts";
import Controller from "../_framework/Controller.ts";

export default class CsrfMiddleware extends Controller {
  constructor() {
    super();
    this.routes = [
      { method: "GET", pattern: ".*", action: this.getHandler },
      { method: "POST", pattern: ".*", action: this.postHandler },
    ];
  }

  public getHandler(context: Context) {
    context.csrf_token = "joe";
  }

  public async postHandler(context: Context) {
    const formData = await context.request.clone().formData();
    context.csrf_token = formData.get("csrf_token") as string ?? "";

    if (context.csrf_token != "joe") {
      context.response.status = 403;
      context.response.body = "403 Forbidden";
      context.response.headers.set("Content-Type", "text/plain");
      return context.response;
    }
  }
}
