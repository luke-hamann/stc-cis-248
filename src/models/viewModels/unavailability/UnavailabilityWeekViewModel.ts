import BetterDate from "../../../_dates/BetterDate.ts";
import TeamMember from "../../entities/TeamMember.ts";
import Unavailability from "../../entities/Unavailability.ts";

export default class UnavailabilityWeekViewModel {
  public teamMember: TeamMember;
  public startDate: Date;
  public endDate: Date;
  public unavailabilities: Unavailability[];

  public constructor(
    teamMember: TeamMember,
    startDate: Date,
    endDate: Date,
    unavailabilities: Unavailability[],
  ) {
    this.teamMember = teamMember;
    this.startDate = startDate;
    this.endDate = endDate;
    this.unavailabilities = unavailabilities;
  }

  public get previousWeekString(): string {
    return BetterDate.fromDate(this.startDate).addDays(-7).toDateString()
      .replaceAll("-", "/");
  }

  public get nextWeekString(): string {
    return BetterDate.fromDate(this.startDate).addDays(7).toDateString()
      .replaceAll("-", "/");
  }
}
