import Color from "./Color.ts";
import ShiftContext from "./ShiftContext.ts";
import TeamMember from "./TeamMember.ts";

export default class TimeSlot {
  public id: number;
  public shiftContextId: number;
  public shiftContext: ShiftContext | null;
  public startDateTime: Date | null;
  public endDateTime: Date | null;
  public requiresAdult: boolean;
  public teamMemberId: number | null;
  public teamMember: TeamMember | null;
  public note: string;
  public colorId: number | null;
  public color: Color | null;

  public constructor(
    id: number,
    shiftContextId: number,
    shiftContext: ShiftContext | null,
    startDateTime: Date | null,
    endDateTime: Date | null,
    requiresAdult: boolean,
    teamMemberId: number | null,
    teamMember: TeamMember | null,
    note: string,
    colorId: number | null,
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

  public get startTimeString(): string {
    return this.startDateTime?.toISOString().substring(11, 16) ?? "";
  }

  public get endTimeString(): string {
    return this.endDateTime?.toISOString().substring(11, 16) ?? "";
  }
}
