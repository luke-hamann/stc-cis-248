import AssigneeRecommendations from "../../entities/AssigneeRecommendation.ts";
import TimeSlot from "../../entities/TimeSlot.ts";
import ViewModel from "../_shared/_ViewModel.ts";

/** A view model for listing time slot assignee recommendations */
export default class AssigneeRecommendationsViewModel extends ViewModel {
  /** The time slot the recommendations are for */
  public timeSlot: TimeSlot;

  /** The list of recommendations */
  public recommendations: AssigneeRecommendations[];

  /** Constructs the view model
   * @param timeSlot
   * @param recommendations
   */
  public constructor(
    timeSlot: TimeSlot,
    recommendations: AssigneeRecommendations[],
  ) {
    super();
    this.timeSlot = timeSlot;
    this.recommendations = recommendations;
  }
}
