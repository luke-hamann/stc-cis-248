import TeamMember from "./TeamMember.ts";

export default class TypicalAvailability {
  private _id: number = 0;
  private _teamMemberId: number = 0;
  private _teamMember: TeamMember | null = null;
  private _dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6 | null = null;
  private _startTime: Date | null = null;
  private _endTime: Date | null = null;
  private _isPreference: boolean = false;

  public constructor(
    id: number,
    teamMemberId: number,
    teamMember: TeamMember | null,
    dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6 | null,
    startTime: Date | null,
    endTime: Date | null,
    isPreference: boolean,
  ) {
    this.id = id;
    this.teamMemberId = teamMemberId;
    this.teamMember = teamMember;
    this.dayOfWeek = dayOfWeek;
    this.startTime = startTime;
    this.endTime = endTime;
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

  public get isPreference(): boolean {
    return this._isPreference;
  }

  public set isPreference(value: boolean) {
    this._isPreference = value;
  }

  public get endTime(): Date | null {
    return this._endTime;
  }

  public set endTime(value: Date | null) {
    this._endTime = value;
  }

  public get startTime(): Date | null {
    return this._startTime;
  }

  public set startTime(value: Date | null) {
    this._startTime = value;
  }

  public get dayOfWeek(): 0 | 1 | 2 | 3 | 4 | 5 | 6 | null {
    return this._dayOfWeek;
  }

  public set dayOfWeek(value: 0 | 1 | 2 | 3 | 4 | 5 | 6 | null) {
    this._dayOfWeek = value;
  }
}
