import BetterDate from "../../_dates/BetterDate.ts";
import DateLib from "../../_dates/DateLib.ts";
import TimeSlot from "../entities/TimeSlot.ts";
import TimeSlotGroup from "../entities/TimeSlotGroup.ts";
import Database from "./_Database.ts";
import Repository from "./_Repository.ts";
import ColorRepository from "./ColorRepository.ts";
import ShiftContextRepository from "./ShiftContextRepository.ts";
import TeamMemberRepository from "./TeamMemberRepository.ts";

/** Represents actions for manipulating a set of time slots */
export interface ITimeSlotRepository {
  /**
   * Validates a time slot
   * @param timeSlot A time slot
   * @returns An array of error messages
   */
  validate(timeSlot: TimeSlot): Promise<string[]>;

  /**
   * Gets all time slots starting on a given date
   * @param date The date
   * @returns An array of time slots
   */
  getOnDate(date: Date): Promise<TimeSlot[]>;

  /**
   * Gets all time slots starting within a given date range
   * @param start The start date and time
   * @param end The end date and time
   * @returns The array of time slots
   */
  getRange(start: Date, end: Date): Promise<TimeSlot[]>;

  /**
   * Lists all time slots within a given shift context and date
   * @param shiftContextId The shift context id
   * @param date The date
   * @returns An array of time slots
   */
  list(shiftContextId: number, date: Date): Promise<TimeSlot[]>;

  /**
   * Gets a time slot by id
   * @param id The id
   * @returns The time slot
   */
  get(id: number): Promise<TimeSlot | null>;

  /**
   * Adds a time slot
   * @param timeSlot The time slot
   * @returns The id of the newly added time slot
   */
  add(timeSlot: TimeSlot): Promise<number>;

  /**
   * Updates a time slot
   *
   * Refers to the id to update the time slot
   *
   * @param timeSlot The time slot
   */
  update(timeSlot: TimeSlot): Promise<void>;

  /**
   * Deletes a time slot
   * @param id The time slot id
   */
  delete(id: number): Promise<void>;

  /**
   * Deletes all time slots starting within a given date range
   * @param start The start date
   * @param end The end date
   */
  deleteRange(start: Date, end: Date): Promise<void>;

  /**
   * Generates time slots for a prospective copy operation
   * @param sourceStart The beginning of the time range to copy
   * @param sourceEnd The end of the time range to copy
   * @param destinationStart The beginning of the time range to copy to
   * @param destinationEnd The end of the time range to copy to
   * @param repeatCopy Wheather the source range should be repeated to fill the destination range
   * @param includeAssignees Whether the copied time slots should include team member ids
   * @param includeNotes Whether the copied time slots should include their notes
   * @returns The list of time slots, ordered by start date time
   */
  calculateCopy(
    sourceStart: Date,
    sourceEnd: Date,
    destinationStart: Date,
    destinationEnd: Date,
    repeatCopy: boolean,
    includeAssignees: boolean,
    includeNotes: boolean,
  ): Promise<TimeSlot[]>;

  /**
   * Gets time slots by grouping and then by date for a given shift context and date range
   * @param shiftContextId The shift context
   * @param start The starting date
   * @param end The ending date
   * @returns An array of time slot groups with their cooresponsponding time slots broken down by day
   */
  getByGroups(
    shiftContextId: number,
    start: Date,
    end: Date,
  ): Promise<{ timeSlotGroup: TimeSlotGroup; timeSlotsByDay: TimeSlot[][] }[]>;

  /**
   * Determines if a team member would have no scheduling conflicts if they were assigned to a time slot
   * @param teamMemberId The team member id
   * @param timeSlot The time slot
   * @returns Whether the assignment would avoid scheduling conflicts
   */
  hasNoConflicts(
    teamMemberId: number,
    timeSlot: TimeSlot,
  ): Promise<"positive" | "negative" | "unknown">;

  /**
   * Gets time slots without assignees within the date range
   * @param start The start date
   * @param end The end date
   * @returns The array of time slots
   */
  getUnassigned(start: Date, end: Date): Promise<TimeSlot[]>;
}

/** Describes a time slot database row */
interface ITimeSlotRow {
  /** The time slot id */
  id: number;

  /** The id of the associated shift context */
  shiftContextId: number;

  /** The time slot start date and time */
  startDateTime: Date;

  /** The time slot end date and time */
  endDateTime: Date | null;

  /**
   * Whether the time slot requires an adult assignee
   *
   * 0 is false, 1 is true.
   */
  requiresAdult: number;

  /** The id of the assigned team member, if there is one */
  teamMemberId: number | null;

  /** The note saved on the time slot */
  note: string;

  /** The id of the color associated with the time slot note */
  colorId: number | null;
}

/** Describes a time slot group database row */
interface ITimeSlotGroupRow {
  /** The time slot group start time */
  startTime: string;

  /** The time slot group end time */
  endTime: string;

  /**
   * Whether the time slot group requires an adult assignee
   *
   * 0 is false, 1 is true.
   */
  requiresAdult: number;
}

/** Represents a means for manipulating a set of team members */
export default class TimeSlotRepository extends Repository {
  /** The shift context repository */
  private _shiftContexts: ShiftContextRepository;

  /** The colors repository */
  private _colors: ColorRepository;

  /** The team members repository */
  private _teamMembers: TeamMemberRepository;

  /** A generic SQL query for selecting time slots */
  private readonly _timeSlotQuery = `
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

  /**
   * Constructs the repository based on a database connection and other repositories
   * @param database The database connection
   * @param shiftContextRepository The shift context repository
   * @param colorRepository The color repository
   * @param teamMemberRepository The team member repository
   */
  constructor(
    database: Database,
    shiftContextRepository: ShiftContextRepository,
    colorRepository: ColorRepository,
    teamMemberRepository: TeamMemberRepository,
  ) {
    super(database);
    this._shiftContexts = shiftContextRepository;
    this._colors = colorRepository;
    this._teamMembers = teamMemberRepository;
  }

  /**
   * Converts a database row to a time slot
   * @param row The database row
   * @returns The time slot
   */
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

  /**
   * Converts an array of database rows to an array of time slots
   * @param rows The array of database rows
   * @returns The array of time slots
   */
  private mapRowsToTimeSlots(rows: ITimeSlotRow[]) {
    return rows.map((row) => this.mapRowToTimeSlot(row));
  }

  /**
   * Populates a time slot with its associated shift context, color, and team member, if it has them
   *
   * @param originalTimeSlot
   * @returns The populated time slot
   */
  private async populate(originalTimeSlot: TimeSlot): Promise<TimeSlot> {
    const timeSlot = originalTimeSlot.clone();

    timeSlot.shiftContext = await this._shiftContexts.get(
      timeSlot.shiftContextId,
    );

    if (timeSlot.colorId != null) {
      timeSlot.color = await this._colors.get(timeSlot.colorId);
    }

    if (timeSlot.teamMemberId != null) {
      timeSlot.teamMember = await this._teamMembers.get(timeSlot.teamMemberId);
    }

    return timeSlot;
  }

  /**
   * Populates all the time slots in an array of time slots with their associated shift context, color, and team member, if they have them
   * @param timeslots The time slots
   * @returns The populated time slots
   */
  private async populateAll(timeslots: TimeSlot[]): Promise<TimeSlot[]> {
    return await Promise.all(
      timeslots.map((timeslot) => this.populate(timeslot)),
    );
  }

  /**
   * Validates a time slot
   * @param timeSlot A time slot
   * @returns An array of error messages
   */
  public async validate(timeSlot: TimeSlot): Promise<string[]> {
    const errors: string[] = [];

    const shiftContext = await this._shiftContexts.get(timeSlot.shiftContextId);
    if (shiftContext == null) {
      errors.push("Please select a shift context.");
    }

    if (timeSlot.startDateTime == null) {
      errors.push("Please enter a start date and time.");
    }

    // if (t.endDateTime == null) {
    //   errors.push("Please enter an end date and time.");
    // }

    if (
      timeSlot.startDateTime != null && timeSlot.endDateTime != null &&
      timeSlot.startDateTime.getTime() >= timeSlot.endDateTime.getTime()
    ) {
      errors.push("Start date and time must be before end date and time.");
    }

    if (timeSlot.teamMemberId != null) {
      const teamMember = await this._teamMembers.get(timeSlot.teamMemberId);
      if (teamMember == null) {
        errors.push("The selected team member does not exist.");
      }
    }

    if (timeSlot.colorId != null && timeSlot.colorId != 0) {
      const color = await this._colors.get(timeSlot.colorId);
      if (color == null) {
        errors.push("The selected color does not exist.");
      }
    }

    return errors;
  }

  /**
   * Gets all time slots starting on a given date
   * @param date The date
   * @returns An array of time slots
   */
  public async getOnDate(date: Date): Promise<TimeSlot[]> {
    const result = await this._database.execute(
      `${this._timeSlotQuery} WHERE DATE(startDateTime) = ?`,
      [date],
    );

    if (!result.rows) return [];

    return this.mapRowsToTimeSlots(result.rows);
  }

  /**
   * Gets all time slots starting within a given date range
   * @param start The start date and time
   * @param end The end date and time
   * @returns The array of time slots
   */
  public async getInRange(start: Date, end: Date): Promise<TimeSlot[]> {
    const result = await this._database.execute(
      `
        ${this._timeSlotQuery}
        WHERE DATE(startDateTime) BETWEEN ? AND ?
      `,
      [start, end],
    );

    if (!result.rows) return [];

    return this.mapRowsToTimeSlots(result.rows);
  }

  /**
   * Lists all time slots within a given shift context and date
   * @param shiftContextId The shift context id
   * @param date The date
   * @returns An array of time slots
   */
  public async list(
    shiftContextId: number,
    date: Date,
  ): Promise<TimeSlot[]> {
    const result = await this._database.execute(
      `${this._timeSlotQuery} WHERE shiftContextId = ? AND DATE(startDateTime) = ?`,
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
   * @param id The id
   * @returns The time slot
   */
  public async get(id: number): Promise<TimeSlot | null> {
    const result = await this._database.execute(
      `${this._timeSlotQuery} WHERE id = ?`,
      [id],
    );

    if (!result.rows || result.rows.length == 0) {
      return null;
    }

    return await this.populate(this.mapRowToTimeSlot(result.rows[0]));
  }

  /**
   * Adds a time slot
   * @param timeSlot The time slot
   * @returns The id of the newly added time slot
   */
  public async add(timeSlot: TimeSlot): Promise<number> {
    const result = await this._database.execute(
      `
        INSERT INTO TimeSlots
          (shiftContextId, startDateTime, endDateTime, requiresAdult, teamMemberId, note, colorId)
        VALUES
          (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        timeSlot.shiftContextId,
        timeSlot.startDateTime,
        timeSlot.endDateTime,
        timeSlot.requiresAdult ? 1 : 0,
        timeSlot.teamMemberId,
        timeSlot.note,
        timeSlot.colorId,
      ],
    );

    return result.lastInsertId ?? 0;
  }

  /**
   * Updates a time slot
   *
   * Refers to the id to update the time slot
   *
   * @param timeSlot The time slot
   */
  public async update(timeSlot: TimeSlot): Promise<void> {
    await this._database.execute(
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
        timeSlot.shiftContextId,
        timeSlot.startDateTime,
        timeSlot.endDateTime,
        timeSlot.requiresAdult ? 1 : 0,
        timeSlot.teamMemberId,
        timeSlot.note,
        timeSlot.colorId,
        timeSlot.id,
      ],
    );
  }

  /**
   * Deletes a time slot
   * @param id The time slot id
   */
  public async delete(id: number): Promise<void> {
    await this._database.execute(
      `
        DELETE FROM TimeSlots
        WHERE id = ?
      `,
      [id],
    );
  }

  /**
   * Deletes all time slots starting within a given date range
   * @param start The start date
   * @param end The end date
   */
  public async deleteRange(
    start: Date,
    end: Date,
  ): Promise<void> {
    await this._database.execute(
      `
        DELETE FROM TimeSlots
        WHERE DATE(startDateTime) BETWEEN ? AND ?
      `,
      [start, end],
    );
  }

  /**
   * Generates time slots for a prospective copy operation
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
  ): Promise<TimeSlot[]> {
    const sourceWidth = DateLib.differenceInDays(sourceStart, sourceEnd) + 1;
    const initialOffset = DateLib.differenceInDays(
      sourceStart,
      destinationStart,
    );

    const sourceTimeSlots = await this.getInRange(sourceStart, sourceEnd);
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
   * @param start The starting date
   * @param end The ending date
   * @returns An array of time slot groups with their cooresponsponding time slots broken down by day
   */
  public async getByGroups(
    shiftContextId: number,
    start: Date,
    end: Date,
  ): Promise<{ timeSlotGroup: TimeSlotGroup; timeSlotsByDay: TimeSlot[][] }[]> {
    // Calculate groupings
    const result = await this._database.execute(
      `
        SELECT TIME(startDateTime) startTime, TIME(endDateTime) endTime, requiresAdult
        FROM TimeSlots
        WHERE shiftContextId = ? AND
          DATE(startDateTime) BETWEEN ? AND ?
        GROUP BY 1, 2, 3
        ORDER BY 1, 2, 3 DESC
      `,
      [shiftContextId, start, end],
    );

    if (!result.rows || result.rows.length == 0) return [];

    const timeSlotGroups = result.rows.map((row: ITimeSlotGroupRow) =>
      new TimeSlotGroup(
        shiftContextId,
        start,
        end,
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

    const dates = DateLib.getDatesInRange(start, end);

    for (const timeSlotGroup of timeSlotGroups) {
      const table: TimeSlot[][] = [];

      for (const date of dates) {
        const result = await this._database.execute(
          `
            ${this._timeSlotQuery}
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

  /**
   * Determines if a team member would have no scheduling conflicts if they were assigned to a time slot
   * @param teamMemberId The team member id
   * @param timeSlot The time slot
   * @returns Whether the assignment would avoid scheduling conflicts
   */
  public async hasNoConflicts(
    teamMemberId: number,
    timeSlot: TimeSlot,
  ): Promise<"positive" | "negative" | "unknown"> {
    if (timeSlot.startDateTime == null || timeSlot.endDateTime == null) {
      return "unknown";
    }

    const result = await this._database.execute(
      `
        ${this._timeSlotQuery}
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

  /**
   * Gets time slots without assignees within the date range
   * @param start The start date
   * @param end The end date
   * @returns The array of time slots
   */
  public async getUnassigned(start: Date, end: Date): Promise<TimeSlot[]> {
    const result = await this._database.execute(
      `
        ${this._timeSlotQuery}
        WHERE teamMemberId IS NULL
          AND DATE(startDateTime) BETWEEN ? AND ?
      `,
      [start, end],
    );

    if (!result.rows || result.rows.length == 0) return [];

    return await this.populateAll(this.mapRowsToTimeSlots(result.rows));
  }
}
