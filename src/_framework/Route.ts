import Context from "./Context.ts";
import ResponseWrapper from "./ResponseWrapper.ts";

/** A class for representing a route in a controller */
export default class Route {
  /** The HTTP method that should be matched */
  public method: "GET" | "POST";

  /** The partial regex expression to match the URL path */
  public pattern: string;

  /** Maps regex match group indexes to readable string names */
  public mappings?: [number, string][];

  /** The action method that should be executed if the HTTP method and URL path pattern match */
  public action: (
    context: Context,
  ) => void | ResponseWrapper | Promise<void | ResponseWrapper>;

  /** Constructs the route
   * @param method The HTTP method
   * @param pattern The partial URL path regex pattern
   * @param action The action method
   */
  public constructor(
    method: "GET" | "POST",
    pattern: string,
    action: (
      context: Context,
    ) => void | ResponseWrapper | Promise<void | ResponseWrapper>,
  ) {
    this.method = method;
    this.pattern = pattern;
    this.action = action;
  }
}
