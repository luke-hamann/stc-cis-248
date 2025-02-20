import Context from "./models//controllerLayer/Context.ts";
import colorController from "./controllers/ColorController.ts";
import csrfMiddleware from "./middleware/csrfMiddleware.ts";
import staticFilesMiddleware from "./middleware/staticFilesMiddleware.ts";
import shiftContextController from "./controllers/ShiftContextController.ts";
import { NotFoundResponse } from "./controllers/_utilities.ts";
import ResponseWrapper from "./models/controllerLayer/ResponseWrapper.ts";
import sessionMiddleware from "./middleware/sessionMiddleware.ts";

export default { fetch };

const controllers = [
  sessionMiddleware,
  csrfMiddleware,
  staticFilesMiddleware,
  colorController,
  shiftContextController,
];

async function fetch(request: Request): Promise<Response> {
  const context = new Context(request, new ResponseWrapper());

  // Controllers
  for (const controller of controllers) {
    const response = await controller.execute(context);
    if (response) return response.toResponse();
  }

  // 404 Page
  return NotFoundResponse(context).toResponse();
}
