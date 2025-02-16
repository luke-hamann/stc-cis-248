export default abstract class FormViewModel {
  isEdit: boolean = false;
  errors: string[] = [];

  constructor(isEdit: boolean, errors: string[]) {
    this.isEdit = isEdit;
    this.errors = errors;
  }
}
