import Context from "../_framework/Context.ts";
import Controller from "../_framework/Controller.ts";
import ResponseWrapper from "../_framework/ResponseWrapper.ts";

/** Middleware for serving static files */
export default class StaticFilesMiddleware extends Controller {
  /** The directory to serve files from */
  private readonly STATIC_DIR = "./static";

  /** Constructs the middleware
   *
   * This middleware processes all GET requests.
   */
  constructor() {
    super();
    this.routes = [
      { method: "GET", pattern: ".*", action: this.getStaticFile },
    ];
  }

  /** Attempts to get a static file from a directory based on the application context URL
   *
   * Returns void if the context URL does not correspond to a file
   *
   * @param context The application context
   * @returns A response with the file, or void
   */
  public async getStaticFile(
    context: Context,
  ): Promise<ResponseWrapper | void> {
    const work = [this.STATIC_DIR];
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
    const staticFile = `${this.STATIC_DIR}${pathname}`;

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
  }
}
