import BetterDate from "../../../_dates/BetterDate.ts";
import DateLib from "../../../_dates/DateLib.ts";
import MapWrapper from "../../../_framework/MapWrapper.ts";
import ShiftContextNote from "../../entities/ShiftContextNote.ts";
import TimeSlot from "../../entities/TimeSlot.ts";
import ViewModel from "../_shared/_ViewModel.ts";

/** A view model for the schedule copy form */
export default class ScheduleCopyViewModel extends ViewModel {
  /** Whether the model is in confirmation mode (as opposed to to preview mode) */
  public confirm: boolean;

  /** The start date of the source range */
  public fromStartDate: Date | null;

  /** The end date of the source range */
  public fromEndDate: Date | null;

  /** The start date of the destination range */
  public toStartDate: Date | null;

  /** The end date of the destination range */
  public toEndDate: Date | null;

  /** Whether the source range copy should be repeated to fill the destination range */
  public repeatCopy: boolean;

  /** Whether the copy should include time slot assignees */
  public includeAssignees: boolean;

  /** Whether the copy should include shift context notes */
  public includeShiftContextNotes: boolean;

  /** Whether the copy should include time slot notes */
  public includeTimeSlotNotes: boolean;

  /** An array of validation messages */
  public errors: string[];

  /** The time slots that would be created by a copy operation */
  public newTimeSlots: TimeSlot[] = [];

  /** The shift context notes that would be created by a copy operation */
  public newShiftContextNotes: ShiftContextNote[] = [];

  /** Constructs the view model
   * @param confirm
   * @param fromStartDate
   * @param fromEndDate
   * @param toStartDate
   * @param toEndDate
   * @param repeatCopy
   * @param includeAssignees
   * @param includeShiftContextNotes
   * @param includeTimeSlotNotes
   * @param errors
   */
  public constructor(
    confirm: boolean,
    fromStartDate: Date | null,
    fromEndDate: Date | null,
    toStartDate: Date | null,
    toEndDate: Date | null,
    repeatCopy: boolean,
    includeAssignees: boolean,
    includeShiftContextNotes: boolean,
    includeTimeSlotNotes: boolean,
    errors: string[],
  ) {
    super();
    this.confirm = confirm;
    this.fromStartDate = fromStartDate;
    this.fromEndDate = fromEndDate;
    this.toStartDate = toStartDate;
    this.toEndDate = toEndDate;
    this.repeatCopy = repeatCopy;
    this.includeAssignees = includeAssignees;
    this.includeShiftContextNotes = includeShiftContextNotes;
    this.includeTimeSlotNotes = includeTimeSlotNotes;
    this.errors = errors;
  }

  /** Constructs the view model based on an incoming request
   * @param request The HTTP request
   * @returns The view model
   */
  public static async fromRequest(
    request: Request,
  ): Promise<ScheduleCopyViewModel> {
    const formData = MapWrapper.fromFormData(await request.formData());

    return new ScheduleCopyViewModel(
      formData.getBool("confirm"),
      formData.getDate("fromStartDate"),
      formData.getDate("fromEndDate"),
      formData.getDate("toStartDate"),
      formData.getDate("toEndDate"),
      formData.getBool("repeatCopy"),
      formData.getBool("includeAssignees"),
      formData.getBool("includeShiftContextNotes"),
      formData.getBool("includeTimeSlotNotes"),
      [],
    );
  }

  /** Validates the view model and stores the error messages */
  public validate() {
    this.errors = [];

    if (this.fromStartDate == null) {
      this.errors.push("Please enter a start date to copy from.");
    }

    if (this.fromEndDate == null) {
      this.errors.push("Please enter an end date to copy from.");
    }

    if (
      this.fromStartDate != null &&
      this.fromEndDate != null &&
      this.fromEndDate.getTime() < this.fromStartDate.getTime()
    ) {
      this.errors.push(
        "End date to copy from must be after start date to copy from.",
      );
    }

    if (this.toStartDate == null) {
      this.errors.push("Please enter a start date to copy to.");
    }

    if (this.toEndDate == null) {
      this.errors.push("Please enter an end date to copy to.");
    }

    if (
      this.toStartDate != null &&
      this.toEndDate != null &&
      this.toEndDate.getTime() < this.toStartDate.getTime()
    ) {
      this.errors.push(
        "End date to copy to must be after start date to copy to.",
      );
    }
  }

  /** Gets whether the view model is valid */
  public isValid(): boolean {
    return this.errors.length == 0;
  }

  /** Formats a data as a string in yyyy-mm-dd format
   * @param date The date
   * @returns The string
   */
  private formatDate(date: Date | null): string {
    if (date == null) return "";
    return BetterDate.fromDate(date).toDateString();
  }

  /** Gets the source range start date as a string in yyyy-mm-dd format */
  public get fromStartDateString(): string {
    return this.formatDate(this.fromStartDate);
  }

  /** Gets the source range end date as a string in yyyy-mm-dd format */
  public get fromEndDateString(): string {
    return this.formatDate(this.fromEndDate);
  }

  /** Gets the destination start date as a string in yyyy-mm-dd format */
  public get toStartDateString(): string {
    return this.formatDate(this.toStartDate);
  }

  /** Gets the destination end date as a string in yyyy-mm-dd format */
  public get toEndDateString(): string {
    return this.formatDate(this.toEndDate);
  }

  /** Gets the url for the cancel link on the form */
  public get cancelLink(): string {
    const date = DateLib.floorToSunday(this.fromStartDate ?? new Date());
    const dateString = this.formatDate(date).replaceAll("-", "/");
    return `/schedule/${dateString}/`;
  }
}
