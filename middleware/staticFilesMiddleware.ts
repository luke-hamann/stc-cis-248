import Context from "../models/controllerLayer/Context.ts";
import Controller from "../models/controllerLayer/Controller.ts";

const staticFilesMiddleware = new Controller();

const STATIC_DIR = "./static";

staticFilesMiddleware.register(
  "GET",
  ".*",
  async (context: Context) => {
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

    const pathname = new URL(context.request.url).pathname;
    const staticFile = `${STATIC_DIR}${pathname}`;

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

    context.response.body = await Deno.readFile(staticFile);
    context.response?.headers.set("Content-Type", contentType);
    return context.response;
  },
);

export default staticFilesMiddleware;
