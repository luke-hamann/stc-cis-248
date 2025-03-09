import Context from "../_framework/Context.ts";
import Controller from "../_framework/Controller.ts";

export default class TimeSlotController extends Controller {
  constructor() {
    super();
    this.routes = [
      {
        method: "GET",
        pattern: "/schedule/timeslot/add/",
        action: this.addGet,
      },
      {
        method: "POST",
        pattern: "/schedule/timeslot/add/",
        action: this.addPost,
      },
      {
        method: "GET",
        pattern: "/schedule/timeslot/copy/",
        action: this.copyGet,
      },
      {
        method: "POST",
        pattern: "/schedule/timeslot/copy/",
        action: this.copyPost,
      },
      {
        method: "GET",
        pattern: "/schedule/timeslot/copy-confirm/",
        action: this.copyConfirmGet,
      },
      {
        method: "POST",
        pattern: "/schedule/timeslot/copy-confirm/",
        action: this.copyConfirmPost,
      },
      {
        method: "GET",
        pattern: "/schedule/time-slot/(\\d+)/edit/",
        action: this.editGet,
      },
      {
        method: "POST",
        pattern: "/schedule/time-slot/(\\d+)/edit/",
        action: this.editPost,
      },
      {
        method: "GET",
        pattern: "/schedule/time-slot/(\\d+)/delete/",
        action: this.deleteGet,
      },
      {
        method: "POST",
        pattern: "/schedule/time-slot/(\\d+)/delete/",
        action: this.deletePost,
      },
      { method: "GET", pattern: "/schedule/clear/", action: this.clearGet },
      { method: "POST", pattern: "/schedule/clear/", action: this.clearPost },
    ];
  }

  /**
   * Schedule time slot add GET
   */
  public async addGet(context: Context) {
  }

  /**
   * Schedule time slot add POST
   */
  public async addPost(context: Context) {
  }

  /**
   * Schedule time slot copy GET
   */
  public async copyGet(context: Context) {
  }

  /**
   * Schedule time slot copy POST
   */
  public async copyPost(context: Context) {
  }

  /**
   * Schedule time slot copy confirm GET
   */
  public async copyConfirmGet(context: Context) {
  }

  /**
   * Schedule time slot copy confirm POST
   */
  public async copyConfirmPost(context: Context) {
  }

  /**
   * Schedule time slot edit GET
   */
  public async editGet(context: Context) {
  }

  /**
   * Schedule time slot edit POST
   */
  public async editPost(context: Context) {
  }

  /**
   * Schedule time slot delete GET
   */
  public async deleteGet(context: Context) {
  }

  /**
   * Schedule time slot delete POST
   */
  public async deletePost(context: Context) {
  }

  /**
   * Schedule date range clear GET
   */
  public async clearGet(context: Context) {
  }

  /**
   * Schedule date range clear POST
   */
  public async clearPost(context: Context) {
  }
}
