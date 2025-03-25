import BetterDate from "../../../_dates/BetterDate.ts";
import TeamMember from "../../entities/TeamMember.ts";
import Unavailability from "../../entities/Unavailability.ts";
import IViewModel from "../_shared/IViewModel.ts";

export default class UnavailabilityWeekViewModel implements IViewModel {
  public csrf_token: string;
  public teamMember: TeamMember;
  public startDate: Date;
  public endDate: Date;
  public table: { date: Date; unavailabilities: Unavailability[] }[];

  public constructor(
    teamMember: TeamMember,
    startDate: Date,
    endDate: Date,
    table: { date: Date; unavailabilities: Unavailability[] }[],
    csrf_token: string
  ) {
    this.teamMember = teamMember;
    this.startDate = startDate;
    this.endDate = endDate;
    this.table = table;
    this.csrf_token = csrf_token;
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
