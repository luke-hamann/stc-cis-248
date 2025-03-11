import TimeSlot from "../entities/TimeSlot.ts";
import Database from "./_Database.ts";
import Repository from "./_Repository.ts";
import ColorRepository from "./ColorRepository.ts";
import ShiftContextRepository from "./ShiftContextRepository.ts";
import TeamMemberRepository from "./TeamMemberRepository.ts";

interface ITimeSlotRow {
  id: number;
  shiftContextId: number;
  startDateTime: string;
  endDateTime: string;
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
      new Date(row.startDateTime),
      new Date(row.endDateTime),
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
}
