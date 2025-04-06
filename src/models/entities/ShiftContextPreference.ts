import ShiftContext from "./ShiftContext.ts";
import TeamMember from "./TeamMember.ts";

/** Represents a shift context preference */
export default class ShiftContextPreference {
  /** The id of the associated team member */
  public teamMemberId: number = 0;

  /** The associated team member */
  public teamMember: TeamMember | null = null;

  /** The id of the associated shift context */
  public shiftContextId: number = 0;

  /** The associated shift context */
  public shiftContext: ShiftContext | null = null;

  /** Whether the team member prefers the shift context */
  public isPreferable: boolean = false;

  /** Constructs the shift context preference
   * @param teamMemberId
   * @param teamMember
   * @param shiftContextId
   * @param shiftContext
   * @param isPreferable
   */
  public constructor(
    teamMemberId: number,
    teamMember: TeamMember | null,
    shiftContextId: number,
    shiftContext: ShiftContext | null,
    isPreferable: boolean,
  ) {
    this.teamMemberId = teamMemberId;
    this.teamMember = teamMember;
    this.shiftContextId = shiftContextId;
    this.shiftContext = shiftContext;
    this.isPreferable = isPreferable;
  }
}
