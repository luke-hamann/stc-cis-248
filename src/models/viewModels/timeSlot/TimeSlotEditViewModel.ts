import Color from "../../entities/Color.ts";
import FormViewModel from "../_shared/_FormViewModel.ts";
import ShiftContext from "../../entities/ShiftContext.ts";
import TeamMember from "../../entities/TeamMember.ts";
import TimeSlot from "../../entities/TimeSlot.ts";
import BetterDate from "../../../_dates/BetterDate.ts";
import AssigneeRecommendations from "../../entities/AssigneeRecommendation.ts";
import MapWrapper from "../../../_framework/MapWrapper.ts";

/** A view model for the time slot add/edit form */
export default class TimeSlotEditViewModel extends FormViewModel {
  /** The shift contexts the time slot can be group within */
  shiftContexts: ShiftContext[];

  /** An array of team members */
  teamMembers: TeamMember[];

  /** An array of time slot assignee recommendations */
  recommendations: AssigneeRecommendations[];

  /** The list of possible colors for the time slot note */
  colors: Color[];

  /** The time slot being added/edited */
  timeSlot: TimeSlot;

  /** The potential new color for the time slot note */
  newColor: Color | null;

  /** The url for the cancel link on the form */
  cancel: string;

  /** Constructs the view model
   * @param shiftContexts
   * @param teamMembers
   * @param recommendations
   * @param colors
   * @param timeSlot
   * @param newColor
   * @param isEdit
   * @param errors
   * @param cancel
   */
  constructor(
    shiftContexts: ShiftContext[],
    teamMembers: TeamMember[],
    recommendations: AssigneeRecommendations[],
    colors: Color[],
    timeSlot: TimeSlot,
    newColor: Color | null,
    isEdit: boolean,
    errors: [],
    cancel: string,
  ) {
    super(isEdit, errors);
    this.shiftContexts = shiftContexts;
    this.teamMembers = teamMembers;
    this.recommendations = recommendations;
    this.colors = colors;
    this.timeSlot = timeSlot;
    this.newColor = newColor;
    this.cancel = cancel;
  }

  /** Constructs a view model using incoming form data
   * @param request The incoming HTTP request
   * @returns The view model
   */
  public static async fromRequest(request: Request) {
    const formData = MapWrapper.fromFormData(await request.formData());

    const timeSlotId = formData.getInt("timeSlotId") ?? 0;
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
      timeSlotId,
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

    const cancelLink = formData.getLocalPath("cancelLink");

    return new TimeSlotEditViewModel(
      [],
      [],
      [],
      [],
      timeSlot,
      newColor,
      true,
      [],
      cancelLink,
    );
  }
}
