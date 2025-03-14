import Context from "./_framework/Context.ts";
import Controller from "./_framework/Controller.ts";
import ResponseWrapper from "./_framework/ResponseWrapper.ts";
import ColorController from "./controllers/ColorController.ts";
import ScheduleController from "./controllers/ScheduleController.ts";
import ShiftContextController from "./controllers/ShiftContextController.ts";
import ShiftContextNoteController from "./controllers/ShiftContextNoteController.ts";
import ShiftContextPreferenceController from "./controllers/ShiftContextPreferenceController.ts";
import SubstituteController from "./controllers/SubstituteController.ts";
import TeamMemberController from "./controllers/TeamMemberController.ts";
import TimeSlotController from "./controllers/TimeSlotController.ts";
import TypicalAvailabilityController from "./controllers/TypicalAvailabilityController.ts";
import UnavailabilityController from "./controllers/UnavailabilityController.ts";
import CsrfMiddleware from "./middleware/CsrfMiddleware.ts";
import SessionMiddleware from "./middleware/SessionMiddleware.ts";
import StaticFilesMiddleware from "./middleware/StaticFilesMiddleware.ts";
import Database from "./models/repositories/_Database.ts";
import ColorRepository from "./models/repositories/ColorRepository.ts";
import ScheduleRepository from "./models/repositories/ScheduleRepository.ts";
import ShiftContextNoteRepository from "./models/repositories/ShiftContextNoteRepository.ts";
import ShiftContextPreferenceRepository from "./models/repositories/ShiftContextPreferenceRepository.ts";
import ShiftContextRepository from "./models/repositories/ShiftContextRepository.ts";
import SubstituteRepository from "./models/repositories/SubstituteRepository.ts";
import TeamMemberRepository from "./models/repositories/TeamMemberRepository.ts";
import TimeSlotRepository from "./models/repositories/TimeSlotRepository.ts";
import TypicalAvailabilityRepository from "./models/repositories/TypicalAvailabilityRepository.ts";
import UnavailabilityRepository from "./models/repositories/UnavailabilityRepository.ts";

export default { fetch };

/** Database */

const database = new Database();

/** Repositories */

const colorRepository = new ColorRepository(database);
const shiftContextPreferenceRepository = new ShiftContextPreferenceRepository(
  database,
);
const shiftContextRepository = new ShiftContextRepository(database);
const substituteRepository = new SubstituteRepository(database);
const teamMemberRepository = new TeamMemberRepository(database);
const shiftContextNoteRepository = new ShiftContextNoteRepository(
  database,
  colorRepository,
  shiftContextRepository,
);
const timeSlotRepository = new TimeSlotRepository(
  database,
  shiftContextRepository,
  colorRepository,
  teamMemberRepository,
);
const typicalAvailabilityRepository = new TypicalAvailabilityRepository(
  database,
);
const unavailabilityRepository = new UnavailabilityRepository(database);
const scheduleRepository = new ScheduleRepository(
  shiftContextRepository,
  shiftContextNoteRepository,
  shiftContextPreferenceRepository,
  substituteRepository,
  teamMemberRepository,
  timeSlotRepository,
  typicalAvailabilityRepository,
  unavailabilityRepository,
);

/** Controllers */

const controllers: Controller[] = [
  new CsrfMiddleware(),
  new SessionMiddleware(),
  new StaticFilesMiddleware(),
  new TeamMemberController(teamMemberRepository),
  new TypicalAvailabilityController(
    teamMemberRepository,
    typicalAvailabilityRepository,
  ),
  new UnavailabilityController(teamMemberRepository, unavailabilityRepository),
  new ShiftContextController(shiftContextRepository),
  new ShiftContextPreferenceController(
    shiftContextPreferenceRepository,
    teamMemberRepository,
    shiftContextRepository,
  ),
  new ColorController(colorRepository),
  new ShiftContextNoteController(shiftContextNoteRepository, colorRepository),
  new TimeSlotController(
    shiftContextRepository,
    teamMemberRepository,
    colorRepository,
    scheduleRepository,
    shiftContextNoteRepository,
    substituteRepository,
    timeSlotRepository,
  ),
  new SubstituteController(substituteRepository, teamMemberRepository),
  new ScheduleController(scheduleRepository),
];

/**
 * Accepts an HTTP {@link Request} and promises an HTTP {@link Response}
 *
 * Application entry point
 *
 * @param request The HTTP request
 * @returns An HTTP response
 */
async function fetch(request: Request): Promise<Response> {
  let response;
  const context = new Context(request, new ResponseWrapper());

  // Controllers
  for (const controller of controllers) {
    try {
      response = await controller.execute(context);
    } catch (error: unknown) {
      response = new ResponseWrapper();
      response.status = 500;
      response.headers.set("Content-Type", "text/plain");
      response.body = (error as Error).message + "\n\n" +
        (error as Error).stack;
    }

    if (response) {
      return response.toResponse();
    }
  }

  // 404 Page
  response = new ResponseWrapper();
  response.status = 404;
  response.headers.set("Content-Type", "text/plain");
  response.body = "404 Not Found";
  return response.toResponse();
}
