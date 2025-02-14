import routes from "./routes.json" with { type: "json" };
import colorController from "./controllers/ColorController.ts";

export default { fetch };

const controllers: any = {
  colorController
};

async function fetch(request: Request): Promise<Response> {
  const kv = await Deno.openKv();

  console.log(request);

  for (const route of routes) {
    if (request.method != route.method) continue;
    
    const url = new URL(request.url);
    const match = url.pathname.match(route.pattern);
    if (match == null) continue;

    console.log(route);

    const controller = controllers[route.controller];
    const action = controller[route.action];

    return await action(request, url, match);
  }

  return new Response();
}
