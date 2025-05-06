import BetterDate from "../../../_dates/BetterDate.ts";
import DateLib from "../../../_dates/DateLib.ts";
import MapWrapper from "../../../_framework/MapWrapper.ts";
import ViewModel from "../_shared/_ViewModel.ts";

/** A view model for the schedule clear form */
export default class ScheduleClearViewModel extends ViewModel {
  /** The start date of the schedule range to clear */
  public startDate: Date | null;

  /** The end date of the schedule range to clear */
  public endDate: Date | null;

  /** Whether time slots should be cleared */
  public deleteTimeSlots: boolean;

  /** Whether shift context notes should be cleared */
  public deleteShiftContextNotes: boolean;

  /** Whether substitute lists should be cleared */
  public deleteSubstitutes: boolean;

  /** An array of form validation messages */
  public errors: string[];

  /** Constructs the view model
   * @param startDate
   * @param endDate
   * @param deleteTimeSlots
   * @param deleteShiftContextNotes
   * @param deleteSubstitutes
   * @param errors
   */
  constructor(
    startDate: Date | null,
    endDate: Date | null,
    deleteTimeSlots: boolean,
    deleteShiftContextNotes: boolean,
    deleteSubstitutes: boolean,
    errors: string[],
  ) {
    super();
    this.startDate = startDate;
    this.endDate = endDate;
    this.deleteTimeSlots = deleteTimeSlots;
    this.deleteShiftContextNotes = deleteShiftContextNotes;
    this.deleteSubstitutes = deleteSubstitutes;
    this.errors = errors;
  }

  /** Constructs the view model with default values using a date range
   * @param startDate
   * @param endDate
   * @returns The view model
   */
  public static default(
    startDate: Date,
    endDate: Date,
  ): ScheduleClearViewModel {
    return new ScheduleClearViewModel(
      startDate,
      endDate,
      false,
      false,
      false,
      [],
    );
  }

  /** Maps form data from a request to the view model
   * @param request The HTTP request
   * @returns The view model
   */
  public static async fromRequest(
    request: Request,
  ): Promise<ScheduleClearViewModel> {
    const formData = MapWrapper.fromFormData(await request.formData());

    const startDate = formData.getDate("startDate");
    const endDate = formData.getDate("endDate");
    const deleteTimeSlots = formData.getBool("deleteTimeSlots");
    const deleteShiftContextNotes = formData.getBool("deleteShiftContextNotes");
    const deleteSubstitutes = formData.getBool("deleteSubstitutes");

    return new ScheduleClearViewModel(
      startDate,
      endDate,
      deleteTimeSlots,
      deleteShiftContextNotes,
      deleteSubstitutes,
      [],
    );
  }

  /** Gets the start date as a string in yyyy-mm-dd format */
  public get startDateString(): string {
    return this.startDate
      ? BetterDate.fromDate(this.startDate).toDateString()
      : "";
  }

  /** Gets the end date as a string in yyyy-mm-dd format */
  public get endDateString(): string {
    return this.endDate ? BetterDate.fromDate(this.endDate).toDateString() : "";
  }

  /** Generates the url for the cancel link of the form */
  public get cancelLink(): string {
    const date = DateLib.floorToSunday(this.startDate ?? new Date());
    const dateString = BetterDate.fromDate(date).toDateString("/");
    return `/schedule/${dateString}/`;
  }

  /** Runs validation checks on the view model and saves the error messages */
  public validate(): void {
    this.errors = [];

    if (this.startDate == null) {
      this.errors.push("Please enter a start date.");
    }

    if (this.endDate == null) {
      this.errors.push("Please enter an end date.");
    }

    if (
      this.startDate != null &&
      this.endDate != null
    ) {
      if (this.startDate > this.endDate) {
        this.errors.push("End date must be after start date.");
      } else if (DateLib.differenceInDays(this.startDate, this.endDate) > 90) {
        this.errors.push("The maximum range to clear is 90 days.");
      }
    }

    if (
      !this.deleteTimeSlots &&
      !this.deleteShiftContextNotes &&
      !this.deleteSubstitutes
    ) {
      this.errors.push("You must select at least one option to delete.");
    }
  }

  public isValid() {
    return this.errors.length == 0;
  }
}
