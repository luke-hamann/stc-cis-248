export default class DeleteViewModel {
  description: string = "";
  action: string = "";
  cancel: string = "";

  public constructor(description: string, action: string, cancel: string) {
    this.description = description;
    this.action = action;
    this.cancel = cancel;
  }
}
