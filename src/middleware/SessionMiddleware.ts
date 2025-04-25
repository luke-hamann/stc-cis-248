import Context from "../_framework/Context.ts";
import Controller from "../_framework/Controller.ts";
import { IKeyStore } from "../models/repositories/_KeyStore.ts";

/** Middleware for handling an HTTP session with a cookie */
export default class SessionMiddleware extends Controller {
  /** The key name of the session cookie */
  private readonly _sessionCookieName = "session";

  /** How many milliseconds should be added to the current time to set the session soft expiration */
  private readonly _softExpirationIncrement = 1000 * 60;

  /** The key store for storing session data */
  private _keyStore: IKeyStore;

  /** Constructs the middleware
   * @param keyStore The key store for storing session data
   */
  constructor(keyStore: IKeyStore) {
    super();
    this._keyStore = keyStore;
    this.routes = [
      { method: "GET", pattern: ".*", action: this.startSession },
      { method: "POST", pattern: ".*", action: this.startSession },
    ];
  }

  /** Starts the application session, creating it if it does not exist
   * @param context The application context
   */
  public async startSession(context: Context) {
    // Attempt to get the session if it exists
    let hasSession = false;
    let sessionKey = context.requestCookies.get(this._sessionCookieName);
    if (sessionKey) {
      const sessionValue = await this._keyStore.get(sessionKey);
      if (sessionValue) {
        context.csrf_token = sessionValue;
        hasSession = true;
      }
    }

    // Create the session if it does not exist
    if (!hasSession) {
      sessionKey = crypto.randomUUID();
      const csrf_token = crypto.randomUUID();

      const now = new Date();
      const softExpiration = new Date(
        now.getTime() + this._softExpirationIncrement,
      );
      const hardExpiration = new Date(now);
      hardExpiration.setDate(hardExpiration.getDate() + 1);

      await this._keyStore.set(
        sessionKey,
        csrf_token,
        softExpiration,
        this._softExpirationIncrement,
        hardExpiration,
      );
      context.csrf_token = csrf_token;
      context.response.headers.set(
        "Set-Cookie",
        `${this._sessionCookieName}=${sessionKey} ; Path=/ ; Secure`,
      );
    }
  }
}
