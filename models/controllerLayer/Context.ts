import ResponseWrapper from "./ResponseWrapper.ts";

/**
 * A class for representing an application state context
 */
export default class Context {
  public request: Request;
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
  }
}
