import AssigneeRecommendations from "../../entities/AssigneeRecommendation.ts";
import TimeSlot from "../../entities/TimeSlot.ts";
import IViewModel from "../_shared/IViewModel.ts";

export default class AssigneeRecommendationsViewModel implements IViewModel {
  public timeSlot: TimeSlot;
  public recommendations: AssigneeRecommendations[];
  public csrf_token: string = "";

  public constructor(
    timeSlot: TimeSlot,
    recommendations: AssigneeRecommendations[],
  ) {
    this.timeSlot = timeSlot;
    this.recommendations = recommendations;
  }
}
