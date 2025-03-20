export default class TimeSlotGroup {
  public shiftContextId: number;
  public windowStart: Date;
  public windowEnd: Date;
  public startTime: string;
  public endTime: string;
  public requiresAdult: boolean;

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
