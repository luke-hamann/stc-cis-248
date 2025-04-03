import TeamMember from "./TeamMember.ts";
import TimeSlot from "./TimeSlot.ts";
import TimeSlotWarnings from "./TimeSlotWarnings.ts";

export default class ScheduleWarnings {
  public externality: TimeSlot[] = [];
  public bilocation: [TimeSlot, TimeSlot][] = [];
  public adultOnly: TimeSlot[] = [];
  public shiftContextPreferenceViolations: TimeSlot[] = [];
  public availabilityViolations: TimeSlot[] = [];
  public maxWeeklyDaysViolations: [TeamMember, number][] = [];
  public maxWeeklyHoursViolations: [TeamMember, number][] = [];
  public unassignedTimeSlots: TimeSlot[] = [];

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
