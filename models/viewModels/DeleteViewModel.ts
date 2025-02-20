export default class DeleteViewModel {
  description: string = "";
  action: string = "";
  cancel: string = "";
  csrf_token: string = "";

  public constructor(
    description: string,
    action: string,
    cancel: string,
    csrf_token: string,
  ) {
    this.description = description;
    this.action = action;
    this.cancel = cancel;
    this.csrf_token = csrf_token;
  }
}
