import TeamMember from "./TeamMember.ts";

export default class AssigneeRecommendations {
  public teamMember: TeamMember;
  public isAdult: "positive" | "negative" | "neutral" | "unknown";
  public isAvailable: "positive" | "negative" | "unknown";
  public prefersShiftContext: "positive" | "negative" | "neutral" | "unknown";
  public isConflicting: "positive" | "negative" | "unknown";

  public constructor(
    teamMember: TeamMember,
    isAdult: "positive" | "negative" | "neutral" | "unknown",
    isAvailable: "positive" | "negative" | "unknown",
    prefersShiftContext: "positive" | "negative" | "neutral" | "unknown",
    isConflicting: "positive" | "negative" | "unknown",
  ) {
    this.teamMember = teamMember;
    this.isAdult = isAdult;
    this.isAvailable = isAvailable;
    this.prefersShiftContext = prefersShiftContext;
    this.isConflicting = isConflicting;
  }
}
