export default abstract class FormViewModel {
  isEdit: boolean = false;
  errors: string[] = [];
  csrf_token: string = "";

  constructor(isEdit: boolean, errors: string[], csrf_token: string) {
    this.isEdit = isEdit;
    this.errors = errors;
    this.csrf_token = csrf_token;
  }
}
