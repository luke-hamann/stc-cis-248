import MapWrapper from "./MapWrapper.ts";
import ResponseWrapper from "./ResponseWrapper.ts";

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

  /** The url path route data */
  public routeData: MapWrapper = MapWrapper.empty();

  /** A wrapper for the request form data */
  public formData: MapWrapper = MapWrapper.empty();

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
   * Form data must be fetched asynchronously.
   * Constructors cannot be asynchronous.
   */
  public async initializeFormData(): Promise<void> {
    if (this.request.method == "POST") {
      const formData = await this.request.clone().formData();
      this.formData = MapWrapper.fromFormData(formData);
    }
  }
}
