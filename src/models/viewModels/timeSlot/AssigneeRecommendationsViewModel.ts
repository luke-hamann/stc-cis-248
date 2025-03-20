import AssigneeRecommendations from "../../entities/AssigneeRecommendation.ts";
import TimeSlot from "../../entities/TimeSlot.ts";

export default class AssigneeRecommendationsViewModel {
  public timeSlot: TimeSlot;
  public recommendations: AssigneeRecommendations[];

  public constructor(
    timeSlot: TimeSlot,
    recommendations: AssigneeRecommendations[],
  ) {
    this.timeSlot = timeSlot;
    this.recommendations = recommendations;
  }
}
