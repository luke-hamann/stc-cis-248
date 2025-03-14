import Recommendation from "../entities/Recommendation.ts";
import TimeSlot from "../entities/TimeSlot.ts";

export default class AssigneeRecommendationsViewModel {
  public timeSlot: TimeSlot;
  public recommendations: Recommendation[];

  public constructor(timeSlot: TimeSlot, recommendations: Recommendation[]) {
    this.timeSlot = timeSlot;
    this.recommendations = recommendations;
  }
}
