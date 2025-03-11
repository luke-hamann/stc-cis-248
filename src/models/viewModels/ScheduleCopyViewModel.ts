import DateLib from "../../_dates/DateLib.ts";

export default class ScheduleCopyViewModel {
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

  public constructor(
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

  private formatDate(date: Date | null): string {
    if (date == null) return "";
    return date.toISOString().substring(0, 10);
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
    const date = DateLib.floorDays(this.fromStartDate ?? new Date());
    const dateString = this.formatDate(date).replaceAll("-", "/");
    return `/schedule/${dateString}/`;
  }
}
