import AssigneeRecommendations from "../../entities/AssigneeRecommendation.ts";
import TimeSlot from "../../entities/TimeSlot.ts";
import ViewModel from "../_shared/_ViewModel.ts";

export default class AssigneeRecommendationsViewModel extends ViewModel {
  public timeSlot: TimeSlot;
  public recommendations: AssigneeRecommendations[];

  public constructor(
    timeSlot: TimeSlot,
    recommendations: AssigneeRecommendations[],
  ) {
    super();
    this.timeSlot = timeSlot;
    this.recommendations = recommendations;
  }
}
