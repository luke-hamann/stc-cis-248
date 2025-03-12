import ShiftContext from "./ShiftContext.ts";
import ShiftContextNote from "./ShiftContextNote.ts";
import SubstituteList from "./SubstituteList.ts";
import TimeSlot from "./TimeSlot.ts";

export type ScheduleCellType =
  | "string"
  | "header"
  | "dateHeader"
  | "ShiftContext"
  | "ShiftContextNote"
  | "SubstituteList";

export type ScheduleCellContent =
  | string
  | Date
  | ShiftContext
  | ShiftContextNote
  | TimeSlot
  | SubstituteList;

export class ScheduleCell {
  public type: ScheduleCellType;
  public content: ScheduleCellContent;

  constructor(type: ScheduleCellType, content: ScheduleCellContent) {
    this.type = type;
    this.content = content;
  }
}

export type ScheduleRow = ScheduleCell[];
export type ScheduleTable = ScheduleRow[];

export default class Schedule {
  public title: string;
  public start: Date;
  public end: Date;
  public table: ScheduleTable;

  public constructor(
    title: string,
    start: Date,
    end: Date,
    table: ScheduleTable,
  ) {
    this.title = title;
    this.start = start;
    this.end = end;
    this.table = table;
  }
}
