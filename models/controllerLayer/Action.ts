import { HTTPMethod, IActionHandler } from "../../globals.d.ts";
import Context from "./Context.ts";
import ResponseWrapper from "./ResponseWrapper.ts";

/**
 * A class for representing a controller action
 */
export default class Action {
  private _method: HTTPMethod;
  private _pattern: RegExp;
  private _handler: IActionHandler;

  /**
   * Build an action object
   *
   * @param method The HTTP method the action should act on
   * @param pattern The regex path pattern the action should act on
   * @param handler The handler containing the code the action should execute
   */
  public constructor(
    method: HTTPMethod,
    pattern: string,
    handler: IActionHandler,
  ) {
    this._method = method;
    this._pattern = new RegExp(`^${pattern}$`, "g");
    this._handler = handler;
  }

  /**
   * Execute the action
   *
   * @param request The HTTP request coming in
   * @param context The current context of the application
   * @returns The result of the action's execution
   */
  public async execute(
    context: Context,
  ): Promise<void | ResponseWrapper> {
    if (context.request.method != this._method) return;

    const url = new URL(context.request.url);
    const match = url.pathname.matchAll(this._pattern).toArray()[0];
    if (!match) return;

    context.match = match;
    return await this._handler(context, match);
  }
}
