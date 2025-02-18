import {
  ActionResult,
  Handler,
  HTTPMethod,
  IContext,
} from "../../globals.d.ts";
import Action from "./Action.ts";
import Context from "./Context.ts";

export default class Controller {
  private _actions: Action[] = [];

  public register(method: HTTPMethod, pattern: string, handler: Handler) {
    this._actions.push(new Action(method, pattern, handler));
  }

  public async execute(
    request: Request,
    context: IContext,
  ): ActionResult {
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
