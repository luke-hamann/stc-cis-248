import TeamMember from "../../entities/TeamMember.ts";
import TypicalAvailability from "../../entities/TypicalAvailability.ts";
import ViewModel from "../_shared/_ViewModel.ts";

/** A view model for listing a team member's typical availability */
export default class TypicalAvailabilityListViewModel extends ViewModel {
  /** The team member */
  public teamMember: TeamMember;

  /** A table of typical availability
   *
   * Each row corresponds to a day of the week, starting with Sunday and ending with Saturday
   */
  public typicalAvailabilityTable: TypicalAvailability[][];

  /** Constructs the view model
   * @param teamMember
   * @param typicalAvailabilities
   */
  public constructor(
    teamMember: TeamMember,
    typicalAvailabilities: TypicalAvailability[][],
  ) {
    super();
    this.teamMember = teamMember;
    this.typicalAvailabilityTable = typicalAvailabilities;
  }
}
