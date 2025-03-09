import Context from "../_framework/Context.ts";
import Controller from "../_framework/Controller.ts";

export default class UnavailabilityController extends Controller {
  constructor() {
    super();
    this.routes = [
      {
        method: "GET",
        pattern: "/team-member/(\\d+)/unavailability/",
        action: this.index,
      },
      {
        method: "GET",
        pattern: "/team-member/(\\d+)/unavailability/(\\d{4})/",
        action: this.calendar,
      },
      {
        method: "GET",
        pattern:
          "/team-member/(\\d+)/unavailability/(\\d{4})/(\\d{2})/(\\d{2})/",
        action: this.weekGet,
      },
      {
        method: "POST",
        pattern:
          "/team-member/(\\d+)/unavailability/(\\d{4})/(\\d{2})/(\\d{2})/",
        action: this.weekPost,
      },
      {
        method: "GET",
        pattern: "/team-member/(\\d+)/unavailability/add/",
        action: this.addGet,
      },
      {
        method: "POST",
        pattern: "/team-member/(\\d+)/unavailability/add/",
        action: this.addPost,
      },
      {
        method: "GET",
        pattern: "/team-member/(\\d+)/unavailability/(\\d+)/edit/",
        action: this.editGet,
      },
      {
        method: "POST",
        pattern: "/team-member/(\\d+)/unavailability/(\\d+)/edit/",
        action: this.editPost,
      },
      {
        method: "GET",
        pattern: "/team-member/(\\d+)/unavailability/(\\d+)/delete/",
        action: this.deleteGet,
      },
      {
        method: "POST",
        pattern: "/team-member/(\\d+)/unavailability/(\\d+)/delete/",
        action: this.deletePost,
      },
    ];
  }

  /**
   * Team member unavailability calendar redirect GET
   */
  public index(context: Context) {
    const id = context.match[1];
    const year = new Date().getFullYear();
    const url = `/team-member/${id}/unavailability/${year}/`;

    return this.RedirectResponse(context, url);
  }

  /**
   * Team member unavailability calendar GET
   */
  public calendar(context: Context) {
  }

  /**
   * Team member unavailability week GET
   */
  public async weekGet(context: Context) {
  }

  /**
   * Team member unavailability week POST
   */
  public async weekPost(context: Context) {
  }

  /**
   * Team member unavailability week timeslot add GET
   */
  public async addGet(context: Context) {
  }

  /**
   * Team member unavailability week timeslot add POST
   */
  public async addPost(context: Context) {
  }

  /**
   * Team member unavailability week timeslot edit GET
   */
  public async editGet(context: Context) {
  }

  /**
   * Team member unavailability week timeslot edit POST
   */
  public async editPost(context: Context) {
  }

  /**
   * Team member unavailability week timeslot delete GET
   */
  public async deleteGet(context: Context) {
  }

  /**
   * Team member unavailability week timeslot delete POST
   */
  public async deletePost(context: Context) {
  }
}
