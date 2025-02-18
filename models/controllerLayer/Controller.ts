import {
  HTTPMethod,
  IActionHandler,
  IActionResult,
  IContext,
} from "../../globals.d.ts";
import Action from "./Action.ts";
import Context from "./Context.ts";

export default class Controller {
  private _actions: Action[] = [];

  /**
   * Register an action on the constructor
   *
   * @param method The HTTP method the action should respond to
   * @param pattern The regex url path pattern the action should respond to
   * @param handler The handler method with the action's code
   */
  public register(
    method: HTTPMethod,
    pattern: string,
    handler: IActionHandler,
  ) {
    this._actions.push(new Action(method, pattern, handler));
  }

  /**
   * Loop over the controller's actions to attempt to generate a response
   *
   * @param request The HTTP request coming in
   * @param context The application context object
   * @returns An action result object
   */
  public async execute(
    request: Request,
    context: IContext,
  ): IActionResult {
    for (const action of this._actions) {
      const result = await action.execute(request, context);
      if (result instanceof Response) {
        return result;
      } else if (result instanceof Context) {
        context = result;
      }
    }
    return context;
  }
}
