import TeamMember from "../entities/TeamMember.ts";
import FormViewModel from "./_FormViewModel.ts";

export class SubstitutesEditViewModel extends FormViewModel {
  public teamMembers: TeamMember[];
  public date: Date;
  public substitutesIds: number[];

  constructor(
    teamMembers: TeamMember[],
    date: Date,
    substituteIds: number[],
    csrf_token: string,
  ) {
    super(true, [], csrf_token);
    this.teamMembers = teamMembers;
    this.date = date;
    this.substitutesIds = substituteIds;
  }
}
