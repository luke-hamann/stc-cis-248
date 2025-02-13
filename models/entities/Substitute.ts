import TeamMember from "./TeamMember.ts";

export default class Substitute {
  private _teamMemberId: number = 0;
  private _teamMember: TeamMember | null = null;
  private _date: Date | null = null;

  public constructor(
    teamMemberId: number,
    teamMember: TeamMember | null,
    date: Date | null,
  ) {
    this.teamMemberId = teamMemberId;
    this.teamMember = teamMember;
    this.date = date;
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

  public get date(): Date | null {
    return this._date;
  }

  public set date(value: Date | null) {
    this._date = value;
  }
}
