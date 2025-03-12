import BetterDate from "../../_dates/BetterDate.ts";
import DateLib from "../../_dates/DateLib.ts";
import FormDataWrapper from "../../_framework/FormDataWrapper.ts";
import ShiftContextNote from "../entities/ShiftContextNote.ts";
import TimeSlot from "../entities/TimeSlot.ts";

export default class ScheduleCopyViewModel {
  public confirm: boolean;
  public fromStartDate: Date | null;
  public fromEndDate: Date | null;
  public toStartDate: Date | null;
  public toEndDate: Date | null;
  public repeatCopy: boolean;
  public includeAssignees: boolean;
  public includeShiftContextNotes: boolean;
  public includeTimeSlotNotes: boolean;
  public csrf_token: string;
  public errors: string[];

  public newTimeSlots: TimeSlot[] = [];
  public newShiftContextNotes: ShiftContextNote[] = [];

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
    csrf_token: string,
    errors: string[],
  ) {
    this.confirm = confirm;
    this.fromStartDate = fromStartDate;
    this.fromEndDate = fromEndDate;
    this.toStartDate = toStartDate;
    this.toEndDate = toEndDate;
    this.repeatCopy = repeatCopy;
    this.includeAssignees = includeAssignees;
    this.includeShiftContextNotes = includeShiftContextNotes;
    this.includeTimeSlotNotes = includeTimeSlotNotes;
    this.csrf_token = csrf_token;
    this.errors = errors;
  }

  public static async fromRequest(
    request: Request,
  ): Promise<ScheduleCopyViewModel> {
    const formData = new FormDataWrapper(await request.formData());

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
      "",
      [],
    );
  }

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

  public isValid(): boolean {
    return this.errors.length == 0;
  }

  private formatDate(date: Date | null): string {
    if (date == null) return "";
    return BetterDate.fromDate(date).toDateString();
  }

  public get fromStartDateString(): string {
    return this.formatDate(this.fromStartDate);
  }

  public get fromEndDateString(): string {
    return this.formatDate(this.fromEndDate);
  }

  public get toStartDateString(): string {
    return this.formatDate(this.toStartDate);
  }

  public get toEndDateString(): string {
    return this.formatDate(this.toEndDate);
  }

  public get cancelLink(): string {
    const date = DateLib.floorToSunday(this.fromStartDate ?? new Date());
    const dateString = this.formatDate(date).replaceAll("-", "/");
    return `/schedule/${dateString}/`;
  }
}
