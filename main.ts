import colorController from "./controllers/ColorController.ts";
import staticFilesMiddleware from "./middleware/staticFilesMiddleware.ts";

export default { fetch };

const controllers = [
  staticFilesMiddleware,
  colorController,
];

async function fetch(request: Request): Promise<Response> {
  // Controllers
  for (const controller of controllers) {
    const result = await controller(request);
    if (result) return result;
  }

  // 404 Page
  return new Response("404 Not Found", { status: 404 });
}
