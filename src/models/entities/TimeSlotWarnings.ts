import TimeSlot from "./TimeSlot.ts";

/** Represents warnings relevant to a specific time slot */
export default class TimeSlotWarnings {
  /** Whether the time slot has an external assignee */
  public isExternalAssignee: boolean = false;

  /** Concurrent time slots with the same assignee as the current time slot */
  public bilocation: TimeSlot[] = [];

  /** Whether the time slot is adult-only and the assignee is under-age */
  public adultOnly: boolean = false;

  /** Whether the time slot assignee dislikes the shift context of the time slot */
  public shiftContextPreferenceViolation: boolean = false;

  /** Whether the time slot assignee is unavailable during the time slot */
  public availabilityViolation: boolean = false;

  /** Whether the time slot has no assignee */
  public unassigned: boolean = false;

  /** Determines whether any warnings exist for the time slot
   * @returns The result
   */
  public hasWarning(): boolean {
    return this.isExternalAssignee ||
      this.bilocation.length > 0 ||
      this.adultOnly ||
      this.shiftContextPreferenceViolation ||
      this.availabilityViolation ||
      this.unassigned;
  }
}
