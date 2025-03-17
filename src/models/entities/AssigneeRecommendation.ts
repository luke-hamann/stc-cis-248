import TeamMember from "./TeamMember.ts";

export default class AssigneeRecommendations {
  public teamMember: TeamMember;
  public isAdult: "positive" | "negative" | "neutral" | "unknown";
  public isTypicallyAvailable: "positive" | "negative" | "unknown";
  public isNotUnavailable: "positive" | "negative" | "unknown";
  public prefersShiftContext: "positive" | "negative" | "neutral" | "unknown";
  public isConflicting: "positive" | "negative" | "unknown";

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
