import colorController from "./controllers/ColorController.ts";
import { shiftContextController } from "./controllers/ShiftContextController.ts";
import staticFilesMiddleware from "./middleware/staticFilesMiddleware.ts";

export default { fetch };

const controllers = [
  colorController
];

async function fetch(request: Request): Promise<Response> {


  // Controllers
  for (const controller of controllers) {
    const result = await controller.execute(request, context);
    if (result) return result;
  }

  // 404 Page
  return new Response("404 Not Found", { status: 404 });
}
