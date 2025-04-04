import Context from "./Context.ts";
import ResponseWrapper from "./ResponseWrapper.ts";

export default class Route {
  /** The HTTP method that should be matched */
  public method: "GET" | "POST";

  /** The partial regex expression that should match the url */
  public pattern: string;

  public mappings?: [number, string][];

  /** The action method that should be executed if the method and pattern match */
  public action: (
    context: Context,
  ) => void | ResponseWrapper | Promise<void | ResponseWrapper>;

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
