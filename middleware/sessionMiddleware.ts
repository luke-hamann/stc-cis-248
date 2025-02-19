import Context from "../models/controllerLayer/Context.ts";
import Controller from "../models/controllerLayer/Controller.ts";

const sessionMiddleware = new Controller();
export default sessionMiddleware;

const handler = (context: Context) => {
  context.response.headers.set("Set-Cookie", "session=joe; Path=/");
};

sessionMiddleware.register("GET", ".*", handler);
sessionMiddleware.register("POST", ".*", handler);
