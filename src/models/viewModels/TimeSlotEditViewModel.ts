import Color from "../entities/Color.ts";
import FormDataWrapper from "../../_framework/FormDataWrapper.ts";
import FormViewModel from "./_FormViewModel.ts";
import ShiftContext from "../entities/ShiftContext.ts";
import TeamMember from "../entities/TeamMember.ts";
import TimeSlot from "../entities/TimeSlot.ts";
import BetterDate from "../../_dates/BetterDate.ts";

export default class TimeSlotEditViewModel extends FormViewModel {
  shiftContexts: ShiftContext[];
  teamMembers: TeamMember[];
  colors: Color[];
  timeSlot: TimeSlot;
  newColor: Color | null;
  cancel: string;

  constructor(
    shiftContexts: ShiftContext[],
    teamMembers: TeamMember[],
    colors: Color[],
    timeSlot: TimeSlot,
    newColor: Color | null,
    isEdit: boolean,
    errors: [],
    csrf_token: string,
    cancel: string,
  ) {
    super(isEdit, errors, csrf_token);
    this.shiftContexts = shiftContexts;
    this.teamMembers = teamMembers;
    this.colors = colors;
    this.timeSlot = timeSlot;
    this.newColor = newColor;
    this.cancel = cancel;
  }

  public static async fromRequest(request: Request) {
    const formData = new FormDataWrapper(await request.formData());

    const shiftContextId = formData.getInt("shiftContextId") ?? 0;
    const date = formData.getDate("date");
    const startTime = formData.getTime("startTime");
    const endTime = formData.getTime("endTime");
    const requiresAdult = formData.getBool("requiresAdult");
    const teamMemberId = formData.getInt("teamMemberId");
    const note = formData.getString("note");
    const colorId = formData.getInt("colorId");
    const newColorHex = formData.getColorHex("newColorHex");
    const newColorName = formData.getString("newColorName");

    const betterDate = date ? BetterDate.fromDate(date) : null;

    let startDateTime = null;
    if (betterDate != null && startTime != "") {
      startDateTime = new Date(betterDate.toDateString() + "T" + startTime);
    }

    let endDateTime = null;
    if (betterDate != null && endTime != "") {
      endDateTime = new Date(betterDate.toDateString() + "T" + endTime);
    }

    const timeSlot = new TimeSlot(
      0,
      shiftContextId,
      null,
      startDateTime,
      endDateTime,
      requiresAdult,
      teamMemberId,
      null,
      note,
      colorId,
      null,
    );

    let newColor = null;
    if (colorId == 0) {
      newColor = new Color(0, newColorName, newColorHex);
    }

    return new TimeSlotEditViewModel(
      [],
      [],
      [],
      timeSlot,
      newColor,
      true,
      [],
      "",
      "",
    );
  }
}
