import Context from "./Context.ts";

export class ActionResult {
  response: Response | null = null;
  context: Context | null = null;

  public hasResponse() {
    return this.response != null;
  }

  public hasContext() {
    return this.context != null;
  }
}
