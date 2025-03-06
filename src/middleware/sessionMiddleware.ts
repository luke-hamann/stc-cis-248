import Context from "../models/controllerLayer/Context.ts";
import { Controller2 } from "../controllers/_Controller2.ts";

export class SessionMiddleware extends Controller2 {
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
