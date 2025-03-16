import BetterDate from "../../_dates/BetterDate.ts";
import DateLib from "../../_dates/DateLib.ts";
import ShiftContext from "../entities/ShiftContext.ts";
import TeamMember from "../entities/TeamMember.ts";
import TimeSlot from "../entities/TimeSlot.ts";
import TimeSlotGroup from "../entities/TimeSlotGroup.ts";
import Database from "./_Database.ts";
import Repository from "./_Repository.ts";
import ColorRepository from "./ColorRepository.ts";
import ShiftContextRepository from "./ShiftContextRepository.ts";
import TeamMemberRepository from "./TeamMemberRepository.ts";

interface ITimeSlotRow {
  id: number;
  shiftContextId: number;
  startDateTime: Date;
  endDateTime: Date | null;
  requiresAdult: number;
  teamMemberId: number | null;
  note: string;
  colorId: number | null;
}

interface ITimeSlotGroupRow {
  startTime: string;
  endTime: string;
  requiresAdult: number;
}

interface ITimeSlotRowComponent {
  timeSlotId: number;
  timeSlotShiftContextId: number;
  timeSlotStartDateTime: Date;
  timeSlotEndDateTime: Date;
  timeSlotRequiresAdult: number;
  timeSlotTeamMemberId: number;
  timeSlotNote: string;
  timeSlotColorId: number;
}

interface ITeamMemberRowComponent {
  teamMemberId: number;
  teamMemberFirstName: string;
  teamMemberMiddleName: string;
  teamMemberLastName: string;
  teamMemberBirthDate: Date;
  teamMemberEmail: string;
  teamMemberPhone: string;
  teamMemberIsExternal: number;
  teamMemberMaxWeeklyHours: number;
  teamMemberMaxWeeklyDays: number;
  teamMemberUsername: string;
  teamMemberPassword: string;
  teamMemberIsAdmin: number;
}

interface IShiftContextRowComponent {
  shiftContextId: number,
  shiftContextName: string,
  shiftContextAgeGroup: string,
  shiftContextLocation: string,
  shiftContextDescription: string
}

interface ITimeSlotTeamMemberRow
  extends ITimeSlotRowComponent, ITeamMemberRowComponent {}

interface ITimeSlotTeamMemberShiftContextRow
  extends ITimeSlotRowComponent, ITeamMemberRowComponent, IShiftContextRowComponent {}

interface ITimeSlotTimeSlotRow {
  timeSlot1id: number;
  timeSlot1shiftContextId: number;
  timeSlot1startDateTime: Date;
  timeSlot1endDateTime: Date | null;
  timeSlot1requiresAdult: number;
  timeSlot1teamMemberId: number | null;
  timeSlot1note: string;
  timeSlot1colorId: number | null;
  timeSlot2id: number;
  timeSlot2shiftContextId: number;
  timeSlot2startDateTime: Date;
  timeSlot2endDateTime: Date | null;
  timeSlot2requiresAdult: number;
  timeSlot2teamMemberId: number | null;
  timeSlot2note: string;
  timeSlot2colorId: number | null;
}

export default class TimeSlotRepository extends Repository {
  private shiftContexts: ShiftContextRepository;
  private colors: ColorRepository;
  private teamMembers: TeamMemberRepository;
  private readonly timeSlotQuery = `
    SELECT id,
      shiftContextId,
      startDateTime,
      endDateTime,
      requiresAdult,
      teamMemberId,
      note,
      colorId
    FROM Timeslots
  `;

  private readonly timeSlotColumnsSql = `
    TimeSlots.id              timeSlotId,
    TimeSlots.shiftContextId  timeSlotShiftContextId,
    TimeSlots.startDateTime   timeSlotStartDateTime,
    TimeSlots.endDateTime     timeSlotEndDateTime,
    TimeSlots.requiresAdult   timeSlotRequiresAdult,
    TimeSlots.teamMemberId    timeSlotTeamMemberId,
    TimeSlots.note            timeSlotNote,
    TimeSlots.colorId         timeSlotColorId,
  `;

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

  private readonly timeSlotTeamMemberQuery = `
    SELECT
      ${this.timeSlotColumnsSql}
      ${this.teamMemberColumnsSql}
    FROM TimeSlots
      JOIN TeamMembers
        ON TimeSlots.teamMemberId = TeamMember.id
  `;

  constructor(
    database: Database,
    shiftContextRepository: ShiftContextRepository,
    colorRepository: ColorRepository,
    teamMemberRepository: TeamMemberRepository,
  ) {
    super(database);
    this.shiftContexts = shiftContextRepository;
    this.colors = colorRepository;
    this.teamMembers = teamMemberRepository;
  }

  private mapRowToTimeSlot(row: ITimeSlotRow) {
    return new TimeSlot(
      row.id,
      row.shiftContextId,
      null,
      row.startDateTime,
      row.endDateTime,
      row.requiresAdult == 1,
      row.teamMemberId,
      null,
      row.note,
      row.colorId,
      null,
    );
  }

  private mapRowsToTimeSlots(rows: ITimeSlotRow[]) {
    return rows.map((row) => this.mapRowToTimeSlot(row));
  }

  private async populate(t: TimeSlot): Promise<TimeSlot> {
    const timeSlot = t.clone();

    timeSlot.shiftContext = await this.shiftContexts.get(
      timeSlot.shiftContextId,
    );

    if (timeSlot.colorId != null) {
      timeSlot.color = await this.colors.get(timeSlot.colorId);
    }

    if (timeSlot.teamMemberId != null) {
      timeSlot.teamMember = await this.teamMembers.get(timeSlot.teamMemberId);
    }

    return timeSlot;
  }

  /**
   * Validates a time slot
   * @param t A time slot
   * @returns A list of error messages
   */
  public async validate(t: TimeSlot): Promise<string[]> {
    return await Promise.resolve([]);
  }

  /**
   * Gets all time slots starting on a given date
   * @param date The date
   * @returns A list of time slots
   */
  public async getOnDate(date: Date): Promise<TimeSlot[]> {
    const result = await this.database.execute(
      `${this.timeSlotQuery} WHERE DATE(startDateTime) = ?`,
      [date],
    );

    if (!result.rows) return [];

    return this.mapRowsToTimeSlots(result.rows);
  }

  /**
   * Gets all time slots starting within a given date range
   * @param start The beginning of the range
   * @param end The end of the range
   * @returns The list of time slots
   */
  public async getInDateRange(start: Date, end: Date): Promise<TimeSlot[]> {
    const result = await this.database.execute(
      `
        ${this.timeSlotQuery}
        WHERE DATE(startDateTime) BETWEEN ? AND ?
      `,
      [start, end],
    );

    if (!result.rows) return [];

    return this.mapRowsToTimeSlots(result.rows);
  }

  /**
   * Lists all time slots within on a given shift context and date
   * @param shiftContextId
   * @param date
   * @returns Time slot array
   */
  public async list(
    shiftContextId: number,
    date: Date,
  ): Promise<TimeSlot[]> {
    const result = await this.database.execute(
      `${this.timeSlotQuery} WHERE shiftContextId = ? AND DATE(startDateTime) = ?`,
      [shiftContextId, date],
    );

    if (!result.rows) return [];

    let timeSlots = this.mapRowsToTimeSlots(result.rows);
    timeSlots = await Promise.all(
      timeSlots.map(async (timeSlot) => await this.populate(timeSlot)),
    );

    return timeSlots;
  }

  /**
   * Gets a time slot by id
   * @param id
   */
  public async get(id: number): Promise<TimeSlot | null> {
    const result = await this.database.execute(
      `${this.timeSlotQuery} WHERE id = ?`,
      [id],
    );

    if (!result.rows || result.rows.length == 0) {
      return null;
    }

    return await this.populate(this.mapRowToTimeSlot(result.rows[0]));
  }

  /**
   * Adds a new time slot
   * @param t Timeslot
   * @returns The new time slot id
   */
  public async add(t: TimeSlot): Promise<number> {
    const result = await this.database.execute(
      `
        INSERT INTO TimeSlots
          (shiftContextId, startDateTime, endDateTime, requiresAdult, teamMemberId, note, colorId)
        VALUES
          (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        t.shiftContextId,
        t.startDateTime,
        t.endDateTime,
        t.requiresAdult ? 1 : 0,
        t.teamMemberId,
        t.note,
        t.colorId,
      ],
    );

    return result.lastInsertId ?? 0;
  }

  /**
   * Updates a time slot
   * @param t The time slot
   */
  public async update(t: TimeSlot): Promise<void> {
    await this.database.execute(
      `
        UPDATE TimeSlots
        SET shiftContextId = ?,
          startDateTime = ?,
          endDateTime = ?,
          requiresAdult = ?,
          teamMemberId = ?,
          note = ?,
          colorId = ?
        WHERE id = ?
      `,
      [
        t.shiftContextId,
        t.startDateTime,
        t.endDateTime,
        t.requiresAdult ? 1 : 0,
        t.teamMemberId,
        t.note,
        t.colorId,
        t.id,
      ],
    );
  }

  /**
   * Deletes a time slot
   * @param id The time slot id
   */
  public async delete(id: number): Promise<void> {
    await this.database.execute(
      `
        DELETE FROM TimeSlots
        WHERE id = ?
      `,
      [id],
    );
  }

  /**
   * Deletes all time slots starting within a given date range
   * @param start The beginning of the range
   * @param end The end of the range
   */
  public async deleteInDateRange(
    start: Date,
    end: Date,
  ): Promise<void> {
    await this.database.execute(
      `
        DELETE FROM TimeSlots
        WHERE DATE(startDateTime) BETWEEN ? AND ?
      `,
      [start, end],
    );
  }

  /**
   * Generate time slots for a prospective copy operation
   * @param sourceStart The beginning of the time range to copy
   * @param sourceEnd The end of the time range to copy
   * @param destinationStart The beginning of the time range to copy to
   * @param destinationEnd The end of the time range to copy to
   * @param repeatCopy Wheather the source range should be repeated to fill the destination range
   * @param includeAssignees Whether the copied time slots should include team member ids
   * @param includeNotes Whether the copied time slots should include their notes
   * @returns The list of time slots, ordered by start date time
   */
  public async calculateCopy(
    sourceStart: Date,
    sourceEnd: Date,
    destinationStart: Date,
    destinationEnd: Date,
    repeatCopy: boolean,
    includeAssignees: boolean,
    includeNotes: boolean,
  ) {
    const sourceWidth = DateLib.differenceInDays(sourceStart, sourceEnd) + 1;
    const initialOffset = DateLib.differenceInDays(
      sourceStart,
      destinationStart,
    );

    const sourceTimeSlots = await this.getInDateRange(sourceStart, sourceEnd);
    const destinationTimeSlots = [];

    for (const timeSlot of sourceTimeSlots) {
      let offset = initialOffset;

      if (!includeAssignees) timeSlot.teamMemberId = null;
      if (!includeNotes) timeSlot.note = "";

      while (true) {
        const newTimeSlot = timeSlot.clone();
        newTimeSlot.startDateTime = DateLib.addDays(
          newTimeSlot.startDateTime!,
          offset,
        );
        newTimeSlot.endDateTime = DateLib.addDays(
          newTimeSlot.endDateTime!,
          offset,
        );

        const tempDate = new Date(newTimeSlot.startDateTime.getTime());
        tempDate.setHours(0, 0, 0, 0);

        const isOutOfBounds = tempDate.getTime() > destinationEnd.getTime();

        if (isOutOfBounds) break;

        destinationTimeSlots.push(newTimeSlot);

        if (!repeatCopy) break;

        offset += sourceWidth;
      }
    }

    destinationTimeSlots.sort((a, b) =>
      a.startDateTime!.getTime() - b.startDateTime!.getTime()
    );

    return destinationTimeSlots;
  }

  /**
   * Gets time slots by grouping and then by date for a given shift context and date range
   * @param shiftContextId The shift context
   * @param startDate The starting date
   * @param endDate The ending date
   * @returns Time slot groups with their cooresponsponding time slots broken down by day
   */
  public async getByGroups(
    shiftContextId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<{ timeSlotGroup: TimeSlotGroup; timeSlotsByDay: TimeSlot[][] }[]> {
    // Calculate groupings

    const result = await this.database.execute(
      `
        SELECT TIME(startDateTime) startTime, TIME(endDateTime) endTime, requiresAdult
        FROM TimeSlots
        WHERE shiftContextId = ? AND
          DATE(startDateTime) BETWEEN ? AND ?
        GROUP BY 1, 2, 3
        ORDER BY 1, 2, 3 DESC
      `,
      [shiftContextId, startDate, endDate],
    );

    if (!result.rows || result.rows.length == 0) return [];

    const timeSlotGroups = result.rows.map((row: ITimeSlotGroupRow) =>
      new TimeSlotGroup(
        shiftContextId,
        startDate,
        endDate,
        row.startTime,
        row.endTime,
        row.requiresAdult == 1,
      )
    );

    // Organize time slots by grouping and then by date within date range

    const output: {
      timeSlotGroup: TimeSlotGroup;
      timeSlotsByDay: TimeSlot[][];
    }[] = [];
    for (const timeSlotGroup of timeSlotGroups) {
      const table: TimeSlot[][] = [];

      for (const date of DateLib.getDatesInRange(startDate, endDate)) {
        const result = await this.database.execute(
          `
            ${this.timeSlotQuery}
            WHERE shiftContextId = ?
              AND DATE(startDateTime) = ?
              AND TIME(startDateTime) = ?
              AND TIME(endDateTime) = ?
              AND requiresAdult = ?
          `,
          [
            timeSlotGroup.shiftContextId,
            date,
            timeSlotGroup.startTime,
            timeSlotGroup.endTime,
            timeSlotGroup.requiresAdult,
          ],
        );

        if (!result.rows || result.rows.length == 0) {
          table.push([]);
          continue;
        }

        const timeSlots = await Promise.all(
          this.mapRowsToTimeSlots(result.rows).map((timeSlot) =>
            this.populate(timeSlot)
          ),
        );

        table.push(timeSlots);
      }

      output.push({ timeSlotGroup: timeSlotGroup, timeSlotsByDay: table });
    }

    return output;
  }

  public async hasNoConflicts(
    teamMemberId: number,
    timeSlot: TimeSlot,
  ): Promise<"positive" | "negative" | "unknown"> {
    if (timeSlot.startDateTime == null || timeSlot.endDateTime == null) {
      return "unknown";
    }

    const result = await this.database.execute(
      `
        ${this.timeSlotQuery}
        WHERE id != ?
          AND teamMemberId = ?
          AND (
            startDateTime BETWEEN ? AND ?
            OR endDateTime BETWEEN ? AND ?
          )
      `,
      [
        timeSlot.id,
        teamMemberId,
        timeSlot.startDateTime,
        timeSlot.endDateTime,
        timeSlot.startDateTime,
        timeSlot.endDateTime,
      ],
    );

    if (!result.rows || result.rows.length == 0) return "positive";

    return "negative";
  }

  public async doesNotWork(teamMemberId: number, date: Date): Promise<boolean> {
    const dateString = BetterDate.fromDate(date).toDateString();

    const result = await this.database.execute(
      `
        SELECT 1
        FROM TimeSlots
        WHERE teamMemberId = ?
          AND (
            DATE(startDateTime) = ?
            OR DATE(endDateTime) = ?
          )
      `,
      [teamMemberId, dateString, dateString],
    );

    return (!result.rows || result.rows.length == 0);
  }

  public mapTimeSlotTeamMemberRows(rows: ITimeSlotTeamMemberRow[]): TimeSlot[] {
    return rows.map((row) =>
      new TimeSlot(
        row.timeSlotId,
        row.timeSlotShiftContextId,
        null,
        row.timeSlotStartDateTime,
        row.timeSlotEndDateTime,
        row.timeSlotRequiresAdult == 1,
        row.timeSlotTeamMemberId,
        new TeamMember(
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
        ),
        row.timeSlotNote,
        row.timeSlotColorId,
        null,
      )
    );
  }

  public async findWithExternalAssignees(
    start: Date,
    end: Date,
  ): Promise<TimeSlot[]> {
    const result = await this.database.execute(
      `
        ${this.timeSlotTeamMemberQuery}
        WHERE TeamMembers.isExternal
          AND DATE(startDateTime) BETWEEN ? AND ?
      `,
      [start, end],
    );

    if (!result.rows) return [];

    return this.mapTimeSlotTeamMemberRows(result.rows);
  }

  /**
   * Finds pairs of time slots where a team member was scheduled in two places at the same time
   * @param start Start date range
   * @param end End date range
   * @returns Pairs of conflicting time slots
   */
  public async findBilocation(
    start: Date,
    end: Date,
  ): Promise<[TimeSlot, TimeSlot][]> {
    // Using "less than" (not "equals") to compare the ids prevents a bilocation from being listed twice
    const result = await this.database.execute(
      `
        SELECT
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
          t2.note timeSlotNote,
        FROM TimeSlots t1, TimeSlots t2
          WHERE t1.id < t2.id
            AND t1.teamMemberId = t2.teamMemberId
            AND (
              t1.startDateTime BETWEEN t2.startDateTime AND t2.endDateTime
              OR t1.endDateTime BETWEEN t2.startDateTime AND t2.endDateTime
            )
            AND DATE(startDateTime) BETWEEN ? AND ?
      `,
      [start, end],
    );

    if (!result.rows) return [];

    return result.rows.map((row: ITimeSlotTimeSlotRow) => [
      new TimeSlot(
        row.timeSlot1id,
        row.timeSlot1shiftContextId,
        null,
        row.timeSlot1startDateTime,
        row.timeSlot1endDateTime,
        row.timeSlot1requiresAdult == 1,
        row.timeSlot1teamMemberId,
        null,
        row.timeSlot1note,
        row.timeSlot1colorId,
        null,
      ),
      new TimeSlot(
        row.timeSlot2id,
        row.timeSlot2shiftContextId,
        null,
        row.timeSlot2startDateTime,
        row.timeSlot2endDateTime,
        row.timeSlot2requiresAdult == 1,
        row.timeSlot2teamMemberId,
        null,
        row.timeSlot2note,
        row.timeSlot2colorId,
        null,
      ),
    ]);
  }

  public async findAdultOnlyViolations(
    start: Date,
    end: Date,
  ): Promise<TimeSlot[]> {
    const result = await this.database.execute(
      `
        ${this.timeSlotTeamMemberQuery}
        WHERE TimeSlots.requiresAdult
          AND DATE(TimeSlots.startDateTime) BETWEEN ? AND ?
          AND TIMESTAMPDIFF(YEAR, TeamMembers.birthDate, TimeSlots.startDateTime) < 18;
      `,
      [start, end],
    );

    if (!result.rows) return [];

    return this.mapTimeSlotTeamMemberRows(result.rows);
  }

  public async findPreferenceViolations(
    start: Date,
    end: Date,
  ): Promise<TimeSlot[]> {
    const result = await this.database.execute(
      `
        SELECT
          ${this.timeSlotColumnsSql}
          ${this.teamMemberColumnsSql}
          ShiftContexts.id shiftContextId,
          ShiftContexts.name shiftContextName,
          ShiftContexts.location shiftContextLocation,
          ShiftContexts.description shiftContextDescription
        FROM TimeSlots,
          TeamMembers,
          ShiftContexts,
          TeamMemberShiftContextPreferences
        WHERE TimeSlots.teamMemberId = TeamMember.id
          AND TimeSlots.shiftContextId = ShiftContext.id
          AND TimeSlots.teamMemberId = TeamMemberShiftContextPreferences.teamMemberId
          AND TimeSlots.shiftContextId = TeamMemberShiftContextPreferences.shiftContextId
          AND TeamMemberShiftContextPreferences.isPreference = FALSE
          AND DATE(TimeSlots.startDateTime) BETWEEN ? AND ?
      `,
      [start, end],
    );

    if (!result.rows) return [];

    return result.rows.map((row: ITimeSlotTeamMemberShiftContextRow) => new TimeSlot(
      row.timeSlotId,
      row.timeSlotShiftContextId,
      new ShiftContext(
        row.shiftContextId,
        row.shiftContextName,
        row.shiftContextAgeGroup,
        row.shiftContextLocation,
        row.shiftContextDescription
      ),
      row.timeSlotStartDateTime,
      row.timeSlotEndDateTime,
      row.timeSlotRequiresAdult == 1,
      row.timeSlotTeamMemberId,
      new TeamMember(
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
        row.teamMemberIsAdmin == 1
      ),
      row.timeSlotNote,
      row.timeSlotColorId,
      null
    ));
  }

  public async findAvailabilityViolations(
    start: Date,
    end: Date,
  ): Promise<TimeSlot[]> {
  }

  public async findMaxWeeklyDaysViolations(
    start: Date,
    end: Date,
  ): Promise<TeamMember[]> {
  }

  public async findMaxWeeklyHoursViolations(
    start: Date,
    end: Date,
  ): Promise<TeamMember[]> {
  }
}
