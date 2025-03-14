import TeamMember from "../entities/TeamMember.ts";
import TimeSlot from "../entities/TimeSlot.ts";
import Repository from "./_Repository.ts";

export default class UnavailabilityRepository extends Repository {
  /**
   * Determines if a team member has been marked as unavailable for a time slot
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
        FROM TeamMemberAvailability
        WHERE teamMemberId = ?
          AND (
            startDateTime BETWEEN ? AND ? OR
            endDateTime BETWEEN ? AND ?
          )
      `,
      [
        teamMember.id,
        timeSlot.startDateTime,
        timeSlot.endDateTime,
        timeSlot.startDateTime,
        timeSlot.endDateTime,
      ],
    );

    if (result.rows && result.rows.length > 0) {
      return "negative";
    } else {
      return "positive";
    }
  }
}
