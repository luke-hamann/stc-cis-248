import BetterDate from "../../_dates/BetterDate.ts";
import Color from "./Color.ts";
import ShiftContext from "./ShiftContext.ts";

export default class ShiftContextNote {
  public shiftContextId: number = 0;
  public shiftContext: ShiftContext | null = null;
  public date: Date | null = null;
  public note: string = "";
  public colorId: number | null;
  public color: Color | null = null;

  public constructor(
    shiftContextId: number,
    shiftContext: ShiftContext | null,
    date: Date | null,
    note: string,
    colorId: number | null,
    color: Color | null,
  ) {
    this.shiftContextId = shiftContextId;
    this.shiftContext = shiftContext;
    this.date = date;
    this.note = note;
    this.colorId = colorId;
    this.color = color;
  }
}
