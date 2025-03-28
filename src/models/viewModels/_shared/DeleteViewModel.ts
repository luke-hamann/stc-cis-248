import IViewModel from "./IViewModel.ts";

export default class DeleteViewModel implements IViewModel {
  description: string = "";
  action: string = "";
  cancel: string = "";
  warnings: string[] = [];
  csrf_token: string = "";

  public constructor(
    description: string,
    action: string,
    cancel: string,
    warnings: string[],
  ) {
    this.description = description;
    this.action = action;
    this.cancel = cancel;
    this.warnings = warnings;
  }
}
