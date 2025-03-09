import FormViewModel from "./_FormViewModel.ts";
import TeamMember from "../entities/TeamMember.ts";

export default class SubstitutesEditViewModel extends FormViewModel {
  public teamMembers: TeamMember[];
  public date: Date | null;
  public substitutesIds: number[];

  constructor(
    teamMembers: TeamMember[],
    date: Date | null,
    substituteIds: number[],
    csrf_token: string,
  ) {
    super(true, [], csrf_token);
    this.teamMembers = teamMembers;
    this.date = date;
    this.substitutesIds = substituteIds;
  }

  public get dateString(): string {
    return this.date?.toISOString().substring(0, 10) ?? "";
  }

  public static async fromRequest(request: Request): Promise<SubstitutesEditViewModel> {
    const formData = await request.formData();
    const substituteIds: number[] = [];

    for (const key of formData.keys()) {
      const teamMemberId = parseInt(key);
      if (isNaN(teamMemberId)) continue;
      substituteIds.push(teamMemberId);
    }

    return new SubstitutesEditViewModel([], null, substituteIds, "");
  }
}
