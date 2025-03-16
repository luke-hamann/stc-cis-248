import ShiftContext from "./ShiftContext.ts";
import ShiftContextNote from "./ShiftContextNote.ts";
import SubstituteList from "./SubstituteList.ts";
import TimeSlot from "./TimeSlot.ts";
import TimeSlotGroup from "./TimeSlotGroup.ts";

export type ScheduleCell =
  | { type: "origin"; content: null }
  | { type: "string"; content: string }
  | { type: "header"; content: string }
  | { type: "dateHeader"; content: Date }
  | { type: "ShiftContext"; content: ShiftContext }
  | { type: "ShiftContextNote"; content: ShiftContextNote }
  | { type: "TimeSlotGroup"; content: TimeSlotGroup }
  | { type: "TimeSlot"; content: TimeSlot }
  | { type: "SubstituteList"; content: SubstituteList };

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
