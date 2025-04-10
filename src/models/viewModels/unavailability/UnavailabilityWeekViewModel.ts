import BetterDate from "../../../_dates/BetterDate.ts";
import TeamMember from "../../entities/TeamMember.ts";
import Unavailability from "../../entities/Unavailability.ts";
import ViewModel from "../_shared/_ViewModel.ts";

/** A view model for listing a week of a team member's unavailability */
export default class UnavailabilityWeekViewModel extends ViewModel {
  /** The team member the unavailability is for */
  public teamMember: TeamMember;

  /** The start date of the range of unavailability */
  public startDate: Date;

  /** The end date of the range of unavailability */
  public endDate: Date;

  /** A table of unavailabilities, grouped and ordered by dates within the week
   */
  public table: { date: Date; unavailabilities: Unavailability[] }[];

  /** Constructs the view model
   * @param teamMember
   * @param startDate
   * @param endDate
   * @param table
   */
  public constructor(
    teamMember: TeamMember,
    startDate: Date,
    endDate: Date,
    table: { date: Date; unavailabilities: Unavailability[] }[],
  ) {
    super();
    this.teamMember = teamMember;
    this.startDate = startDate;
    this.endDate = endDate;
    this.table = table;
  }

  /** Gets the first day of the prior week as a string in yyyy/mm/dd format */
  public get previousWeekString(): string {
    return BetterDate.fromDate(this.startDate).addDays(-7).toDateString("/");
  }

  /** Gets the first day of the next week as a string in yyyy/mm/dd format */
  public get nextWeekString(): string {
    return BetterDate.fromDate(this.startDate).addDays(7).toDateString("/");
  }
}
