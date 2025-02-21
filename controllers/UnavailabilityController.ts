import Context from "../models/controllerLayer/Context.ts";
import Controller from "../models/controllerLayer/Controller.ts";
import { RedirectResponse } from "./_utilities.ts";

const unavailabilityController = new Controller();
export default unavailabilityController;

/**
 * Team member unavailability calendar redirect GET
 */
unavailabilityController.register(
  "GET",
  "/team-member/(\\d+)/unavailability/",
  (context: Context) => {
    const id = context.match[1];
    const year = new Date().getFullYear();
    const url = `/team-member/${id}/unavailability/${year}/`;

    return RedirectResponse(context, url);
  },
);

/**
 * Team member unavailability calendar GET
 */
unavailabilityController.register(
  "GET",
  "/team-member/(\\d+)/unavailability/(\\d{4})/",
  (context: Context) => {
  },
);

/**
 * Team member unavailability week GET
 */
unavailabilityController.register(
  "GET",
  "/team-member/(\\d+)/unavailability/(\\d{4})/(\\d{2})/(\\d{2})/",
  (context: Context) => {
  },
);

/**
 * Team member unavailability week POST
 */
unavailabilityController.register(
  "POST",
  "/team-member/(\\d+)/unavailability/(\\d{4})/(\\d{2})/(\\d{2})/",
  (context: Context) => {
  },
);

/**
 * Team member unavailability week timeslot add GET
 */
unavailabilityController.register(
  "GET",
  "/team-member/(\\d+)/unavailability/add/",
  (context: Context) => {
  },
);

/**
 * Team member unavailability week timeslot add POST
 */
unavailabilityController.register(
  "POST",
  "/team-member/(\\d+)/unavailability/add/",
  (context: Context) => {
  },
);

/**
 * Team member unavailability week timeslot edit GET
 */
unavailabilityController.register(
  "GET",
  "/team-member/(\\d+)/unavailability/(\\d+)/edit/",
  (context: Context) => {
  },
);

/**
 * Team member unavailability week timeslot edit POST
 */
unavailabilityController.register(
  "GET",
  "/team-member/(\\d+)/unavailability/(\\d+)/edit/",
  (context: Context) => {
  },
);

/**
 * Team member unavailability week timeslot delete GET
 */
unavailabilityController.register(
  "GET",
  "/team-member/(\\d+)/unavailability/(\\d+)/delete/",
  (context: Context) => {
  },
);

/**
 * Team member unavailability week timeslot delete POST
 */
unavailabilityController.register(
  "POST",
  "/team-member/(\\d+)/unavailability/(\\d+)/delete/",
  (context: Context) => {
  },
);
