import ViewModel from "./_ViewModel.ts";

/** A class for representing a generic error page */
export default class ErrorViewModel extends ViewModel {
  /** The page title */
  public title: string;

  /** The page content */
  public body: string;

  /** Whether the page content is preformatted
   *
   * This is useful for displaying stack traces on developer exception pages.
   */
  public isBodyPreformatted: boolean;

  /** Constructs the view model
   * @param title
   * @param body
   * @param isBodyPreformatted
   */
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
