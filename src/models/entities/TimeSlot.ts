import BetterDate from "../../_dates/BetterDate.ts";
import Color from "./Color.ts";
import ShiftContext from "./ShiftContext.ts";
import TeamMember from "./TeamMember.ts";

/** Represents a schedule time slot */
export default class TimeSlot {
  /** The time slot id */
  public id: number;

  /** The id of the associated shift context */
  public shiftContextId: number;

  /** The associated shift context */
  public shiftContext: ShiftContext | null;

  /** The time slot's start date and time */
  public startDateTime: Date | null;

  /** The time slot's end date and time */
  public endDateTime: Date | null;

  /** Whether the time slot requires an adult assignee */
  public requiresAdult: boolean;

  /** The id of the associated team member */
  public teamMemberId: number | null;

  /** The associated team member */
  public teamMember: TeamMember | null;

  /** The time slot note */
  public note: string;

  /** The id of the color for the time slot note */
  public colorId: number | null;

  /** The color for the time slot note */
  public color: Color | null;

  /**
   * Constructs the time slot
   * @param id
   * @param shiftContextId
   * @param shiftContext
   * @param startDateTime
   * @param endDateTime
   * @param requiresAdult
   * @param teamMemberId
   * @param teamMember
   * @param note
   * @param colorId
   * @param color
   */
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

  /**
   * Constructs an empty time slot object with default values
   * @returns The time slot
   * @constructor
   */
  public static empty(): TimeSlot {
    return new TimeSlot(
      0,
      0,
      null,
      null,
      null,
      false,
      null,
      null,
      "",
      null,
      null,
    );
  }

  /** Gets the time slot's start date as a string in yyyy-mm-dd format */
  public get startDateString(): string {
    return this.startDateTime
      ? BetterDate.fromDate(this.startDateTime).toDateString()
      : "";
  }

  /** Gets the time slot's start time as a string in hh:mm format */
  public get startTimeString(): string {
    return this.startDateTime
      ? BetterDate.fromDate(this.startDateTime).toTimeString()
      : "";
  }

  /** Gets the time slot's end time as a string in hh:mm format */
  public get endTimeString(): string {
    return this.endDateTime
      ? BetterDate.fromDate(this.endDateTime).toTimeString()
      : "";
  }

  /**
   * Clones the current time slot and returns a new time slot
   * @returns The new time slot
   */
  public clone(): TimeSlot {
    return new TimeSlot(
      this.id,
      this.shiftContextId,
      null,
      this.startDateTime ? new Date(this.startDateTime) : null,
      this.endDateTime ? new Date(this.endDateTime) : null,
      this.requiresAdult,
      this.teamMemberId,
      null,
      this.note,
      this.colorId,
      null,
    );
  }
}
