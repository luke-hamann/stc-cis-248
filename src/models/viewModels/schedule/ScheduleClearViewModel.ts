import BetterDate from "../../../_dates/BetterDate.ts";
import DateLib from "../../../_dates/DateLib.ts";
import FormDataWrapper from "../../../_framework/FormDataWrapper.ts";
import ViewModel from "../_shared/_ViewModel.ts";

export default class ScheduleClearViewModel extends ViewModel {
  public startDate: Date | null;
  public endDate: Date | null;
  public deleteTimeSlots: boolean;
  public deleteShiftContextNotes: boolean;
  public deleteSubstitutes: boolean;
  public errors: string[];

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

  public static default(
    startDate: Date,
    endDate: Date,
  ): ScheduleClearViewModel {
    return new ScheduleClearViewModel(
      startDate,
      endDate,
      true,
      true,
      true,
      [],
    );
  }

  public static async fromRequest(
    request: Request,
  ): Promise<ScheduleClearViewModel> {
    const formData = new FormDataWrapper(await request.formData());

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

  public get startDateString(): string {
    return this.startDate
      ? BetterDate.fromDate(this.startDate).toDateString()
      : "";
  }

  public get endDateString(): string {
    return this.endDate ? BetterDate.fromDate(this.endDate).toDateString() : "";
  }

  public get cancelLink(): string {
    const date = DateLib.floorToSunday(this.startDate ?? new Date());
    const dateString = BetterDate.fromDate(date).toDateString().replaceAll(
      "-",
      "/",
    );
    return `/schedule/${dateString}/`;
  }

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
      this.endDate != null &&
      this.endDate.getTime() < this.startDate.getTime()
    ) {
      this.errors.push("End date must be after start date.");
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
