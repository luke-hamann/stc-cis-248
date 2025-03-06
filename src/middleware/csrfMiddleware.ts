import Context from "../models/controllerLayer/Context.ts";
import { Controller2 } from "../controllers/_Controller2.ts";

export class CsrfMiddleware extends Controller2 {
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
