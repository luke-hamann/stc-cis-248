import TimeSlot from "./TimeSlot.ts";

export default class TimeSlotWarnings {
  public isExternalAssignee: boolean = false;
  public bilocation: TimeSlot[] = [];
  public adultOnly: boolean = false;
  public shiftContextPreferenceViolation: boolean = false;
  public availabilityViolation: boolean = false;
  public unassigned: boolean = false;

  public hasWarning(): boolean {
    return [
      this.isExternalAssignee,
      this.bilocation.length > 0,
      this.adultOnly,
      this.shiftContextPreferenceViolation,
      this.availabilityViolation,
      this.unassigned,
    ].reduce((a, b) => a || b, false);
  }
}
