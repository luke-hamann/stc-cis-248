import Context from "../_framework/Context.ts";
import Controller from "../_framework/Controller.ts";

export default class TypicalAvailabilityController extends Controller {
  constructor() {
    super();
    this.routes = [
      {
        method: "GET",
        pattern: "/team-member/(\\d+)/typical-availability/",
        action: this.viewTypicalAvailability,
      },
      {
        method: "GET",
        pattern: "/team-member/(\\d+)/typical-availability/add/",
        action: this.addTimeSlotGet,
      },
      {
        method: "POST",
        pattern: "/team-member/(\\d+)/typical-availability/add/",
        action: this.addTimeSlotPost,
      },
      {
        method: "GET",
        pattern: "/team-member/(\\d+)/typical-availability/(\\d+)/edit/",
        action: this.editTimeSlotGet,
      },
      {
        method: "POST",
        pattern: "/team-member/(\\d+)/typical-availability/(\\d+)/edit/",
        action: this.editTimeSlotPost,
      },
      {
        method: "GET",
        pattern: "/team-member/(\\d+)/typical-availability/(\\d+)/delete/",
        action: this.deleteTimeSlotGet,
      },
      {
        method: "POST",
        pattern: "/team-member/(\\d+)/typical-availability/(\\d+)/delete/",
        action: this.deleteTimeSlotPost,
      },
    ];
  }

  /**
   * Team member typical availability GET
   */
  public async viewTypicalAvailability(context: Context) {
  }

  /**
   * Team member typical availability time slot add GET
   */
  public async addTimeSlotGet(context: Context) {
  }

  /**
   * Team member typical availability time slot add POST
   */
  public async addTimeSlotPost(context: Context) {
  }

  /**
   * Team member typical availability timeslot edit GET
   */
  public async editTimeSlotGet(context: Context) {
  }

  /**
   * Team member typical availability timeslot edit POST
   */
  public async editTimeSlotPost(context: Context) {
  }

  /**
   * Team member typical availability timeslot delete GET
   */
  public async deleteTimeSlotGet(context: Context) {
  }

  /**
   * Team member typical availability timeslot delete POST
   */
  public async deleteTimeSlotPost(context: Context) {
  }
}
