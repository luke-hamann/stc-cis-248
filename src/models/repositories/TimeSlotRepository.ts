import BetterDate from "../../_dates/BetterDate.ts";
import DateLib from "../../_dates/DateLib.ts";
import TimeSlot from "../entities/TimeSlot.ts";
import TimeSlotGroup from "../entities/TimeSlotGroup.ts";
import Database from "./_Database.ts";
import Repository from "./_Repository.ts";
import ColorRepository from "./ColorRepository.ts";
import ShiftContextRepository from "./ShiftContextRepository.ts";
import TeamMemberRepository from "./TeamMemberRepository.ts";

/** Describes a time slot database row */
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

/** Describes a time slot group database row */
interface ITimeSlotGroupRow {
  startTime: string;
  endTime: string;
  requiresAdult: number;
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

  private async populateAll(timeslots: TimeSlot[]): Promise<TimeSlot[]> {
    return await Promise.all(
      timeslots.map((timeslot) => this.populate(timeslot)),
    );
  }

  /**
   * Validates a time slot
   * @param t A time slot
   * @returns A list of error messages
   */
  public async validate(t: TimeSlot): Promise<string[]> {
    const errors: string[] = [];

    const shiftContext = await this.shiftContexts.get(t.shiftContextId);
    if (shiftContext == null) {
      errors.push("Please select a shift context.");
    }

    if (t.startDateTime == null) {
      errors.push("Please enter a start date and time.");
    }

    // if (t.endDateTime == null) {
    //   errors.push("Please enter an end date and time.");
    // }

    if (
      t.startDateTime != null && t.endDateTime != null &&
      t.startDateTime.getTime() >= t.endDateTime.getTime()
    ) {
      errors.push("Start date and time must be before end date and time.");
    }

    if (t.teamMemberId != null) {
      const teamMember = await this.teamMembers.get(t.teamMemberId);
      if (teamMember == null) {
        errors.push("The selected team member does not exist.");
      }
    }

    if (t.colorId != null && t.colorId != 0) {
      const color = await this.colors.get(t.colorId);
      if (color == null) {
        errors.push("The selected color does not exist.");
      }
    }

    return errors;
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
    let destinationTimeSlots = [];

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

    destinationTimeSlots = await this.populateAll(destinationTimeSlots);

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
            (
              startDateTime BETWEEN ? AND ?
              OR endDateTime BETWEEN ? AND ?
            )
            OR (
              startDateTime < ?
              AND endDateTime > ?
            )
          )
      `,
      [
        timeSlot.id,
        teamMemberId,
        timeSlot.startDateTime,
        timeSlot.endDateTime,
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

  public async getUnassigned(start: Date, end: Date): Promise<TimeSlot[]> {
    const result = await this.database.execute(
      `
        ${this.timeSlotQuery}
        WHERE teamMemberId IS NULL
          AND DATE(startDateTime) BETWEEN ? AND ?
      `,
      [start, end],
    );

    if (!result.rows || result.rows.length == 0) return [];

    return await this.populateAll(this.mapRowsToTimeSlots(result.rows));
  }
}
