import ViewModel from "./_ViewModel.ts";

export default abstract class FormViewModel extends ViewModel {
  public isEdit: boolean = false;
  public errors: string[] = [];

  constructor(isEdit: boolean, errors: string[], csrf_token: string) {
    super(csrf_token);
    this.isEdit = isEdit;
    this.errors = errors;
  }

  public isValid() {
    return this.errors.length == 0;
  }
}
