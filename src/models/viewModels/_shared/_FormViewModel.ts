import IViewModel from "./IViewModel.ts";

export default abstract class FormViewModel implements IViewModel {
  public csrf_token: string = "";
  public isEdit: boolean = false;
  public errors: string[] = [];

  constructor(isEdit: boolean, errors: string[]) {
    this.isEdit = isEdit;
    this.errors = errors;
  }

  public isValid() {
    return this.errors.length == 0;
  }
}
