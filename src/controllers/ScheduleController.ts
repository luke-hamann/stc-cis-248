import Context from "../models/controllerLayer/Context.ts";
import Controller2 from "./_Controller2.ts";

export default class ScheduleController extends Controller2 {
  constructor() {
    super();
    this.routes = [];
  }
}

/**
 * Schedule index GET
 */
scheduleController.register(
  "GET",
  "/(schedule\/)?",
  (context: Context) => {
    const year = new Date().getFullYear();
    return RedirectResponse(context, `/schedule/${year}/`);
  },
);

/**
 * Schedule calendar GET
 */
scheduleController.register(
  "GET",
  "/schedule/(\\d{4})/",
  (context: Context) => {
  },
);

/**
 * Schedule week GET
 */
scheduleController.register(
  "GET",
  "/schedule/(\\d{4})/(\\d{2})/(\\d{2})/",
  (context: Context) => {
  },
);

/**
 * Schedule export GET
 */
scheduleController.register(
  "GET",
  "/schedule/(\\d{4})/(\\d{2})/(\\d{2})/export/",
  (context: Context) => {
  },
);

/**
 * Schedule export POST
 */
scheduleController.register(
  "POST",
  "/schedule/(\\d{4})/(\\d{2})/(\\d{2})/export/",
  (context: Context) => {
  },
);
