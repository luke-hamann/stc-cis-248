import DateLib from "../../_dates/DateLib.ts";
import TimeSlot from "../entities/TimeSlot.ts";
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

export default class TimeSlotRepository extends Repository {
  private shiftContexts: ShiftContextRepository;
  private colors: ColorRepository;
  private teamMembers: TeamMemberRepository;
  private readonly baseQuery = `
    SELECT id, shiftContextId, startDateTime, endDateTime, requiresAdult, teamMemberId, note, colorId
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
      row.requiresAdult == 1 ? true : false,
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

  public async validate(t: TimeSlot): Promise<string[]> {
    return await Promise.resolve([]);
  }

  public async getOnDate(date: Date): Promise<TimeSlot[]> {
    const result = await this.database.execute(
      `${this.baseQuery} WHERE DATE(startDateTime) = ?`,
      [date.toISOString().substring(0, 10)],
    );

    if (!result.rows) return [];

    return this.mapRowsToTimeSlots(result.rows);
  }

  public async getInDateRange(start: Date, end: Date): Promise<TimeSlot[]> {
    const result = await this.database.execute(
      `
        ${this.baseQuery}
        WHERE DATE(startDateTime) BETWEEN ? AND ?
      `,
      [
        start.toISOString().substring(0, 10),
        end.toISOString().substring(0, 10),
      ],
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
      `${this.baseQuery} WHERE shiftContextId = ? AND DATE(startDateTime) = ?`,
      [shiftContextId, date.toISOString().substring(0, 10)],
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
      `${this.baseQuery} WHERE id = ?`,
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

  public async deleteInDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<void> {
    await this.database.execute(
      `
        DELETE FROM TimeSlots
        WHERE DATE(startDateTime) BETWEEN ? AND ?
      `,
      [
        startDate.toISOString().substring(0, 10),
        endDate.toISOString().substring(0, 10),
      ],
    );
  }

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
        tempDate.setUTCHours(0, 0, 0, 0);

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
}
