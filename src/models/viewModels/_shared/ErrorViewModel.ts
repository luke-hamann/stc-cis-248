import IViewModel from "./IViewModel.ts";

export default class ErrorViewModel implements IViewModel {
  public csrf_token: string;
  public title: string;
  public body: string;
  public isBodyPreformatted: boolean;

  public constructor(
    title: string,
    body: string,
    isBodyPreformatted: boolean,
    csrf_token: string,
  ) {
    this.csrf_token = csrf_token;
    this.title = title;
    this.body = body;
    this.isBodyPreformatted = isBodyPreformatted;
  }
}
