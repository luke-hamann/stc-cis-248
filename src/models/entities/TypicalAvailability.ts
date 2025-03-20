import TeamMember from "./TeamMember.ts";

const dayOfWeek = [0, 1, 2, 3, 4, 5, 6] as const;
export type DayOfWeek = (typeof dayOfWeek)[number];
// deno-lint-ignore no-explicit-any
export const isDayOfWeek = (x: any): x is DayOfWeek => dayOfWeek.includes(x);

export default class TypicalAvailability {
  public id: number = 0;
  public teamMemberId: number = 0;
  public teamMember: TeamMember | null = null;
  public dayOfWeek: DayOfWeek | null = null;
  public startTime: Date | null = null;
  public endTime: Date | null = null;
  public isPreference: boolean = false;

  public constructor(
    id: number,
    teamMemberId: number,
    teamMember: TeamMember | null,
    dayOfWeek: DayOfWeek | null,
    startTime: Date | null,
    endTime: Date | null,
    isPreference: boolean,
  ) {
    this.id = id;
    this.teamMemberId = teamMemberId;
    this.teamMember = teamMember;
    this.dayOfWeek = dayOfWeek;
    this.startTime = startTime;
    this.endTime = endTime;
    this.isPreference = isPreference;
  }
}
