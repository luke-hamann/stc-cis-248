import Context from "../models/controllerLayer/Context.ts";
import Controller from "../models/controllerLayer/Controller.ts";
import { NotFoundResponse } from "./_utilities.ts";

const scheduleController = new Controller();
export default scheduleController;

scheduleController.register(
  "GET",
  "/",
  (_request: Request, _match: string[], _context: Context) => {
    return NotFoundResponse();
  },
);
