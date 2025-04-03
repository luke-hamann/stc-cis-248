import BetterDate from "../../../_dates/BetterDate.ts";
import FormDataWrapper from "../../../_framework/FormDataWrapper.ts";
import ViewModel from "../_shared/_ViewModel.ts";

const spreadsheetFormats = ["csv", "excel"] as const;
export type SpreadsheetFormat = typeof spreadsheetFormats[number];
// deno-lint-ignore no-explicit-any
export const isSpreadsheetFormat = (x: any): x is SpreadsheetFormat =>
  spreadsheetFormats.includes(x);

export default class ScheduleExportFormViewModel extends ViewModel {
  public title: string;
  public startDate: BetterDate | null;
  public endDate: BetterDate | null;
  public format: SpreadsheetFormat | null;
  public errors: string[];

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

  public static async fromRequest(
    request: Request,
  ): Promise<ScheduleExportFormViewModel> {
    const formData = new FormDataWrapper(await request.formData());

    const title = formData.getString("title");
    const start = formData.getDate("startDate");
    const end = formData.getDate("endDate");
    const format = formData.getString("format");

    let spreadsheetFormat: SpreadsheetFormat | null = null;
    if (isSpreadsheetFormat(format)) {
      spreadsheetFormat = format;
    }

    return new ScheduleExportFormViewModel(
      title,
      start ? BetterDate.fromDate(start) : null,
      end ? BetterDate.fromDate(end) : null,
      spreadsheetFormat,
      [],
    );
  }

  public get cancelLink() {
    const component = this.startDate!.floorToSunday().toDateString("/");
    return `/schedule/${component}/`;
  }

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

  public isValid(): boolean {
    return this.errors.length == 0;
  }
}
