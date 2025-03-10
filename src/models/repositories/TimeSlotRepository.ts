import ShiftContext from "../entities/ShiftContext.ts";
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
  private shiftContextRepository: ShiftContextRepository;
  private colorRepository: ColorRepository;
  private teamMemberRepository: TeamMemberRepository;

  constructor(
    database: Database,
    shiftContextRepository: ShiftContextRepository,
    colorRepository: ColorRepository,
    teamMemberRepository: TeamMemberRepository,
  ) {
    super(database);
    this.shiftContextRepository = shiftContextRepository;
    this.colorRepository = colorRepository;
    this.teamMemberRepository = teamMemberRepository;
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

  public async getTimeslotsInRange(
    start: Date,
    end: Date,
  ): Promise<TimeSlot[]> {
    const result = await this.database.execute(
      `
        SELECT id, shiftContextId, startDateTime, endDateTime, requiresAdult, teamMemberId, note, colorId
        FROM Timeslots
        WHERE DATE(startDateTime) BETWEEN ? AND ?
        ORDER BY startDateTime
      `,
      [start.toISOString(), end.toISOString()],
    );

    if (!result.rows) return [];

    const timeSlots = this.mapRowsToTimeSlots(result.rows);

    for (let i = 0; i < timeSlots.length; i++) {
      const shiftContextId = timeSlots[i].shiftContextId;
      const colorId = timeSlots[i].colorId;
      const teamMemberId = timeSlots[i].teamMemberId;

      timeSlots[i].shiftContext = await this.shiftContextRepository
        .getShiftContext(shiftContextId);

      if (colorId != null) {
        timeSlots[i].color = await this.colorRepository.getColor(colorId);
      }

      if (teamMemberId != null) {
        timeSlots[i].teamMember = await this.teamMemberRepository.getTeamMember(
          teamMemberId,
        );
      }
    }

    return timeSlots;
  }
}
