import ShiftContext from "./ShiftContext.ts";
import TeamMember from "./TeamMember.ts";

export default class ShiftContextPreference {
  public teamMemberId: number = 0;
  public teamMember: TeamMember | null = null;
  public shiftContextId: number = 0;
  public shiftContext: ShiftContext | null = null;

  public constructor(
    teamMemberId: number,
    teamMember: TeamMember | null,
    shiftContextId: number,
    shiftContext: ShiftContext | null,
  ) {
    this.teamMemberId = teamMemberId;
    this.teamMember = teamMember;
    this.shiftContextId = shiftContextId;
    this.shiftContext = shiftContext;
  }
}
