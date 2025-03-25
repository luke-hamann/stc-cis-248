import TeamMember from "../../entities/TeamMember.ts";
import TypicalAvailability from "../../entities/TypicalAvailability.ts";
import IViewModel from "../_shared/IViewModel.ts";

export default class TypicalAvailabilityListViewModel implements IViewModel {
  public csrf_token: string = "";
  public teamMember: TeamMember;
  public typicalAvailabilityTable: TypicalAvailability[][];

  public constructor(
    teamMember: TeamMember,
    typicalAvailabilities: TypicalAvailability[][]
  ) {
    this.teamMember = teamMember;
    this.typicalAvailabilityTable = typicalAvailabilities;
  }
}
