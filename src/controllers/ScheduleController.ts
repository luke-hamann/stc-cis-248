import Context from "../_framework/Context.ts";
import Controller from "../_framework/Controller.ts";

export default class ScheduleController extends Controller {
  constructor() {
    super();
    this.routes = [
      { method: "GET", pattern: "/(schedule\/)?", action: this.index },
      { method: "GET", pattern: "/schedule/(\\d{4})/", action: this.calendar },
      {
        method: "GET",
        pattern: "/schedule/(\\d{4})/(\\d{2})/(\\d{2})/",
        action: this.week,
      },
      { method: "GET", pattern: "/schedule/export/", action: this.exportGet },
      { method: "POST", pattern: "/schedule/export/", action: this.exportPost },
    ];
  }

  /**
   * Schedule index GET
   */
  public index(context: Context) {
    const year = new Date().getFullYear();
    return this.RedirectResponse(context, `/schedule/${year}/`);
  }

  /**
   * Schedule calendar GET
   */
  public calendar(context: Context) {
  }

  /**
   * Schedule week GET
   */
  public async week(context: Context) {
  }

  /**
   * Schedule export GET
   */
  public async exportGet(context: Context) {
  }

  /**
   * Schedule export POST
   */
  public async exportPost(context: Context) {
  }
}
