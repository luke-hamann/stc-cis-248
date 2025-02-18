import Color from "./Color.ts";
import ShiftContext from "./ShiftContext.ts";
import TeamMember from "./TeamMember.ts";

export default class TimeSlot {
  public id: number = 0;
  public shiftContextId: number = 0;
  public shiftContext: ShiftContext | null = null;
  public startDateTime: Date | null = null;
  public endDateTime: Date | null = null;
  public requiresAdult: boolean = false;
  public teamMemberId: number = 0;
  public teamMember: TeamMember | null = null;
  public note: string = "";
  public colorId: number = 0;
  public color: Color | null = null;

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
}
