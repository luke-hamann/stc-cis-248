import Context from "../models/controllerLayer/Context.ts";
import Controller from "../models/controllerLayer/Controller.ts";

const staticFilesMiddleware = new Controller();

const STATIC_DIR = "./static";

staticFilesMiddleware.register(
  "GET",
  ".*",
  async (request: Request, _match: string[], _context: Context) => {
    const work = [STATIC_DIR];
    const files = [];
    while (work.length > 0) {
      const dir = work.pop() as string;
      for await (const item of Deno.readDir(dir)) {
        if (item.isFile) {
          files.push(`${dir}/${item.name}`);
        } else if (item.isDirectory) {
          work.push(`${dir}/${item.name}`);
        }
      }
    }

    const staticFile = `${STATIC_DIR}${new URL(request.url).pathname}`;

    if (!files.includes(staticFile)) return;

    const fileExtensions = new Map<string, string>();
    fileExtensions.set(".css", "text/css");
    fileExtensions.set(".js", "text/javascript");

    let contentType = "text/plain";
    for (const [extension, mimetype] of fileExtensions) {
      if (staticFile.endsWith(extension)) {
        contentType = mimetype;
        continue;
      }
    }

    return new Response(await Deno.readFile(staticFile), {
      headers: new Headers({ "Content-Type": contentType }),
    });
  },
);

export default staticFilesMiddleware;
