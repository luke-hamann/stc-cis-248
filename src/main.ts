import Controller from "./_framework/Controller.ts";
import Router from "./controllers/_Router.ts";
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
  database,
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
  new StaticFilesMiddleware(),
  new SessionMiddleware(),
  new CsrfMiddleware(),
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

const router = new Router(controllers);

/**
 * The entry point of the application
 *
 * Passes requests to the router and returns the router's response
 *
 * @param request HTTP request
 * @returns HTTP response
 */
export default async function fetch(request: Request): Promise<Response> {
  return await router.route(request);
}
