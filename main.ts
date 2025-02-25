import { NotFoundResponse } from "./controllers/_utilities.ts";
import { colorController } from "./controllers/ColorController.ts";
import { scheduleController } from "./controllers/ScheduleController.ts";
import { shiftContextController } from "./controllers/ShiftContextController.ts";
import { shiftContextNoteController } from "./controllers/ShiftContextNoteController.ts";
import { shiftContextPreferenceController } from "./controllers/ShiftContextPreferenceController.ts";
import { substituteController } from "./controllers/SubstituteController.ts";
import { teamMemberController } from "./controllers/TeamMemberController.ts";
import { timeSlotController } from "./controllers/TimeSlotController.ts";
import { typicalAvailbilityController } from "./controllers/TypicalAvailabilityController.ts";
import { unavailabilityController } from "./controllers/UnavailabilityController.ts";
import csrfMiddleware from "./middleware/csrfMiddleware.ts";
import sessionMiddleware from "./middleware/sessionMiddleware.ts";
import staticFilesMiddleware from "./middleware/staticFilesMiddleware.ts";
import Context from "./models/controllerLayer/Context.ts";
import ResponseWrapper from "./models/controllerLayer/ResponseWrapper.ts";

export default { fetch };

const controllers = [
  sessionMiddleware,
  csrfMiddleware,
  staticFilesMiddleware,
  teamMemberController,
  typicalAvailbilityController,
  unavailabilityController,
  shiftContextController,
  shiftContextPreferenceController,
  colorController,
  shiftContextNoteController,
  timeSlotController,
  substituteController,
  scheduleController,
];

async function fetch(request: Request): Promise<Response> {
  const context = new Context(request, new ResponseWrapper());

  // Controllers
  for (const controller of controllers) {
    const response = await controller.execute(context);

    if (response) {
      return response.toResponse();
    }
  }

  // 404 Page
  return NotFoundResponse(context).toResponse();
}
