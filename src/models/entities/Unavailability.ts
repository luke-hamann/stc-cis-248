import BetterDate from "../../_dates/BetterDate.ts";
import TeamMember from "./TeamMember.ts";

/** Represents a slot of a team member's unavailability */
export default class Unavailability {
  /** The unavailability's id */
  public id: number;

  /** The id of the associated team member */
  public teamMemberId: number;

  /** The associated team member */
  public teamMember: TeamMember | null;

  /** The start date and time of the unavailability slot */
  public startDateTime: Date | null;

  /** The end date and time of the unavailability slot */
  public endDateTime: Date | null;

  /** Whether the unavailability slot is preferable */
  public isPreference: boolean;

  /** Constructs the unavailability slot
   * @param id
   * @param teamMemberId
   * @param teamMember
   * @param startDateTime
   * @param endDateTime
   * @param isPreference
   */
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

  /** Constructs an unavailability slot with default values
   * @returns The unavailability
   * @constructor
   */
  public static empty(): Unavailability {
    return new Unavailability(0, 0, null, null, null, false);
  }

  /** Gets the unavailability's start date as a string in yyyy-mm-dd format */
  public get startDateString(): string {
    if (!this.startDateTime) return "";
    return BetterDate.fromDate(this.startDateTime).toDateString();
  }

  /** Gets the unavailability's start time as a string in 24-hour, hh:mm format */
  public get startTimeString(): string {
    if (!this.startDateTime) return "";
    return BetterDate.fromDate(this.startDateTime).toTimeString();
  }

  /** Gets the unavailability's end time as a string in 24-hour, hh:mm format */
  public get endTimeString(): string {
    if (!this.endDateTime) return "";
    return BetterDate.fromDate(this.endDateTime).toTimeString();
  }
}
