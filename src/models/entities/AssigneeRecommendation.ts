import TeamMember from "./TeamMember.ts";

/** Represents a recommendation status for if a team member should be assigned to a time slot */
export default class AssigneeRecommendations {
  /** The team member of the recommendation */
  public teamMember: TeamMember;

  /** Whether the team member's age conflicts with the time slot's age requirements */
  public isAdult: "positive" | "negative" | "neutral" | "unknown";

  /** Whether the team member is typically available during the time of the time slot */
  public isTypicallyAvailable: "positive" | "negative" | "unknown";

  /** Wheter the team member is not marked as unavailable during the time of the time slot */
  public isNotUnavailable: "positive" | "negative" | "unknown";

  /** Whether the team member prefers the shift context of the time slot */
  public prefersShiftContext: "positive" | "negative" | "neutral" | "unknown";

  /** Whether the team member is scheduled at the same time elsewhere */
  public isConflicting: "positive" | "negative" | "unknown";

  /**
   * Constructs the recommendation
   * @param teamMember The team member
   * @param isAdult The age check
   * @param isTypicallyAvailable The typical availability check
   * @param isNotUnavailable The unavailability check
   * @param prefersShiftContext The shift context preference check
   * @param isConflicting The conflicting time slot check
   */
  public constructor(
    teamMember: TeamMember,
    isAdult: "positive" | "negative" | "neutral" | "unknown",
    isTypicallyAvailable: "positive" | "negative" | "unknown",
    isNotUnavailable: "positive" | "negative" | "unknown",
    prefersShiftContext: "positive" | "negative" | "neutral" | "unknown",
    isConflicting: "positive" | "negative" | "unknown",
  ) {
    this.teamMember = teamMember;
    this.isAdult = isAdult;
    this.isTypicallyAvailable = isTypicallyAvailable;
    this.isNotUnavailable = isNotUnavailable;
    this.prefersShiftContext = prefersShiftContext;
    this.isConflicting = isConflicting;
  }
}
