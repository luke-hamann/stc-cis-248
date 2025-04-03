import TeamMember from "../../entities/TeamMember.ts";
import TypicalAvailability from "../../entities/TypicalAvailability.ts";
import ViewModel from "../_shared/_ViewModel.ts";

export default class TypicalAvailabilityListViewModel extends ViewModel {
  public teamMember: TeamMember;
  public typicalAvailabilityTable: TypicalAvailability[][];

  public constructor(
    teamMember: TeamMember,
    typicalAvailabilities: TypicalAvailability[][],
  ) {
    super();
    this.teamMember = teamMember;
    this.typicalAvailabilityTable = typicalAvailabilities;
  }
}
