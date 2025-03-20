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

  public clone() {
    return new ShiftContextNote(
      this.shiftContextId,
      null,
      this.date ? new Date(this.date.getTime()) : null,
      this.note,
      this.colorId,
      null,
    );
  }

  public toString() {
    return this.note + " " + this.date;
  }
}
