import TeamMember from "../../entities/TeamMember.ts";
import CalendarViewPartial from "../_shared/CalendarViewPartial.ts";
import ViewModel from "../_shared/_ViewModel.ts";

/** A view model for the unavailability calendar year view */
export default class UnavailabilityYearViewModel extends ViewModel {
  /** The team member the unavailability is for */
  public teamMember: TeamMember;

  /** The model for rendering the calendar */
  public calendar: CalendarViewPartial;

  /** Constructs the view model
   * @param teamMember
   * @param calendar
   */
  public constructor(
    teamMember: TeamMember,
    calendar: CalendarViewPartial,
  ) {
    super();
    this.teamMember = teamMember;
    this.calendar = calendar;
  }
}
