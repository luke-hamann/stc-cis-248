/** Represents a group of time slots on the schedule
 *
 * A group is characterized by a unique combination of shift context, start time, end time, and age requirement.
 */
export default class TimeSlotGroup {
  /** The id of the associated shift context */
  public shiftContextId: number;

  /** The start date of the grouping */
  public windowStart: Date;

  /** The end date of the grouping */
  public windowEnd: Date;

  /** The start time of the grouping */
  public startTime: string;

  /** The end time of the grouping */
  public endTime: string;

  /** Whether the grouping requires an adult assignee */
  public requiresAdult: boolean;

  /** Constructs the time slot group
   * @param shiftContextId
   * @param windowStart
   * @param windowEnd
   * @param startTime
   * @param endTime
   * @param requiresAdult
   */
  public constructor(
    shiftContextId: number,
    windowStart: Date,
    windowEnd: Date,
    startTime: string,
    endTime: string,
    requiresAdult: boolean,
  ) {
    this.shiftContextId = shiftContextId;
    this.windowStart = windowStart;
    this.windowEnd = windowEnd;
    this.startTime = startTime;
    this.endTime = endTime;
    this.requiresAdult = requiresAdult;
  }
}
