import BetterDate from "../../_dates/BetterDate.ts";
import TeamMember from "./TeamMember.ts";

export default class Unavailability {
  public id: number;
  public teamMemberId: number;
  public teamMember: TeamMember | null;
  public startDateTime: Date | null;
  public endDateTime: Date | null;
  public isPreference: boolean;

  public constructor(
    id: number,
    teamMemberId: number,
    teamMember: TeamMember | null,
    startDateTime: Date | null,
    endDateTime: Date | null,
    isPreference: boolean,
  ) {
    this.id = id;
    this.teamMemberId = teamMemberId;
    this.teamMember = teamMember;
    this.startDateTime = startDateTime;
    this.endDateTime = endDateTime;
    this.isPreference = isPreference;
  }

  public static empty(): Unavailability {
    return new Unavailability(0, 0, null, null, null, false);
  }

  public get startDateString(): string {
    if (!this.startDateTime) return "";
    return BetterDate.fromDate(this.startDateTime).toDateString();
  }

  public get startTimeString(): string {
    if (!this.startDateTime) return "";
    return BetterDate.fromDate(this.startDateTime).toTimeString();
  }

  public get endTimeString(): string {
    if (!this.endDateTime) return "";
    return BetterDate.fromDate(this.endDateTime).toTimeString();
  }
}
