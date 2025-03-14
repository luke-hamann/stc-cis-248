import { resourceLimits } from "node:worker_threads";
import TeamMember from "../entities/TeamMember.ts";
import TimeSlot from "../entities/TimeSlot.ts";
import Repository from "./_Repository.ts";

export default class TypicalAvailabilityRepository extends Repository {
  /**
   * Determines if a team member is typically available for a time slot
   * @param teamMember
   * @param timeSlot
   * @returns
   */
  public async isAvailable(
    teamMember: TeamMember,
    timeSlot: TimeSlot,
  ): Promise<"positive" | "negative" | "unknown"> {
    if (timeSlot.startDateTime == null || timeSlot.endDateTime == null) {
      return "unknown";
    }

    const result = await this.database.execute(
      `
        SELECT 1
        FROM TeamMemberTypicalAvailability
        WHERE teamMemberId = ?
          AND dayOfWeek = ?
          AND ? BETWEEN startTime AND endTime
          AND ? BETWEEN startTime AND endTime
      `,
      [
        teamMember.id,
        timeSlot.startDateTime?.getDay(),
        timeSlot.startTimeString,
        timeSlot.endTimeString,
      ],
    );

    if (result.rows && result.rows.length > 0) {
      return "positive";
    } else {
      return "negative";
    }
  }
}
