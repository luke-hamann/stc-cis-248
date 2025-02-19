import ResponseWrapper from "./ResponseWrapper.ts";

export default class Context {
  public request: Request;
  public response: ResponseWrapper;
  public match: string[] = [];
  public csrf_token: string = "";

  public constructor(request: Request, response: ResponseWrapper) {
    this.request = request;
    this.response = response;
  }
}
