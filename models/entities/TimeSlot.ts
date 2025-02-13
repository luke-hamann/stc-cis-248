import Color from "./Color.ts";
import ShiftContext from "./ShiftContext.ts";
import TeamMember from "./TeamMember.ts";

export default class TimeSlot {
  private _id: number = 0;
  private _shiftContextId: number = 0;
  private _shiftContext: ShiftContext | null = null;
  private _startDateTime: Date | null = null;
  private _endDateTime: Date | null = null;
  private _requiresAdult: boolean = false;
  private _teamMemberId: number = 0;
  private _teamMember: TeamMember | null = null;
  private _note: string = "";
  private _colorId: number = 0;
  private _color: Color | null = null;

  public constructor(
    id: number,
    shiftContextId: number,
    shiftContext: ShiftContext | null,
    startDateTime: Date | null,
    endDateTime: Date | null,
    requiresAdult: boolean,
    teamMemberId: number,
    teamMember: TeamMember | null,
    note: string,
    colorId: number,
    color: Color | null,
  ) {
    this.id = id;
    this.shiftContextId = shiftContextId;
    this.shiftContext = shiftContext;
    this.startDateTime = startDateTime;
    this.endDateTime = endDateTime;
    this.requiresAdult = requiresAdult;
    this.teamMemberId = teamMemberId;
    this.teamMember = teamMember;
    this.note = note;
    this.colorId = colorId;
    this.color = color;
  }

  public get id(): number {
    return this._id;
  }

  public set id(value: number) {
    this._id = value;
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

  public get requiresAdult(): boolean {
    return this._requiresAdult;
  }

  public set requiresAdult(value: boolean) {
    this._requiresAdult = value;
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

  public get note(): string {
    return this._note;
  }

  public set note(value: string) {
    this._note = value;
  }

  public get colorId(): number {
    return this._colorId;
  }

  public set colorId(value: number) {
    this._colorId = value;
  }

  public get color(): Color | null {
    return this._color;
  }

  public set color(value: Color | null) {
    this._color = value;
  }
}
