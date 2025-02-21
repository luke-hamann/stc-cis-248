import Context from "../models/controllerLayer/Context.ts";
import Controller from "../models/controllerLayer/Controller.ts";

const timeSlotController = new Controller();
export default timeSlotController;

/**
 * Schedule time slot add GET
 */
timeSlotController.register(
  "GET",
  "/schedule/timeslot/add/",
  (context: Context) => {

  }
);

/**
 * Schedule time slot add POST
 */
timeSlotController.register(
  "POST",
  "/schedule/timeslot/add/",
  (context: Context) => {

  }
);

/**
 * Schedule time slot copy GET
 */
timeSlotController.register(
  "GET",
  "/schedule/time-slot/copy/",
  (context: Context) => {

  }
);

/**
 * Schedule time slot copy POST
 */
timeSlotController.register(
  "POST",
  "/schedule/time-slot/copy/",
  (context: Context) => {

  }
);

/**
 * Schedule time slot copy confirm GET
 */
timeSlotController.register(
  "GET",
  "/schedule/time-slot/copy-confirm/",
  (context: Context) => {

  }
);

/**
 * Schedule time slot copy confirm POST
 */
timeSlotController.register(
  "POST",
  "/schedule/time-slot/copy-confirm/",
  (context: Context) => {

  }
);

/**
 * Schedule time slot edit GET
 */
timeSlotController.register(
  "GET",
  "/schedule/time-slot/(\\d+)/edit/",
  (context: Context) => {

  }
);

/**
 * Schedule time slot edit POST
 */
timeSlotController.register(
  "POST",
  "/schedule/time-slot/(\\d+)/edit/",
  (context: Context) => {

  }
);

/**
 * Schedule time slot delete GET
 */
timeSlotController.register(
  "GET",
  "/schedule/time-slot/(\\d+)/delete/",
  (context: Context) => {

  }
);

/**
 * Schedule time slot delete POST
 */
timeSlotController.register(
  "POST",
  "/schedule/time-slot/(\\d+)/delete/",
  (context: Context) => {

  }
);

/**
 * Schedule date range clear GET
 */
timeSlotController.register(
  "GET",
  "/schedule/clear/",
  (context: Context) => {

  }
);

/**
 * Schedule date range clear POST
 */
timeSlotController.register(
  "POST",
  "/schedule/clear/",
  (context: Context) => {

  }
);
