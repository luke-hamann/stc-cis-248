import Color from "./Color.ts";
import ShiftContext from "./ShiftContext.ts";

/** Represents a note for a shift context on a specific day */
export default class ShiftContextNote {
  /** The shift context id */
  public shiftContextId: number = 0;

  /** The associated shift context */
  public shiftContext: ShiftContext | null = null;

  /** The note's date */
  public date: Date | null = null;

  /** The note's content */
  public note: string = "";

  /** The color id */
  public colorId: number | null;

  /** The associated color */
  public color: Color | null = null;

  /**
   * Constructs the shift context
   * @param shiftContextId
   * @param shiftContext
   * @param date
   * @param note
   * @param colorId
   * @param color
   */
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

  /**
   * Construct a new shift context note by cloning the current one
   * @returns The new shift context note
   */
  public clone(): ShiftContextNote {
    return new ShiftContextNote(
      this.shiftContextId,
      null,
      this.date ? new Date(this.date) : null,
      this.note,
      this.colorId,
      null,
    );
  }
}
