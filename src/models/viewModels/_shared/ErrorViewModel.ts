import ViewModel from "./_ViewModel.ts";

export default class ErrorViewModel extends ViewModel {
  public title: string;
  public body: string;
  public isBodyPreformatted: boolean;

  public constructor(
    title: string,
    body: string,
    isBodyPreformatted: boolean,
  ) {
    super();
    this.title = title;
    this.body = body;
    this.isBodyPreformatted = isBodyPreformatted;
  }
}
