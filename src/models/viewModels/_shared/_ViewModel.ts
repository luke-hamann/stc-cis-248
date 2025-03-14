export default abstract class ViewModel {
  public csrf_token: string;

  public constructor(csrf_token: string) {
    this.csrf_token = csrf_token;
  }

  public get currentDate() {
    return new Date();
  }
}
