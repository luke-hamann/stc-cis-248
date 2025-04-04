/**
 * Represents settings for the possible creation of a time slot
 *
 * These are created when a time slot in a unique grouping exists on a different date during the week
 * but a cooresponding time slot in that grouping does not exist on the current day being inspected.
 * This allows for schedule cells without time slots to be populated with a button for autofilling the time slot add form.
 */
export default class TimeSlotPossibility {
  /** The id of the associated shift context */
  public shiftContextId: number;

  /** The start date and time of the possible time slot */
  public startDateTime: Date;

  /** The end date and time of the possible time slot */
  public endDateTime: Date;

  /** Whether the possible time slot is predicted to require an adult assignee */
  public requiresAdult: boolean;

  /**
   * Constructs the time slot possibility
   * @param shiftContextId
   * @param startDateTime
   * @param endDateTime
   * @param requiresAdult
   */
  public constructor(
    shiftContextId: number,
    startDateTime: Date,
    endDateTime: Date,
    requiresAdult: boolean,
  ) {
    this.shiftContextId = shiftContextId;
    this.startDateTime = startDateTime;
    this.endDateTime = endDateTime;
    this.requiresAdult = requiresAdult;
  }
}
