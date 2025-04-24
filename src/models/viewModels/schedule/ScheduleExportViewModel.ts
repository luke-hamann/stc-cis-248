import BetterDate from "../../../_dates/BetterDate.ts";
import MapWrapper from "../../../_framework/MapWrapper.ts";
import ViewModel from "../_shared/_ViewModel.ts";

const spreadsheetFormats = ["csv", "excel"] as const;

/** Defines a file type for a spreadsheet export format */
export type SpreadsheetFormat = typeof spreadsheetFormats[number];

/** Determines whether a value is a spreadsheet format
 * @param x Any value
 * @returns Whether it is a spreadsheet format
 */
// deno-lint-ignore no-explicit-any
export const isSpreadsheetFormat = (x: any): x is SpreadsheetFormat =>
  spreadsheetFormats.includes(x);

/** A view model for the schedule export form */
export default class ScheduleExportViewModel extends ViewModel {
  /** The title and file name of the exported schedule */
  public title: string;

  /** The start date of the schedule range being exported */
  public startDate: BetterDate | null;

  /** The end date of the schedule range being exported */
  public endDate: BetterDate | null;

  /** The file format of the schedule export */
  public format: SpreadsheetFormat | null;

  /** An array of validation messages */
  public errors: string[];

  /** Constructs the view model
   * @param title
   * @param startDate
   * @param endDate
   * @param format
   * @param errors
   */
  public constructor(
    title: string,
    startDate: BetterDate | null,
    endDate: BetterDate | null,
    format: SpreadsheetFormat | null,
    errors: string[],
  ) {
    super();
    this.title = title;
    this.startDate = startDate;
    this.endDate = endDate;
    this.format = format;
    this.errors = errors;
  }

  /** Maps incoming request data to the view model
   * @param request A request
   * @returns A view model
   */
  public static async fromRequest(
    request: Request,
  ): Promise<ScheduleExportViewModel> {
    const formData = MapWrapper.fromFormData(await request.formData());

    const title = formData.getString("title");
    const start = formData.getDate("startDate");
    const end = formData.getDate("endDate");
    const format = formData.getString("format");

    let spreadsheetFormat: SpreadsheetFormat | null = null;
    if (isSpreadsheetFormat(format)) {
      spreadsheetFormat = format;
    }

    return new ScheduleExportViewModel(
      title,
      start ? BetterDate.fromDate(start) : null,
      end ? BetterDate.fromDate(end) : null,
      spreadsheetFormat,
      [],
    );
  }

  /** Gets the url for the cancel link on the form */
  public get cancelLink() {
    const component = this.startDate!.floorToSunday().toDateString("/");
    return `/schedule/${component}/`;
  }

  /** Validates the view model and stores the validation messages */
  public validate(): void {
    this.errors = [];

    if (this.title.length == 0) {
      this.errors.push("Title is required.");
    } else if (!/^[\w -]{1,255}$/.test(this.title)) {
      this.errors.push(
        "Title must contain only letters, numbers, hyphens, underscores, or spaces and be 1 to 255 characters in length.",
      );
    }

    if (this.startDate == null) {
      this.errors.push("Please enter a start date.");
    }

    if (this.endDate == null) {
      this.errors.push("Please enter an end date.");
    }

    if (
      this.startDate != null &&
      this.endDate != null &&
      this.startDate.toDate().getTime() > this.endDate.toDate().getTime()
    ) {
      this.errors.push("End date must be after start date.");
    }

    if (!isSpreadsheetFormat(this.format)) {
      this.errors.push("Please enter a valid spreadsheet format.");
    }
  }

  /** Gets whether the view model is valid */
  public isValid(): boolean {
    return this.errors.length == 0;
  }
}
