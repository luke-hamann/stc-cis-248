import ViewModel from "./_ViewModel.ts";

export default class ErrorViewModel extends ViewModel {
  public title: string;
  public body: string;
  public isBodyPreformatted: boolean;

  public constructor(title: string, body: string, isBodyPreformatted: boolean, csrf_token: string) {
    super(csrf_token);
    this.title = title;
    this.body = body;
    this.isBodyPreformatted = isBodyPreformatted;
  }
}
