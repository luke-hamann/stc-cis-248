import TeamMember from "./TeamMember.ts";

export type AssigneeRecommendationField =
  | "adult"
  | "available"
  | "prefers"
  | "conflict";

export type AssigneeRecommendationStatus =
  | "positive"
  | "negative"
  | "neutral"
  | "unknown";

export default class AssigneeRecommendations {
  public teamMember: TeamMember;
  public fields: Map<AssigneeRecommendationField, AssigneeRecommendationStatus>;

  public constructor(
    teamMember: TeamMember,
    fields: Map<AssigneeRecommendationField, AssigneeRecommendationStatus>,
  ) {
    this.teamMember = teamMember;
    this.fields = fields;
  }
}
