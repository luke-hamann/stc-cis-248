import ShiftContext from "./ShiftContext.ts";
import ShiftContextNote from "./ShiftContextNote.ts";
import SubstituteList from "./SubstituteList.ts";
import TimeSlot from "./TimeSlot.ts";
import TimeSlotGroup from "./TimeSlotGroup.ts";
import TimeSlotPossibility from "./TimeSlotPossiblity.ts";

/** Represents a cell within a schedule table */
export type ScheduleCell =
  | { type: "origin"; content: null }
  | { type: "string"; content: string }
  | { type: "header"; content: string }
  | { type: "dateHeader"; content: Date }
  | { type: "ShiftContext"; content: ShiftContext }
  | { type: "ShiftContextNote"; content: ShiftContextNote }
  | { type: "TimeSlotGroup"; content: TimeSlotGroup }
  | { type: "TimeSlotPossibility"; content: TimeSlotPossibility }
  | { type: "TimeSlot"; content: TimeSlot }
  | { type: "SubstituteList"; content: SubstituteList };

/** Represents a row within a schedule table */
export type ScheduleRow = ScheduleCell[];

/** Represents a schedule table, a 2D array of schedule cells */
export type ScheduleTable = ScheduleRow[];

/** Represents a schedule */
export default class Schedule {
  /** The title of the schedule */
  public title: string;

  /** The start date of the schedule */
  public start: Date;

  /** The end date of the schedule */
  public end: Date;

  /** The schedule table of the schedule */
  public table: ScheduleTable;

  /** Constructs the schedule
   * @param title The title
   * @param start The start date
   * @param end The end date
   * @param table The schedule table
   */
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
