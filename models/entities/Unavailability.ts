import TeamMember from "./TeamMember.ts";

export default class Unavailability {
  public id: number = 0;
  public teamMemberId: number = 0;
  public teamMember: TeamMember | null = null;
  public startDateTime: Date | null = null;
  public endDateTime: Date | null = null;
  public isPreference: boolean = false;

  public constructor(
    id: number,
    teamMemberId: number,
    teamMember: TeamMember | null,
    startDateTime: Date | null,
    endDateTime: Date | null,
    isPreference: boolean,
  ) {
    this.id = id;
    this.teamMemberId = teamMemberId;
    this.teamMember = teamMember;
    this.startDateTime = startDateTime;
    this.endDateTime = endDateTime;
    this.isPreference = isPreference;
  }
}
