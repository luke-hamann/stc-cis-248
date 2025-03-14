import TeamMember from "./TeamMember.ts";

export type FieldName = "adult" | "available" | "prefers" | "conflict";
export type FieldStatus = "positive" | "negative" | "neutral" | "unknown";

export default class Recommendation {
  public teamMember: TeamMember;
  public fields: Map<FieldName, FieldStatus>;

  public constructor(
    teamMember: TeamMember,
    fields: Map<FieldName, FieldStatus>,
  ) {
    this.teamMember = teamMember;
    this.fields = fields;
  }
}
