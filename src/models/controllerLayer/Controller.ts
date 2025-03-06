import { HTTPMethod, IActionHandler, IContext } from "../../globals.d.ts";
import Action from "./Action.ts";
import ResponseWrapper from "./ResponseWrapper.ts";

/**
 * A class for representing a controller in a router
 */
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
   * @param context The application context
   * @returns An action result object
   */
  public async execute(
    context: IContext,
  ): Promise<ResponseWrapper | void> {
    for (const action of this._actions) {
      const response = await action.execute(context);
      if (response) return response;
    }
    return;
  }
}
