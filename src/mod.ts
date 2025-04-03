/**
 * This is the systems documentation of Scheduler App.
 *
 * Scheduler App is a program for managing the schedules of team members.
 *
 * It follows an MVC architecture and a repository pattern for the data layer.
 *
 * Models:
 *
 * * {@link AssigneeRecommendation Assignee Recommendation}
 * * {@link Color Color}
 * * {@link Schedule Schedule}
 * * {@link ShiftContext Shift Context}
 * * {@link ShiftContextNote Shift Context Note}
 * * {@link ShiftContextPreference Shift Context Preference}
 * * {@link Substitute Substitute}
 * * {@link SubstituteList Substitute List}
 * * {@link TeamMember Team Member}
 * * {@link TimeSlot Time Slot}
 * * {@link TimeSlotGroup Time Slot Group}
 * * {@link TypicalAvailability Typical Availability}
 * * {@link Unavailability Unavailability}
 *
 * Controllers:
 *
 * * {@link ColorController Color}
 * * {@link ScheduleController Schedule}
 * * {@link ShiftContextController Shift Context}
 * * {@link ShiftContextNoteController Shift Context Note}
 * * {@link ShiftContextPreferenceController Shift Context Preference}
 * * {@link SubstituteController Substitute}
 * * {@link TeamMemberController Team Member}
 * * {@link TimeSlotController Time Slot}
 * * {@link TypicalAvailabilityController Typical Availability}
 * * {@link UnavailabilityController Unavailability}
 *
 * Repositories:
 *
 * * {@link ColorRepository Color}
 * * {@link ScheduleRepository Schedule}
 * * {@link ShiftContextRepository Shift Context}
 * * {@link ShiftContextNoteRepository Shift Context Note}
 * * {@link ShiftContextPreferenceRepository Shift Context Preference}
 * * {@link SubstituteRepository Substitute}
 * * {@link TeamMemberRepository Team Member}
 * * {@link TimeSlotRepository Time Slot}
 * * {@link TypicalAvailabilityRepository Typical Availability}
 * * {@link UnavailabilityRepository Unavailability}
 *
 * @module
 */

export { default as BetterDate } from "./_dates/BetterDate.ts";
export { default as DateLib } from "./_dates/DateLib.ts";

export { default as Context } from "./_framework/Context.ts";
export { default as Controller } from "./_framework/Controller.ts";
export { default as FormDataWrapper } from "./_framework/FormDataWrapper.ts";
export { type HTTPMethod } from "./_framework/HTTPMethod.ts";
export { default as ResponseWrapper } from "./_framework/ResponseWrapper.ts";

export { default as Router } from "./controllers/_Router.ts";
export { default as ColorController } from "./controllers/ColorController.ts";
export { default as SheduleController } from "./controllers/ScheduleController.ts";
export { default as ShiftContextController } from "./controllers/ShiftContextController.ts";
export { default as ShiftContextNoteController } from "./controllers/ShiftContextNoteController.ts";
export { default as ShiftContextPreferenceController } from "./controllers/ShiftContextPreferenceController.ts";
export { default as SubstituteController } from "./controllers/SubstituteController.ts";
export { default as TeamMemberController } from "./controllers/TeamMemberController.ts";
export { default as TimeSlotController } from "./controllers/TimeSlotController.ts";
export { default as TypicalAvailabilityController } from "./controllers/TypicalAvailabilityController.ts";
export { default as UnavailabilityController } from "./controllers/UnavailabilityController.ts";

export { default as CsrfMiddleware } from "./middleware/CsrfMiddleware.ts";
export { default as SessionMiddleware } from "./middleware/SessionMiddleware.ts";
export { default as StaticFilesMiddleware } from "./middleware/StaticFilesMiddleware.ts";

export { default as AssigneeRecommendation } from "./models/entities/AssigneeRecommendation.ts";
export { default as Color } from "./models/entities/Color.ts";
export { default as Schedule } from "./models/entities/Schedule.ts";
export { default as ShiftContext } from "./models/entities/ShiftContext.ts";
export { default as ShiftContextNote } from "./models/entities/ShiftContextNote.ts";
export { default as ShiftContextPreference } from "./models/entities/ShiftContextPreference.ts";
export { default as Substitute } from "./models/entities/Substitute.ts";
export { default as SubstituteList } from "./models/entities/SubstituteList.ts";
export { default as TeamMember } from "./models/entities/TeamMember.ts";
export { default as TimeSlot } from "./models/entities/TimeSlot.ts";
export { default as TimeSlotGroup } from "./models/entities/TimeSlotGroup.ts";
export { default as TypicalAvailability } from "./models/entities/TypicalAvailability.ts";
export { default as Unavailability } from "./models/entities/Unavailability.ts";

export { default as Database } from "./models/repositories/_Database.ts";
export { default as Repository } from "./models/repositories/_Repository.ts";
export { default as ColorRepository } from "./models/repositories/ColorRepository.ts";
export { default as ScheduleRepository } from "./models/repositories/ScheduleRepository.ts";
export { default as ShiftContextNoteRepository } from "./models/repositories/ShiftContextNoteRepository.ts";
export { default as ShiftContextPreferenceRepository } from "./models/repositories/ShiftContextPreferenceRepository.ts";
export { default as ShiftContextRepository } from "./models/repositories/ShiftContextRepository.ts";
export { default as SubstituteRepository } from "./models/repositories/SubstituteRepository.ts";
export { default as TeamMemberRepository } from "./models/repositories/TeamMemberRepository.ts";
export { default as TimeSlotRepository } from "./models/repositories/TimeSlotRepository.ts";
export { default as TypicalAvailabilityRepository } from "./models/repositories/TypicalAvailabilityRepository.ts";
export { default as UnavailabilityRepository } from "./models/repositories/UnavailabilityRepository.ts";

export { default as FormViewModel } from "./models/viewModels/_shared/_FormViewModel.ts";
export type { default as ViewModel } from "./models/viewModels/_shared/_ViewModel.ts";
export { default as ColorEditViewModel } from "./models/viewModels/color/ColorEditViewModel.ts";
export { default as ColorsViewModel } from "./models/viewModels/color/ColorsViewModel.ts";
export { default as ScheduleClearViewModel } from "./models/viewModels/schedule/ScheduleClearViewModel.ts";
export { default as ScheduleCopyViewModel } from "./models/viewModels/schedule/ScheduleCopyViewModel.ts";
export { default as ScheduleExportViewModel } from "./models/viewModels/schedule/ScheduleExportViewModel.ts";
export { default as ScheduleWeekViewModel } from "./models/viewModels/schedule/ScheduleWeekViewModel.ts";
export { default as ShiftContextEditViewModel } from "./models/viewModels/shiftContext/ShiftContextEditViewModel.ts";
export { default as ShiftContextsViewModel } from "./models/viewModels/shiftContext/ShiftContextsViewModel.ts";
export { default as ShiftContextNoteEditViewModel } from "./models/viewModels/shiftContextNote/ShiftContextNoteEditViewModel.ts";
export { default as ShiftContextPreferencesEditViewModel } from "./models/viewModels/shiftContextPreference/ShiftContextPreferencesEditViewModel.ts";
export { default as SubstitutesEditViewModel } from "./models/viewModels/substitute/SubstitutesEditViewModel.ts";
export { default as TeamMemberEditViewModel } from "./models/viewModels/teamMember/TeamMemberEditViewModel.ts";
export { default as TeamMembersViewModel } from "./models/viewModels/teamMember/TeamMembersViewModel.ts";
export { default as AssigneeRecommendationsViewModel } from "./models/viewModels/timeSlot/AssigneeRecommendationsViewModel.ts";
export { default as TimeSlotEditViewModel } from "./models/viewModels/timeSlot/TimeSlotEditViewModel.ts";
export { default as TypicalAvailabilityEditViewModel } from "./models/viewModels/typicalAvailability/TypicalAvailabilityEditViewModel.ts";
export { default as TypicalAvailabilityListViewModel } from "./models/viewModels/typicalAvailability/TypicalAvailabilityListViewModel.ts";
export { default as UnavailabilityEditViewModel } from "./models/viewModels/unavailability/UnavailabilityEditViewModel.ts";
export { default as UnavailabilityWeekViewModel } from "./models/viewModels/unavailability/UnavailabilityWeekViewModel.ts";
export { default as UnavailabilityYearViewModel } from "./models/viewModels/unavailability/UnavailabilityYearViewModel.ts";
export { default as CalendarViewPartial } from "./models/viewModels/_shared/CalendarViewPartial.ts";
export { default as DeleteViewModel } from "./models/viewModels/_shared/DeleteViewModel.ts";
export { default as ErrorViewModel } from "./models/viewModels/_shared/ErrorViewModel.ts";

export { default as fetch } from "./main.ts";
