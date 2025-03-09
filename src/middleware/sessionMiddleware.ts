import Context from "../_framework/Context.ts";
import Controller from "../_framework/Controller.ts";

export default class SessionMiddleware extends Controller {
  constructor() {
    super();
    this.routes = [
      { method: "GET", pattern: ".*", action: this.handler },
      { method: "POST", pattern: ".*", action: this.handler },
    ];
  }

  public handler(context: Context) {
    context.response.headers.set("Set-Cookie", "session=joe; Path=/");
  }
}
