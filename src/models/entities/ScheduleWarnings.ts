import TeamMember from "./TeamMember.ts";
import TimeSlot from "./TimeSlot.ts";
import TimeSlotWarnings from "./TimeSlotWarnings.ts";

/** Represents the warnings for a given schedule */
export default class ScheduleWarnings {
  /** Time slots with external assignees */
  public externality: TimeSlot[] = [];

  /** Concurrent time slots with the same assignee */
  public bilocation: [TimeSlot, TimeSlot][] = [];

  /** Adult-only time slots with under-age assignees */
  public adultOnly: TimeSlot[] = [];

  /** Time slots where an assignee has been placed in a shift context they do not prefer */
  public shiftContextPreferenceViolations: TimeSlot[] = [];

  /** Time slots where the assignee is not typically available or specially marked as unavailable */
  public availabilityViolations: TimeSlot[] = [];

  /** Team members that have been scheduled to work too many days
   *
   * Includes the number of days they have been scheduled
   */
  public maxWeeklyDaysViolations: [TeamMember, number][] = [];

  /** Team members that have been scheduled to work too many hours
   *
   * Includes the number of hours they have been scheduled
   */
  public maxWeeklyHoursViolations: [TeamMember, number][] = [];

  /** Time slots without assignees */
  public unassignedTimeSlots: TimeSlot[] = [];

  /** Gets the total number of warnings */
  public get length(): number {
    return [
      this.externality,
      this.bilocation,
      this.adultOnly,
      this.shiftContextPreferenceViolations,
      this.availabilityViolations,
      this.maxWeeklyDaysViolations,
      this.maxWeeklyHoursViolations,
      this.unassignedTimeSlots,
    ].map((list) => list.length).reduce((a, b) => a + b, 0);
  }

  /** Gets all the warnings relating to a given time slot
   * @param timeSlotId The time slot id
   * @returns The time slot warnings
   */
  public getTimeSlotWarnings(timeSlotId: number): TimeSlotWarnings {
    const warnings = new TimeSlotWarnings();

    for (const timeSlot of this.externality) {
      if (timeSlot.id == timeSlotId) {
        warnings.isExternalAssignee = true;
        break;
      }
    }

    for (const bilocation of this.bilocation) {
      if (bilocation[0].id == timeSlotId) {
        warnings.bilocation.push(bilocation[1]);
        break;
      } else if (bilocation[1].id == timeSlotId) {
        warnings.bilocation.push(bilocation[0]);
        break;
      }
    }

    for (const timeSlot of this.adultOnly) {
      if (timeSlot.id == timeSlotId) {
        warnings.adultOnly = true;
        break;
      }
    }

    for (const timeSlot of this.shiftContextPreferenceViolations) {
      if (timeSlot.id == timeSlotId) {
        warnings.shiftContextPreferenceViolation = true;
        break;
      }
    }

    for (const timeSlot of this.availabilityViolations) {
      if (timeSlot.id == timeSlotId) {
        warnings.availabilityViolation = true;
        break;
      }
    }

    for (const timeSlot of this.unassignedTimeSlots) {
      if (timeSlot.id == timeSlotId) {
        warnings.unassigned = true;
        break;
      }
    }

    return warnings;
  }
}
