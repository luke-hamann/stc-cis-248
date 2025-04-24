import Context from "./Context.ts";
import ResponseWrapper from "./ResponseWrapper.ts";

/** A class for representing a route in a controller */
export default class Route {
  /** The HTTP method that should be matched */
  public method: "GET" | "POST";

  /** The partial regex expression that should match the url */
  public pattern: string;

  /** Maps regex match group indexes to strings that name each group */
  public mappings?: [number, string][];

  /** The action method that should be executed if the method and pattern match */
  public action: (
    context: Context,
  ) => void | ResponseWrapper | Promise<void | ResponseWrapper>;

  /** Constructs the route
   * @param method The HTTP method
   * @param pattern The partial URL regex pattern
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
