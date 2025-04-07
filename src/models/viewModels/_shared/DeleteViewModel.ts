import ViewModel from "./_ViewModel.ts";

/** A class representing a generic deletion confirmation form */
export default class DeleteViewModel extends ViewModel {
  /** A description of what is being deleted */
  description: string = "";

  /** The url the form should be submitted to */
  action: string = "";

  /** The url of the cancel button on the form */
  cancel: string = "";

  /** An array of warning messages for the deletion */
  warnings: string[] = [];

  /** Constructs the view model
   * @param description
   * @param action
   * @param cancel
   * @param warnings
   */
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
