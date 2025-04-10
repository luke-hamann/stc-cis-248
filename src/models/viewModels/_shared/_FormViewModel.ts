import ViewModel from "./_ViewModel.ts";

/** An abstract class for view models representing forms */
export default abstract class FormViewModel extends ViewModel {
  /** Whether the form is in edit mode (as opposed to add mode) */
  public isEdit: boolean = false;

  /** An array of error messages */
  public errors: string[] = [];

  /** Constructs the view model
   * @param isEdit
   * @param errors
   */
  constructor(isEdit: boolean, errors: string[]) {
    super();
    this.isEdit = isEdit;
    this.errors = errors;
  }

  /** Determines whether the form is valid
   * @returns Whether the form is valid
   */
  public isValid(): boolean {
    return this.errors.length == 0;
  }
}
