import TeamMember from "../../entities/TeamMember.ts";
import TypicalAvailability from "../../entities/TypicalAvailability.ts";

export default class TypicalAvailabilityListViewModel {
  public teamMember: TeamMember;
  public typicalAvailabilityTable: TypicalAvailability[][];

  public constructor(
    teamMember: TeamMember,
    typicalAvailabilities: TypicalAvailability[][],
  ) {
    this.teamMember = teamMember;
    this.typicalAvailabilityTable = typicalAvailabilities;
  }
}
