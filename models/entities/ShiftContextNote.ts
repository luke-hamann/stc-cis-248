import Color from "./Color.ts";
import ShiftContext from "./ShiftContext.ts";

export default class ShiftContextNote {
  private _shiftContextId: number = 0;
  private _shiftContext: ShiftContext | null = null;
  private _date: Date | null = null;
  private _note: string = "";
  private _colorId: number = 0;
  private _color: Color | null = null;

  public constructor(
    shiftContextId: number,
    shiftContext: ShiftContext | null,
    date: Date | null,
    note: string,
    colorId: number,
    color: Color | null,
  ) {
    this.shiftContextId = shiftContextId;
    this.shiftContext = shiftContext;
    this.date = date;
    this.note = note;
    this.colorId = colorId;
    this.color = color;
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

  public get date(): Date | null {
    return this._date;
  }

  public set date(value: Date | null) {
    this._date = value;
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
