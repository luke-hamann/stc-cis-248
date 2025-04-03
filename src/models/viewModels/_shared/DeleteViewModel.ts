import ViewModel from "./_ViewModel.ts";

export default class DeleteViewModel extends ViewModel {
  description: string = "";
  action: string = "";
  cancel: string = "";
  warnings: string[] = [];

  public constructor(
    description: string,
    action: string,
    cancel: string,
    warnings: string[],
  ) {
    super();
    this.description = description;
    this.action = action;
    this.cancel = cancel;
    this.warnings = warnings;
  }
}
