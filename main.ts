import Context from "./models//controllerLayer/Context.ts";
import colorController from "./controllers/ColorController.ts";
import { csrfMiddleware } from "./middleware/csrfMiddleware.ts";
import staticFilesMiddleware from "./middleware/staticFilesMiddleware.ts";

export default { fetch };

const controllers = [
  // csrfMiddleware,
  staticFilesMiddleware,
  colorController,
];

async function fetch(request: Request): Promise<Response> {
  let context = new Context();
  context.csrf_token = "joe";

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
  return new Response("404 Not Found", { status: 404 });
}
