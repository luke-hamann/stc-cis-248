import ColorController from "./controllers/ColorController.ts";
import Context from "./models/controllerLayer/Context.ts";
import ScheduleController from "./controllers/ScheduleController.ts";
import ShiftContextController from "./controllers/ShiftContextController.ts";
import ShiftContextNoteController from "./controllers/ShiftContextNoteController.ts";
import ShiftContextPreferenceController from "./controllers/ShiftContextPreferenceController.ts";
import SubstituteController from "./controllers/SubstituteController.ts";
import TeamMemberController from "./controllers/TeamMemberController.ts";
import TimeSlotController from "./controllers/TimeSlotController.ts";
import TypicalAvailbilityController from "./controllers/TypicalAvailabilityController.ts";
import UnavailabilityController from "./controllers/UnavailabilityController.ts";
import CsrfMiddleware from "./middleware/csrfMiddleware.ts";
import SessionMiddleware from "./middleware/sessionMiddleware.ts";
import StaticFilesMiddleware from "./middleware/staticFilesMiddleware.ts";
import ResponseWrapper from "./models/controllerLayer/ResponseWrapper.ts";
import ShiftContext from "./models/entities/ShiftContext.ts";
import Unavailability from "./models/entities/Unavailability.ts";
import { Database2 } from "./models/repositories/_Database2.ts";
import ColorRepository from "./models/repositories/ColorRepository.ts";
import ShiftContextNoteRepository from "./models/repositories/ShiftContextNoteRepository.ts";
import ShiftContextPreferenceRepository from "./models/repositories/ShiftContextPreferenceRepository.ts";
import ShiftContextRepository from "./models/repositories/ShiftContextRepository.ts";
import { SubstituteRepository } from "./models/repositories/SubstituteRepository.ts";
import { TeamMemberRepository } from "./models/repositories/TeamMemberRepository.ts";
import { TimeSlotRepository } from "./models/repositories/TimeSlotRepository.ts";
import { TypicalAvailabilityRepository } from "./models/repositories/TypicalAvailabilityRepository.ts";
import { UnavailabilityRepository } from "./models/repositories/UnavailabilityRepository.ts";
import TypicalAvailabilityController from "./controllers/TypicalAvailabilityController.ts";

export default { fetch };

/** Database */

const database = new Database2();

/** Repositories */

const colorRepository = new ColorRepository(database);
const shiftContextNoteRepository = new ShiftContextNoteRepository(database);
const shiftContextPreferenceRepository = new ShiftContextPreferenceRepository(
  database,
);
const shiftContextRepository = new ShiftContextRepository(database);
const substituteRepository = new SubstituteRepository(database);
const teamMemberRepository = new TeamMemberRepository(database);
const timeSlotRepository = new TimeSlotRepository(database);
const typicalAvailabilityRepository = new TypicalAvailabilityRepository(
  database,
);
const unavailabilityRepository = new UnavailabilityRepository(database);

/** Middleware */

const csrfMiddleware = new CsrfMiddleware();
const sessionMiddleware = new SessionMiddleware();
const staticFilesMiddleware = new StaticFilesMiddleware();

/** Controllers */

const controllers = [
  new TeamMemberController(teamMemberRepository),
  new TypicalAvailabilityController(),
  new UnavailabilityController(),
  new ShiftContextController(shiftContextRepository),
  new ShiftContextPreferenceController(
    shiftContextPreferenceRepository,
    teamMemberRepository,
    shiftContextRepository,
  ),
  new ColorController(colorRepository),
  new ShiftContextNoteController(shiftContextNoteRepository, colorRepository),
  new TimeSlotController(),
  new SubstituteController(substituteRepository, teamMemberRepository),
  new ScheduleController(),
];

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
  return NotFoundResponse(context).toResponse();
}
