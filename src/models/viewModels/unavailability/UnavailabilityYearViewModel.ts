import TeamMember from "../../entities/TeamMember.ts";
import CalendarViewPartial from "../_shared/CalendarViewPartial.ts";

export default class UnavailabilityYearViewModel {
  public teamMember: TeamMember;
  public calendar: CalendarViewPartial;
  public csrf_token: string;

  public constructor(
    teamMember: TeamMember,
    calendar: CalendarViewPartial,
    csrf_token: string,
  ) {
    this.teamMember = teamMember;
    this.calendar = calendar;
    this.csrf_token = csrf_token;
  }
}
