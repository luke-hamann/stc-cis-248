import TeamMember from "./TeamMember.ts";

export default class Unavailability {
  private _id: number = 0;
  private _teamMemberId: number = 0;
  private _teamMember: TeamMember | null = null;
  private _startDateTime: Date | null = null;
  private _endDateTime: Date | null = null;
  private _isPreference: boolean = false;

  public constructor(
    id: number,
    teamMemberId: number,
    teamMember: TeamMember | null,
    startDateTime: Date | null,
    endDateTime: Date | null,
    isPreference: boolean,
  ) {
    this.id = id;
    this.teamMemberId = teamMemberId;
    this.teamMember = teamMember;
    this.startDateTime = startDateTime;
    this.endDateTime = endDateTime;
    this.isPreference = isPreference;
  }

  public get id(): number {
    return this._id;
  }

  public set id(value: number) {
    this._id = value;
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

  public get startDateTime(): Date | null {
    return this._startDateTime;
  }

  public set startDateTime(value: Date | null) {
    this._startDateTime = value;
  }

  public get endDateTime(): Date | null {
    return this._endDateTime;
  }

  public set endDateTime(value: Date | null) {
    this._endDateTime = value;
  }

  public get isPreference(): boolean {
    return this._isPreference;
  }

  public set isPreference(value: boolean) {
    this._isPreference = value;
  }
}
