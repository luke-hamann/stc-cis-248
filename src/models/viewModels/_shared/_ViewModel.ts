/** An abstract class for representing a view model */
export default abstract class ViewModel {
  /** The anti-cross-site request forgery token */
  public csrf_token: string = "";
}
