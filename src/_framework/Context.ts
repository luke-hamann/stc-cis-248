import ResponseWrapper from "./ResponseWrapper.ts";

/**
 * A class for representing an application state context
 */
export default class Context {
  public readonly request: Request;
  public readonly requestCookies: Map<string, string>;
  public response: ResponseWrapper;
  public match: string[] = [];
  public csrf_token: string = "";

  /**
   * Construct the application state context
   * @param request The HTTP request
   * @param response A response wrapper
   */
  public constructor(request: Request, response: ResponseWrapper) {
    this.request = request;
    this.response = response;

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
}
