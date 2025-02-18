import Context from "./models//controllerLayer/Context.ts";
import colorController from "./controllers/ColorController.ts";
import csrfMiddleware from "./middleware/csrfMiddleware.ts";
import staticFilesMiddleware from "./middleware/staticFilesMiddleware.ts";
import shiftContextController from "./controllers/ShiftContextController.ts";
import { NotFoundResponse } from "./controllers/_utilities.ts";

export default { fetch };

const controllers = [
  csrfMiddleware,
  staticFilesMiddleware,
  colorController,
  shiftContextController,
];

async function fetch(request: Request): Promise<Response> {
  let context = new Context();

  // Controllers
  for (const controller of controllers) {
    const result = await controller.execute(request, context);

    if (result instanceof Response) {
      return result;
    } else if (result instanceof Context) {
      context = result;
    }
  }

  // 404 Page
  return NotFoundResponse();
}
