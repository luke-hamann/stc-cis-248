import { FormDataWrapper } from "../mod.ts";
import ResponseWrapper from "./ResponseWrapper.ts";
import RouteData from "./RouteDataWrapper.ts";

/** A class for representing an application state context */
export default class Context {
  /** The incoming HTTP request */
  public readonly request: Request;

  /** The incoming HTTP cookies */
  public readonly requestCookies: Map<string, string>;

  /** The outgoing HTTP response */
  public response: ResponseWrapper;

  /** The regex match results for the incoming request URL */
  public match: string[] = [];

  public routeData: RouteData | null = null;

  /** A wrapper for the request form data */
  public formData: FormDataWrapper | null = null;

  /** The anti-cross-site-request-forgery token from the session */
  public csrf_token: string = "";

  /** Constructs the application state context
   *
   * Also converts the Cookie HTTP header into a Map
   *
   * @param request The incoming HTTP request
   * @param response A response wrapper
   */
  public constructor(request: Request, response: ResponseWrapper) {
    this.request = request;
    this.response = response;

    // Cookies
    this.requestCookies = new Map<string, string>();
    const cookieHeader = request.headers.get("Cookie") ?? "";
    const cookiePairs = cookieHeader
      .split(";")
      .map((value) => value.trim())
      .filter((value) => value.length > 0)
      .map((pair) => [...pair.split("="), "", ""].slice(0, 2));

    for (let [key, value] of cookiePairs) {
      key = decodeURIComponent(key);
      value = decodeURIComponent(value);
      this.requestCookies.set(key, value);
    }
  }

  /** Initializes the form data of the application context
   *
   * Form data must be fetched asyncronously.
   * Constructors cannot be asyncronous.
   */
  public async initializeFormData(): Promise<void> {
    this.formData = new FormDataWrapper(await this.request.clone().formData());
  }
}
