export default class TimeSlotPossibility {
  public shiftContextId: number;
  public startDateTime: Date;
  public endDateTime: Date;
  public requiresAdult: boolean;

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
