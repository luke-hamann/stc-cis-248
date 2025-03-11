import FormDataWrapper from "../../_framework/FormDataWrapper.ts";

export default class ScheduleClearViewModel {
  public startDate: Date | null;
  public endDate: Date | null;
  public deleteTimeSlots: boolean;
  public deleteShiftContextNotes: boolean;
  public deleteSubstitutes: boolean;
  public csrf_token: string;
  public errors: string[];

  constructor(
    startDate: Date | null,
    endDate: Date | null,
    deleteTimeSlots: boolean,
    deleteShiftContextNotes: boolean,
    deleteSubstitutes: boolean,
    csrf_token: string,
    errors: string[],
  ) {
    this.startDate = startDate;
    this.endDate = endDate;
    this.deleteTimeSlots = deleteTimeSlots;
    this.deleteShiftContextNotes = deleteShiftContextNotes;
    this.deleteSubstitutes = deleteSubstitutes;
    this.csrf_token = csrf_token;
    this.errors = errors;
  }

  public static default(
    startDate: Date,
    endDate: Date,
    csrf_token: string,
  ): ScheduleClearViewModel {
    return new ScheduleClearViewModel(
      startDate,
      endDate,
      true,
      true,
      true,
      csrf_token,
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
      "",
      [],
    );
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
