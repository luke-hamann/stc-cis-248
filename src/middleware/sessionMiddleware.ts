import Context from "../_framework/Context.ts";
import Controller from "../_framework/Controller.ts";

export default class SessionMiddleware extends Controller {
  private readonly sessionCookieName = "session";

  constructor() {
    super();
    this.routes = [
      { method: "GET", pattern: ".*", action: this.startSession },
      { method: "POST", pattern: ".*", action: this.startSession },
    ];
  }

  /**
   * Starts the application session, creating it if it does not exist
   * @param context The application context
   */
  public async startSession(context: Context) {
    const kv = await Deno.openKv();

    // Attempt to get the session if it exists
    let hasSession = false;
    let sessionKey = context.requestCookies.get(this.sessionCookieName);
    if (sessionKey) {
      const sessionValue = (await kv.get([sessionKey])).value as string | null;
      if (sessionValue) {
        context.csrf_token = sessionValue;
        hasSession = true;
      }
    }

    // Create the session if it does not exist
    if (!hasSession) {
      sessionKey = crypto.randomUUID();
      const csrf_token = crypto.randomUUID();
      await kv.set([sessionKey], csrf_token);
      context.csrf_token = csrf_token;
      context.response.headers.set(
        "Set-Cookie",
        `${this.sessionCookieName}=${sessionKey}`,
      );
    }
  }
}
