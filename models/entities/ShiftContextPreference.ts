import ShiftContext from "./ShiftContext.ts";
import TeamMember from "./TeamMember.ts";

export default class ShiftContextPreference {
  private _teamMemberId: number = 0;
  private _teamMember: TeamMember | null = null;
  private _shiftContextId: number = 0;
  private _shiftContext: ShiftContext | null = null;

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

  public get teamMemberId(): number {
    return this._teamMemberId;
  }

  public set teamMemberId(value: number) {
    this._teamMemberId = value;
  }

  public get teamMember(): TeamMember | null {
    return this._teamMember;
  }

  public set teamMember(value: TeamMember | null) {
    this._teamMember = value;
  }

  public get shiftContextId(): number {
    return this._shiftContextId;
  }

  public set shiftContextId(value: number) {
    this._shiftContextId = value;
  }

  public get shiftContext(): ShiftContext | null {
    return this._shiftContext;
  }

  public set shiftContext(value: ShiftContext | null) {
    this._shiftContext = value;
  }
}
