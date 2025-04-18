import DateLib from "../../_dates/DateLib.ts";
import Schedule, {
  ScheduleCell,
  ScheduleRow,
  ScheduleTable,
} from "../entities/Schedule.ts";
import ShiftContextNote from "../entities/ShiftContextNote.ts";
import ShiftContextNoteRepository from "./ShiftContextNoteRepository.ts";
import ShiftContextRepository from "./ShiftContextRepository.ts";
import SubstituteRepository from "./SubstituteRepository.ts";
import TimeSlot from "../entities/TimeSlot.ts";
import TimeSlotRepository from "./TimeSlotRepository.ts";
import TeamMemberRepository from "./TeamMemberRepository.ts";
import AssigneeRecommendations from "../entities/AssigneeRecommendation.ts";
import TypicalAvailabilityRepository from "./TypicalAvailabilityRepository.ts";
import UnavailabilityRepository from "./UnavailabilityRepository.ts";
import ShiftContextPreferenceRepository from "./ShiftContextPreferenceRepository.ts";
import TeamMember from "../entities/TeamMember.ts";
import ShiftContext from "../entities/ShiftContext.ts";
import Database from "./_Database.ts";
import TimeSlotPossibility from "../entities/TimeSlotPossibility.ts";
import ScheduleWarnings from "../entities/ScheduleWarnings.ts";

/** Represents a repository for compiling schedule information */
export interface IScheduleRepository {
  /** Compiles all necessary data and computes a schedule for a given date range
   * @param start The start date
   * @param end The end date
   * @returns The schedule
   */
  getSchedule(start: Date, end: Date): Promise<Schedule>;

  /** Gets assignee recommendations for a given time slot
   * @param timeSlot The time slot
   * @returns A list of recommendations
   */
  getRecommendations(timeSlot: TimeSlot): Promise<AssigneeRecommendations[]>;

  /** Gets schedule warnings for the specified date range
   * @param start The start date
   * @param end The end range
   * @returns The schedule warnings
   */
  getWarnings(start: Date, end: Date): Promise<ScheduleWarnings>;
}

/** Represents a time slot database row */
export interface ITimeSlotRowComponent {
  /** The time slot id */
  timeSlotId: number;

  /** The id of the related shift context */
  timeSlotShiftContextId: number;

  /** The start date and time of the time slot */
  timeSlotStartDateTime: Date;

  /** The end date and time of the time slot */
  timeSlotEndDateTime: Date;

  /** Whether the time slot requires an adult
   *
   * 0 is false, 1 is true.
   */
  timeSlotRequiresAdult: number;

  /** The id of the related team member */
  timeSlotTeamMemberId: number;

  /** The note on the time slot */
  timeSlotNote: string;

  /** The id of the related color for the note */
  timeSlotColorId: number;
}

/** Represents a team member database row */
export interface ITeamMemberRowComponent {
  /** The team member id */
  teamMemberId: number;

  /** The team member's first name */
  teamMemberFirstName: string;

  /** The team member's middle name */
  teamMemberMiddleName: string;

  /** The team member's last name */
  teamMemberLastName: string;

  /** The team member's birth date */
  teamMemberBirthDate: Date;

  /** The team member's email address */
  teamMemberEmail: string;

  /** The team member's phone number */
  teamMemberPhone: string;

  /** Whether the team member is an external resource
   *
   * 0 is false, 1 is true.
   */
  teamMemberIsExternal: number;

  /** The maximum number of hours per week the team member can work */
  teamMemberMaxWeeklyHours: number;

  /** The maximum number of days per week the team member can work */
  teamMemberMaxWeeklyDays: number;

  /** The team member's user name */
  teamMemberUsername: string;

  /** The team member's password */
  teamMemberPassword: string;

  /** Whether the team member is an admin user
   *
   * 0 is false, 1 is true.
   */
  teamMemberIsAdmin: number;
}

/** Represents a shift context database row */
export interface IShiftContextRowComponent {
  /** The id of the shift context */
  shiftContextId: number;

  /** The name of the shift context */
  shiftContextName: string;

  /** The age group of the shift context */
  shiftContextAgeGroup: string;

  /** The location of the shift context */
  shiftContextLocation: string;

  /** The description of the shift context */
  shiftContextDescription: string;

  /** The sort priority index of the shift context */
  shiftContextSortPriority: number;
}

/** Represents a database row containing a time slot and a team member */
export interface ITimeSlotTeamMemberRow
  extends ITimeSlotRowComponent, ITeamMemberRowComponent {}

/** Represents a database row containing a time slot, a team member, and a shift context */
export interface ITimeSlotTeamMemberShiftContextRow
  extends
    ITimeSlotRowComponent,
    ITeamMemberRowComponent,
    IShiftContextRowComponent {}

/** Represents a database row containing 2 time slots */
export interface ITeamMemberTimeSlotTimeSlotRow
  extends ITeamMemberRowComponent {
  /** The id of the first time slot */
  timeSlot1Id: number;

  /** The id of the shift context associated with the first time slot */
  timeSlot1ShiftContextId: number;

  /** The start date and time of the first time slot */
  timeSlot1StartDateTime: Date;

  /** The end date and time of the first time slot */
  timeSlot1EndDateTime: Date | null;

  /** Whether the first time slot requires an adult
   *
   * 0 is false, 1 is true.
   */
  timeSlot1RequiresAdult: number;

  /** The id of the team member associated with the first time slot */
  timeSlot1TeamMemberId: number | null;

  /** The note on the first time slot */
  timeSlot1Note: string;

  /** The id of the color associated with the note on the first time slot */
  timeSlot1ColorId: number | null;

  /** The id of the second time slot */
  timeSlot2Id: number;

  /** The id of the shift context associated with the second time slot */
  timeSlot2ShiftContextId: number;

  /** The start date and time of the second time slot */
  timeSlot2StartDateTime: Date;

  /** The end date and time of the second time slot */
  timeSlot2EndDateTime: Date | null;

  /** Whether the second time slot requires an adult
   *
   * 0 is false, 1 is true.
   */
  timeSlot2RequiresAdult: number;

  /** The id of the team member associated with the second time slot */
  timeSlot2TeamMemberId: number | null;

  /** The note on the second time slot */
  timeSlot2Note: string;

  /** The id of the color associated with the note on the second time slot */
  timeSlot2ColorId: number | null;
}

/** Represents a database row for a max weekly work days violation on a team member */
export interface IMaxWeeklyDaysViolationRow extends ITeamMemberRowComponent {
  /** How many days during the week the team member is scheduled to work */
  workDays: number;
}

/** Represents a database row for a max weekly work hours violation on a team member */
export interface IMaxWeeklyHoursViolationRow extends ITeamMemberRowComponent {
  /** How many hours during the week the team member is scheduled to work */
  totalHours: number;
}

/** Represents a data source of aggregating schedule information */
export default class ScheduleRepository implements IScheduleRepository {
  /** The database connection */
  private _database: Database;

  /** The shift context repository */
  private _shiftContexts: ShiftContextRepository;

  /** The shift context notes repository */
  private _shiftContextNotes: ShiftContextNoteRepository;

  /** The shift context preferences repository */
  private _shiftContextPreferences: ShiftContextPreferenceRepository;

  /** The substitutes repository */
  private _substitutes: SubstituteRepository;

  /** The team members repository */
  private _teamMembers: TeamMemberRepository;

  /** The time slots repository */
  private _timeSlots: TimeSlotRepository;

  /** The typical availability repository */
  private _typicalAvailability: TypicalAvailabilityRepository;

  /** The unavailability repository */
  private _unavailability: UnavailabilityRepository;

  /** Constructs the schedule repository given a database connection and the necessary entity repositories
   * @param database
   * @param shiftContexts
   * @param shiftContextNotes
   * @param shiftContextPreferences
   * @param substitutes
   * @param teamMembers
   * @param timeSlots
   * @param typicalAvailability
   * @param unavailability
   */
  constructor(
    database: Database,
    shiftContexts: ShiftContextRepository,
    shiftContextNotes: ShiftContextNoteRepository,
    shiftContextPreferences: ShiftContextPreferenceRepository,
    substitutes: SubstituteRepository,
    teamMembers: TeamMemberRepository,
    timeSlots: TimeSlotRepository,
    typicalAvailability: TypicalAvailabilityRepository,
    unavailability: UnavailabilityRepository,
  ) {
    this._database = database;
    this._shiftContexts = shiftContexts;
    this._shiftContextNotes = shiftContextNotes;
    this._shiftContextPreferences = shiftContextPreferences;
    this._substitutes = substitutes;
    this._teamMembers = teamMembers;
    this._timeSlots = timeSlots;
    this._typicalAvailability = typicalAvailability;
    this._unavailability = unavailability;
  }

  /** A generic SQL fragment for fetching time slot columns */
  private readonly timeSlotColumnsSql = `
    TimeSlots.id              timeSlotId,
    TimeSlots.shiftContextId  timeSlotShiftContextId,
    TimeSlots.startDateTime   timeSlotStartDateTime,
    TimeSlots.endDateTime     timeSlotEndDateTime,
    TimeSlots.requiresAdult   timeSlotRequiresAdult,
    TimeSlots.teamMemberId    timeSlotTeamMemberId,
    TimeSlots.note            timeSlotNote,
    TimeSlots.colorId         timeSlotColorId
  `;

  /** Converts a database row to a time slot
   * @param row The database row
   * @returns The time slot
   */
  private mapTimeSlotColumns(row: ITimeSlotRowComponent): TimeSlot {
    return new TimeSlot(
      row.timeSlotId,
      row.timeSlotShiftContextId,
      null,
      row.timeSlotStartDateTime,
      row.timeSlotEndDateTime,
      row.timeSlotRequiresAdult == 1,
      row.timeSlotTeamMemberId,
      null,
      row.timeSlotNote,
      row.timeSlotColorId,
      null,
    );
  }

  /** A generic SQL fragment for fetching team member columns */
  private readonly teamMemberColumnsSql = `
    TeamMembers.id              teamMemberId,
    TeamMembers.firstName       teamMemberFirstName,
    TeamMembers.middleName      teamMemberMiddleName,
    TeamMembers.lastName        teamMemberLastName,
    TeamMembers.birthDate       teamMemberBirthDate,
    TeamMembers.email           teamMemberEmail,
    TeamMembers.phone           teamMemberPhone,
    TeamMembers.isExternal      teamMemberIsExternal,
    TeamMembers.maxWeeklyHours  teamMemberMaxWeeklyHours,
    TeamMembers.maxWeeklyDays   teamMemberMaxWeeklyDays,
    TeamMembers.username        teamMemberUsername,
    TeamMembers.password        teamMemberPassword,
    TeamMembers.isAdmin         teamMemberIsAdmin
  `;

  /** Converts a database row to a team member
   * @param row The database row
   * @returns The team member
   */
  private mapTeamMemberColumns(row: ITeamMemberRowComponent) {
    return new TeamMember(
      row.teamMemberId,
      row.teamMemberFirstName,
      row.teamMemberMiddleName,
      row.teamMemberLastName,
      row.teamMemberBirthDate,
      row.teamMemberEmail,
      row.teamMemberPhone,
      row.teamMemberIsExternal == 1,
      row.teamMemberMaxWeeklyHours,
      row.teamMemberMaxWeeklyDays,
      row.teamMemberUsername,
      row.teamMemberPassword,
      row.teamMemberIsAdmin == 1,
    );
  }

  /** A generic SQL query for fetching shift context columns */
  private readonly shiftContextColumnsSql = `
    ShiftContexts.id           shiftContextId,
    ShiftContexts.name         shiftContextName,
    ShiftContexts.location     shiftContextLocation,
    ShiftContexts.description  shiftContextDescription,
    ShiftContexts.sortPriority  shiftContextSortPriority
  `;

  /** Converts a database row to a shift context
   * @param row The database row
   * @returns The shift context
   */
  private mapShiftContextColumns(row: IShiftContextRowComponent) {
    return new ShiftContext(
      row.shiftContextId,
      row.shiftContextName,
      row.shiftContextAgeGroup,
      row.shiftContextLocation,
      row.shiftContextDescription,
      row.shiftContextSortPriority,
    );
  }

  /** A SQL query for joining the time slot and team member tables */
  private readonly timeSlotTeamMemberQuery = `
    SELECT
    ${this.timeSlotColumnsSql},
    ${this.teamMemberColumnsSql}
    FROM TimeSlots
      JOIN TeamMembers
        ON TimeSlots.teamMemberId = TeamMembers.id
  `;

  /** Compiles all necessary data and computes a schedule for a given date range
   * @param start The start date
   * @param end The end date
   * @returns The schedule
   */
  public async getSchedule(start: Date, end: Date): Promise<Schedule> {
    const scheduleTable: ScheduleTable = [];
    const dateList = DateLib.getDatesInRange(start, end);

    // column headers
    scheduleTable.push([
      { type: "origin", content: null },
      ...dateList.map((
        date,
      ) => ({ type: "dateHeader", content: date } as ScheduleCell)),
    ]);

    const shiftContexts = await this._shiftContexts.list();
    for (const shiftContext of shiftContexts) {
      // Shift context header cell
      const row: ScheduleRow = [{
        type: "ShiftContext",
        content: shiftContext,
      }];

      // Shift context note cells
      for (const date of dateList) {
        let shiftContextNote = await this._shiftContextNotes.get(
          shiftContext.id,
          date,
        );

        if (shiftContextNote == null) {
          shiftContextNote = new ShiftContextNote(
            shiftContext.id,
            null,
            date,
            "",
            null,
            null,
          );
        }

        const cell: ScheduleCell = {
          type: "ShiftContextNote",
          content: shiftContextNote,
        };
        row.push(cell);
      }

      // Push shift context header row
      scheduleTable.push(row);

      // Time slot groups under shift context
      const groups = await this._timeSlots.getByGroups(
        shiftContext.id,
        start,
        end,
      );
      for (const group of groups) {
        const timeSlotGroup = group.timeSlotGroup;
        const timeSlotsByDay = group.timeSlotsByDay as (TimeSlot | null)[][];

        const rowCount = timeSlotsByDay.length;
        const colCount = Math.max(
          ...timeSlotsByDay.map((array) => array.length),
        );

        // fill the array with nulls to convert it from jagged to rectangular
        for (let i = 0; i < rowCount; i++) {
          while (timeSlotsByDay[i].length < colCount) {
            timeSlotsByDay[i].push(null);
          }
        }

        // build a new array to transpose the old one into
        const targetArray: (ScheduleCell | null)[][] = [];
        for (let i = 0; i < colCount; i++) {
          const row: (ScheduleCell | null)[] = [];
          for (let j = 0; j < rowCount; j++) {
            row.push(null);
          }
          targetArray.push(row);
        }

        // transpose old array into new array
        for (let rowNum = 0; rowNum < rowCount; rowNum++) {
          for (let colNum = 0; colNum < colCount; colNum++) {
            const timeSlot = timeSlotsByDay[rowNum][colNum];

            let newCell: ScheduleCell;

            if (timeSlot) {
              newCell = { type: "TimeSlot", content: timeSlot };
            } else {
              const startDateTime = new Date(dateList[rowNum]);
              startDateTime.setHours(
                Number(timeSlotGroup.startTime.substring(0, 2)),
              );
              startDateTime.setMinutes(
                Number(timeSlotGroup.startTime.substring(3, 5)),
              );

              const endDateTime = new Date(dateList[rowNum]);
              endDateTime.setHours(
                Number(timeSlotGroup.endTime.substring(0, 2)),
              );
              endDateTime.setMinutes(
                Number(timeSlotGroup.endTime.substring(3, 5)),
              );

              const timeSlotPossibility = new TimeSlotPossibility(
                timeSlotGroup.shiftContextId,
                startDateTime,
                endDateTime,
                timeSlotGroup.requiresAdult,
              );

              newCell = {
                type: "TimeSlotPossibility",
                content: timeSlotPossibility,
              };
            }

            // Swapped row and column to transpose array
            targetArray[colNum][rowNum] = newCell;
          }
        }

        // Insert header cell at start of each row
        for (let i = 0; i < targetArray.length; i++) {
          targetArray[i].unshift(
            { type: "TimeSlotGroup", content: timeSlotGroup },
          );
        }

        scheduleTable.push(...(targetArray as ScheduleTable));
      }
    }

    // Substitutes row
    const substitutesRow: ScheduleRow = [{
      type: "header",
      content: "Substitutes",
    }];
    for (const date of dateList) {
      const substituteList = await this._substitutes.getSubstituteList(date);
      const cell: ScheduleCell = {
        type: "SubstituteList",
        content: substituteList,
      };
      substitutesRow.push(cell);
    }
    scheduleTable.push(substitutesRow);

    return new Schedule("", start, end, scheduleTable);
  }

  /** Gets assignee recommendations for a given time slot
   * @param timeSlot The time slot
   * @returns A list of recommendations
   */
  public async getRecommendations(
    timeSlot: TimeSlot,
  ): Promise<AssigneeRecommendations[]> {
    const teamMembers = await this._teamMembers.list();

    const recommendations: AssigneeRecommendations[] = [];
    for (const teamMember of teamMembers) {
      const recommendation = new AssigneeRecommendations(
        teamMember,
        "unknown",
        "unknown",
        "unknown",
        "unknown",
        "unknown",
      );

      // Age restriction

      if (!timeSlot.requiresAdult) {
        recommendation.isAdult = "neutral";
      } else if (
        teamMember.birthDate == null || timeSlot.startDateTime == null
      ) {
        recommendation.isAdult = "unknown";
      } else {
        const age = DateLib.getAge(
          teamMember.birthDate,
          timeSlot.startDateTime,
        );
        recommendation.isAdult = age >= 18 ? "positive" : "negative";
      }

      // Typical availability

      recommendation.isTypicallyAvailable = await this._typicalAvailability
        .isAvailable(
          teamMember,
          timeSlot,
        );

      // Unavailability

      recommendation.isNotUnavailable = await this._unavailability.isAvailable(
        teamMember,
        timeSlot,
      );

      // Shift context preference

      const preference = await this._shiftContextPreferences.getPreference(
        teamMember.id,
        timeSlot.shiftContextId,
      );
      recommendation.prefersShiftContext = preference;

      // Scheduling conflicts

      const hasConflict = await this._timeSlots.hasNoConflicts(
        teamMember.id,
        timeSlot,
      );
      recommendation.isConflicting = hasConflict;

      // Add the recommendation for the team member to the list of recommendations
      recommendations.push(recommendation);
    }

    return recommendations;
  }

  /** Converts database rows containing a time slot and team member into a list of time slots
   *
   * The resulting time slots contain their cooresponding team member.
   *
   * @param rows The database rows
   * @returns The time slots
   */
  private mapTimeSlotTeamMemberRows(
    rows: ITimeSlotTeamMemberRow[],
  ): TimeSlot[] {
    return rows.map((row) => {
      const timeSlot = this.mapTimeSlotColumns(row);
      const teamMember = this.mapTeamMemberColumns(row);
      timeSlot.teamMember = teamMember;
      return timeSlot;
    });
  }

  /** Gets schedule warnings for the specified date range
   * @param start The start date
   * @param end The end range
   * @returns The schedule warnings
   */
  public async getWarnings(start: Date, end: Date): Promise<ScheduleWarnings> {
    const warnings = new ScheduleWarnings();

    // Externality warnings

    let result = await this._database.execute(
      `
        ${this.timeSlotTeamMemberQuery}
        WHERE TeamMembers.isExternal
          AND DATE(startDateTime) BETWEEN ? AND ?
      `,
      [start, end],
    );

    if (result.rows) {
      warnings.externality = this.mapTimeSlotTeamMemberRows(result.rows);
    }

    // Bilocation warnings

    // Using "less than" (not "equals") to compare the ids prevents a bilocation from being listed twice
    result = await this._database.execute(
      `
        SELECT
          ${this.teamMemberColumnsSql},
          t1.id timeSlot1Id,
          t1.shiftContextId timeSlot1ShiftContextId,
          t1.startDateTime timeSlot1StartDateTime,
          t1.endDateTime timeSlot1EndDateTime,
          t1.requiresAdult timeSlot1RequiresAdult,
          t1.teamMemberId timeSlot1TeamMemberId,
          t1.note timeSlot1Note,
          t2.id timeSlot2Id,
          t2.shiftContextId timeSlot2ShiftContextId,
          t2.startDateTime timeSlot2StartDateTime,
          t2.endDateTime timeSlot2EndDateTime,
          t2.requiresAdult timeSlot2RequiresAdult,
          t2.teamMemberId timeSlot2TeamMemberId,
          t2.note timeSlotNote
        FROM TimeSlots t1, TimeSlots t2, TeamMembers
          WHERE t1.id < t2.id
            AND t1.teamMemberId = t2.teamMemberId
            AND (
              t1.startDateTime BETWEEN t2.startDateTime AND t2.endDateTime
              OR t1.endDateTime BETWEEN t2.startDateTime AND t2.endDateTime
            )
            AND DATE(t1.startDateTime) BETWEEN ? AND ?
            AND t1.teamMemberId = TeamMembers.id
      `,
      [start, end],
    );

    if (result.rows) {
      warnings.bilocation = result.rows.map(
        (row: ITeamMemberTimeSlotTimeSlotRow) => {
          const teamMember = new TeamMember(
            row.teamMemberId,
            row.teamMemberFirstName,
            row.teamMemberMiddleName,
            row.teamMemberLastName,
            row.teamMemberBirthDate,
            row.teamMemberEmail,
            row.teamMemberPhone,
            row.teamMemberIsExternal == 1,
            row.teamMemberMaxWeeklyHours,
            row.teamMemberMaxWeeklyDays,
            row.teamMemberUsername,
            row.teamMemberPassword,
            row.teamMemberIsAdmin == 1,
          );

          return [
            new TimeSlot(
              row.timeSlot1Id,
              row.timeSlot1ShiftContextId,
              null,
              row.timeSlot1StartDateTime,
              row.timeSlot1EndDateTime,
              row.timeSlot1RequiresAdult == 1,
              row.timeSlot1TeamMemberId,
              teamMember,
              row.timeSlot1Note,
              row.timeSlot1ColorId,
              null,
            ),
            new TimeSlot(
              row.timeSlot2Id,
              row.timeSlot2ShiftContextId,
              null,
              row.timeSlot2StartDateTime,
              row.timeSlot2EndDateTime,
              row.timeSlot2RequiresAdult == 1,
              row.timeSlot2TeamMemberId,
              teamMember,
              row.timeSlot2Note,
              row.timeSlot2ColorId,
              null,
            ),
          ];
        },
      );
    }

    // Adult only violations

    result = await this._database.execute(
      `
        ${this.timeSlotTeamMemberQuery}
        WHERE TimeSlots.requiresAdult
          AND DATE(TimeSlots.startDateTime) BETWEEN ? AND ?
          AND TIMESTAMPDIFF(YEAR, TeamMembers.birthDate, TimeSlots.startDateTime) < 18;
      `,
      [start, end],
    );

    if (result.rows) {
      warnings.adultOnly = this.mapTimeSlotTeamMemberRows(result.rows);
    }

    // Shift context preference violations

    result = await this._database.execute(
      `
        SELECT
          ${this.timeSlotColumnsSql},
          ${this.teamMemberColumnsSql},
          ${this.shiftContextColumnsSql}
        FROM TimeSlots,
          TeamMembers,
          ShiftContexts,
          TeamMemberShiftContextPreferences
        WHERE TimeSlots.teamMemberId = TeamMembers.id
          AND TimeSlots.shiftContextId = ShiftContexts.id
          AND TimeSlots.teamMemberId = TeamMemberShiftContextPreferences.teamMemberId
          AND TimeSlots.shiftContextId = TeamMemberShiftContextPreferences.shiftContextId
          AND TeamMemberShiftContextPreferences.isPreference = FALSE
          AND DATE(TimeSlots.startDateTime) BETWEEN ? AND ?
      `,
      [start, end],
    );

    if (result.rows) {
      warnings.shiftContextPreferenceViolations = result.rows.map(
        (row: ITimeSlotTeamMemberShiftContextRow) => {
          const timeSlot = this.mapTimeSlotColumns(row);
          timeSlot.shiftContext = this.mapShiftContextColumns(row);
          timeSlot.teamMember = this.mapTeamMemberColumns(row);
          return timeSlot;
        },
      );
    }

    // Availability violations

    result = await this._database.execute(
      `
        -- Time slots not covered by typical availability
        SELECT
          ${this.timeSlotColumnsSql},
          ${this.teamMemberColumnsSql}
        FROM TimeSlots
          JOIN TeamMembers ON TimeSlots.teamMemberId = TeamMembers.id
        WHERE DATE(TimeSlots.startDateTime) BETWEEN ? AND ?
          AND TimeSlots.id NOT IN (
            -- Time slots falling within typical availability
            SELECT TimeSlots.id
            FROM TimeSlots, TeamMemberTypicalAvailability
            WHERE DATE(TimeSlots.startDateTime) BETWEEN ? AND ?
              AND TimeSlots.teamMemberId = TeamMemberTypicalAvailability.teamMemberId
              AND DAYOFWEEK(TimeSlots.startDateTime) - 1 = TeamMemberTypicalAvailability.dayOfWeek

              -- Time slot start date time and end date time falls within typical availability entry
              AND TIME(TimeSlots.startDateTime)
                BETWEEN TeamMemberTypicalAvailability.startTime AND TeamMemberTypicalAvailability.endTime
              AND TIME(TimeSlots.endDateTime)
                BETWEEN TeamMemberTypicalAvailability.startTime AND TeamMemberTypicalAvailability.endTime
          )
        UNION
        -- Time slots marked as unavailable
        SELECT
          ${this.timeSlotColumnsSql},
          ${this.teamMemberColumnsSql}
        FROM TimeSlots
          JOIN TeamMembers
            ON TimeSlots.teamMemberId = TeamMembers.id
          JOIN TeamMemberAvailability
            ON TimeSlots.teamMemberId = TeamMemberAvailability.teamMemberId
        WHERE DATE(TimeSlots.startDateTime) BETWEEN ? AND ?
          AND (
            -- Time slot start or end time overlaps unavailability
            (
              TimeSlots.startDateTime
                BETWEEN TeamMemberAvailability.startDateTime AND TeamMemberAvailability.endDateTime
              OR TimeSlots.endDateTime
                BETWEEN TeamMemberAvailability.startDateTime AND TeamMemberAvailability.endDateTime
            )
            OR
            -- Time slot starts before unavailability and ends after unavailability
            (
              TimeSlots.startDateTime < TeamMemberAvailability.startDateTime
              AND TimeSlots.endDateTime > TeamMemberAvailability.endDateTime
            )
          )
      `,
      [start, end, start, end, start, end],
    );

    if (result.rows) {
      warnings.availabilityViolations = result.rows.map(
        (row: ITimeSlotTeamMemberRow) => {
          const timeSlot = this.mapTimeSlotColumns(row);
          timeSlot.teamMember = this.mapTeamMemberColumns(row);
          return timeSlot;
        },
      );
    }

    // Max weekly days warnings
    result = await this._database.execute(
      `
        SELECT
          ${this.teamMemberColumnsSql},
          COUNT(*) workDays
        FROM TeamMembers
          JOIN (
            SELECT DISTINCT teamMemberId, DAYOFWEEK(TimeSlots.startDateTime)
            FROM TimeSlots
            WHERE DATE(TimeSlots.startDateTime) BETWEEN ? AND ?
              AND teamMemberId IS NOT NULL
          ) TimeSlotDays
            ON TeamMembers.id = TimeSlotDays.teamMemberId
        GROUP BY teamMemberId
        HAVING workDays > TeamMembers.maxWeeklyDays
      `,
      [start, end],
    );

    if (result.rows) {
      warnings.maxWeeklyDaysViolations = result.rows.map((
        row: IMaxWeeklyDaysViolationRow,
      ) => [
        this.mapTeamMemberColumns(row),
        row.workDays,
      ]);
    }

    // Max weekly hours warnings
    result = await this._database.execute(
      `
        SELECT
          ${this.teamMemberColumnsSql},
          SUM(TIMESTAMPDIFF(SECOND, TimeSlots.startDateTime, TimeSlots.endDateTime)) / 60 / 60 totalHours
        FROM TimeSlots
	        JOIN TeamMembers ON TimeSlots.teamMemberId = TeamMembers.id
        WHERE DATE(TimeSlots.startDateTime) BETWEEN ? AND ?
        GROUP BY TimeSlots.teamMemberId
        HAVING totalHours > TeamMembers.maxWeeklyHours
      `,
      [start, end],
    );

    if (result.rows) {
      warnings.maxWeeklyHoursViolations = result.rows.map((
        row: IMaxWeeklyHoursViolationRow,
      ) => [
        this.mapTeamMemberColumns(row),
        row.totalHours,
      ]);
    }

    // Unassigned time slot warnings

    warnings.unassignedTimeSlots = await this._timeSlots.getUnassigned(
      start,
      end,
    );

    return warnings;
  }
}
