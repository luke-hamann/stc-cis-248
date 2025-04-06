import TeamMember from "./TeamMember.ts";

const dayOfWeek = [0, 1, 2, 3, 4, 5, 6] as const;

/** Represents days of the week as integers
 *
 * * 0: Sunday
 * * 1: Monday
 * * 2: Tuesday
 * * 3: Wednesday
 * * 4: Thursday
 * * 5: Friday
 * * 6: Saturday
 */
export type DayOfWeek = (typeof dayOfWeek)[number];

/** Checks if a number can be interpreted as a day of the week */
// deno-lint-ignore no-explicit-any
export const isDayOfWeek = (x: any): x is DayOfWeek => dayOfWeek.includes(x);

/** Represents a slot of a team member's typical availability */
export default class TypicalAvailability {
  /** The typical availability's id */
  public id: number = 0;

  /** The id of the associated team member */
  public teamMemberId: number = 0;

  /** The associated team member */
  public teamMember: TeamMember | null = null;

  /** The day of the week of the availability */
  public dayOfWeek: DayOfWeek | null = null;

  /** The start time of the availability on the day */
  public startTime: Date | null = null;

  /** The end time of the availability on the day */
  public endTime: Date | null = null;

  /** Whether the availability is preferable */
  public isPreference: boolean = false;

  /** Constructs the typical availability
   * @param id
   * @param teamMemberId
   * @param teamMember
   * @param dayOfWeek
   * @param startTime
   * @param endTime
   * @param isPreference
   */
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
