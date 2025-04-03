import TeamMember from "../../entities/TeamMember.ts";
import CalendarViewPartial from "../_shared/CalendarViewPartial.ts";
import ViewModel from "../_shared/_ViewModel.ts";

export default class UnavailabilityYearViewModel extends ViewModel {
  public teamMember: TeamMember;
  public calendar: CalendarViewPartial;

  public constructor(
    teamMember: TeamMember,
    calendar: CalendarViewPartial,
  ) {
    super();
    this.teamMember = teamMember;
    this.calendar = calendar;
  }
}
