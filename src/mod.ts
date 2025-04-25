/** This is the systems documentation of Scheduler App.
 *
 * Scheduler App is a program for managing the schedules of team members.
 *
 * It follows an MVC architecture and a repository pattern for the data layer.
 *
 * ## Installation
 *
 * A warning about database connections:
 * MySQL login credential changes do not always take immediate effect.
 * There may be situations where the application spins up but throws database connection errors when attempting to access it in the browser.
 * If you are sure all the database credentials match, you might just need to wait a few minutes before attempting to access the application again.
 *
 * ### Prerequisites
 *
 * 1. Download the repository...
 *    * via git:
 *      ```
 *      git clone https://github.com/luke-hamann/stc-cis-248.git
 *      ```
 *    * via ZIP extract:
 *      ```
 *      https://github.com/luke-hamann/stc-cis-248/archive/refs/heads/master.zip
 *      ```
 * 2. Create a `.env` file in the root directory of the repository with this content:
 *    ```
 *    ENVIRONMENT=development
 *    DATABASE_HOSTNAME=localhost
 *    DATABASE_USERNAME=<username>
 *    DATABASE_NAME=<name>
 *    DATABASE_PASSWORD=<password>
 *    ```
 * 3. If you want to run the app in production mode, set the ENVIRONMENT in the .env file to "production".
 *
 * ### Development
 *
 * 0. Complete the [prerequisites](#prerequisites).
 * 1. Install [deno].
 * 2. Install [Visual Studio Code].
 *    * (Recommended) Install [Deno language server client].
 *    * (Recommended) Install [Tailwind CSS IntelliSense].
 *    * (Recommended) Install [Jinja extension].
 * 3. Install [WampServer].
 * 4. Download the Tailwind CSS CLI:
 *    ```
 *    https://github.com/tailwindlabs/tailwindcss/releases/download/v4.1.3/tailwindcss-windows-x64.exe
 *    ```
 * 5. Move the Tailwind executable into the root directory of the repository.
 * 6. Create the database and database user with phpMyAdmin:
 *    1. Create a database with the DATABASE_NAME name specified above.
 *    2. Create a database user with the DATABASE_USERNAME and DATABASE_PASSWORD credentials specified above.
 *    3. Import `./src/sql/build.sql`.
 *    4. (Optional) Import `./src/sql/build.sql` (if you want sample data).
 *    5. Grant SELECT, INSERT, UPDATE, and DELETE privleges on the database to the user you created.
 * 7. Return to Visual Studio Code.
 * 8. Press `F5`. The Tailwind CSS build should spin up.
 * 9. Press `F5` again. The application server should spin up.
 * 10. The application should be available at `http://localhost:8000/`.
 *
 * Once the Tailwind build process is spun up, running the app again should only require pressing `F5` once.
 *
 * [deno]: https://docs.deno.com/runtime/getting_started/installation/
 * [Deno language server client extension]: https://marketplace.visualstudio.com/items?itemName=denoland.vscode-deno
 * [Tailwind CSS IntelliSense]: https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss
 * [Jinja extension]: https://marketplace.visualstudio.com/items?itemName=wholroyd.jinja
 * [WampServer]: https://www.wampserver.com/en/
 * [Visual Studio Code]: https://code.visualstudio.com/
 *
 * ### Docker
 *
 * 0. Complete the [prerequisites](#prerequisites).
 * 1. Install [Docker Desktop] or [Docker Engine].
 * 2. Open the repository directory.
 * 5. Spin up the containers:
 *    ```
 *    docker compose up
 *    ```
 * 6. Wait for everything to spin up.
 *    * Scheduler App will be available at <http://localhost:8000/>.
 *    * A phpMyAdmin instance will be available at <http://localhost:8001/>.
 *
 * [Docker Desktop]: https://docs.docker.com/desktop/
 * [Docker Engine]: https://docs.docker.com/engine/install/
 *
 * ## Building documentation
 *
 * ### Systems documentation
 *
 * After downloading the repository and installing deno, the systems documentation can be built with [deno doc]:
 *
 * ```
 * deno doc --name="Scheduler App Systems Documentation" --html ./src/mod.ts
 * ```
 *
 * The documentation website will be saved in the `docs` directory.
 *
 * [deno doc]: https://docs.deno.com/runtime/reference/cli/doc/
 *
 * ### User guides
 *
 * To build the user guides:
 *
 * 1. Ensure you are running a Windows machine with Google Chrome installed.
 * 2. Set up the development environment (using the sample data) as described above.
 * 3. Install [mdBook](https://github.com/rust-lang/mdBook/releases).
 * 4. Ensure the application is running and functional.
 * 5. Build the user guide screenshots:
 *    ```
 *    deno run -A ./user-guides/screenshots.ts
 *    ```
 * 6. Build the user guides:
 *    ```
 *    mdbook build user-guides
 *    ```
 *
 * The user guides website will be saved in the `user-guides/book` directory.
 *
 * ## Framework modules
 *
 * ### Date module
 *
 * * {@link BetterDate}
 * * {@link CalendarMonthPage}
 * * {@link DateLib}
 * * {@link DayOfWeek}
 *
 * ### Web framework module
 *
 * * {@link Context}
 * * {@link Controller}
 * * {@link MapWrapper}
 * * {@link ResponseWrapper}
 * * {@link Route}
 *
 * ## Database
 *
 * The database consists of 9 tables:
 *
 * * TeamMembers
 * * ShiftContexts
 * * Colors
 * * ShiftContextNotes
 * * TeamMemberAvailability
 * * TeamMemberTypicalAvailability
 * * TeamMemberShiftContextPreferences
 * * TimeSlots
 * * Substitutes
 *
 * Note: The TeamMemberAvailability table lists special times the team member is *unavailabile*.
 * The TeamMemberTypicalAvailability table lists days of the week and times the team member is typically available.
 *
 * ### Columns
 *
 * * TeamMembers
 *    * id (int) - Id
 *    * firstName (varchar) - First name
 *    * middleName (varchar) - Middle name
 *    * lastName (varchar) - Last name
 *    * birthDate (date) - Birth date
 *    * email (varchar) - Email address
 *    * phone (varchar) - Phone number
 *    * isExternal (bool) - Whether the team member is an external resource
 *    * maxWeeklyHours (int) - Maximum number of hours per week the team member can work
 *    * maxWeeklyDays (int) - Maximum number of days per week the team member can work
 *    * username (varchar) - Username
 *    * password (varchar) - Password
 *    * isAdmin (bool) - Whether the team member is an admin user
 * * ShiftContexts
 *    * id (int) - Id
 *    * name (varchar) - Name
 *    * ageGroup (varchar) - Age group
 *    * location (varchar) - Location
 *    * description (varchar) - Description
 *    * sortPriority (int) - Sort priority
 * * Colors
 *    * id (int) - Id
 *    * name (varchar) - Name
 *    * hex (varchar) - The RGB color hex code
 * * ShiftContextNotes
 *    * shiftContextId (int) - Shift context id
 *    * date (date) - Date
 *    * note (varchar) - Note content
 *    * colorId (int) - Note color id
 * * TeamMememberAvailability
 *    * id (int) - Id
 *    * teamMemberId (int) - Team member id
 *    * startDateTime (datetime) - Start date time
 *    * endDateTime (datetime) - End date time
 *    * isPreference (bool) - Whether the team member finds the availability slot preferable
 * * TeamMemberTypicalAvailability
 *    * id (int) - Id
 *    * teamMemberId (int) - Team member id
 *    * dayOfWeek (int) - Day of the week (0 for Sunday through 6 for Saturday)
 *    * startTime (time) - Start time
 *    * endTime (time) - End time
 *    * isPreference (bool) - Whether the team member finds the typical availability slot preferable
 * * TeamMemberShiftContextPreferences
 *    * teamMemberId (int) - Team member id
 *    * shiftContextId (int) - Shift context id
 *    * isPreference (bool) - Whether the team member prefers the shift context
 *      (Note: The absense of an entry for a given combination of a team member and shift context indicates no preference.)
 * * TimeSlots
 *    * id (int) - Id
 *    * shiftContextId (int) - Shift context id
 *    * startDateTime (datetime) - The start date and time
 *    * endDateTime (datetime) - The end date and time
 *    * requiresAdult (bool) - Whether the time slot requires an adult
 *    * teamMemberId (int) - Team member (assignee) id
 *    * note (varchar) - Note content
 *    * colorId (int) - Color id of the note content
 * * Substitutes
 *    * teamMemberId (id) - Team member id
 *    * date (date) - Date
 *
 * ## Models
 *
 * ### Entities
 *
 * * {@link Color Color}
 * * {@link ShiftContext Shift Context}
 * * {@link ShiftContextNote Shift Context Note}
 * * {@link ShiftContextPreference Shift Context Preference}
 * * {@link TeamMember Team Member}
 * * {@link TimeSlot Time Slot}
 * * {@link TypicalAvailability Typical Availability}
 * * {@link Unavailability Unavailability}
 *
 * ### Helper entites
 *
 * * {@link AssigneeRecommendations Assignee Recommendations}
 * * {@link Schedule Schedule}
 * * {@link Substitute Substitute}
 * * {@link SubstituteList Substitute List}
 * * {@link TimeSlotGroup Time Slot Group}
 *
 * ### View models
 *
 * * Shared
 *    * {@link FormViewModel}
 *    * {@link ViewModel}
 *    * {@link CalendarViewPartial}
 *    * {@link DeleteViewModel}
 *    * {@link ErrorViewModel}
 * * Color
 *    * {@link ColorEditViewModel}
 *    * {@link ColorsViewModel}
 * * Schedule
 *    * {@link ScheduleClearViewModel}
 *    * {@link ScheduleCopyViewModel}
 *    * {@link ScheduleExportViewModel}
 *    * {@link ScheduleWeekViewModel}
 * * Shift context
 *    * {@link ShiftContextEditViewModel}
 *    * {@link ShiftContextReorderViewModel}
 *    * {@link ShiftContextsViewModel}
 * * Shift context note
 *    * {@link ShiftContextNoteEditViewModel}
 * * Shift context preference
 *    * {@link ShiftContextPreferencesEditViewModel}
 * * Substitute
 *    * {@link SubstitutesEditViewModel}
 * * Team member
 *    * {@link TeamMemberEditViewModel}
 *    * {@link TeamMembersViewModel}
 * * Time slot
 *    * {@link AssigneeRecommendationsViewModel}
 *    * {@link TimeSlotEditViewModel}
 * * Typical availability
 *    * {@link TypicalAvailabilityEditViewModel}
 *    * {@link TypicalAvailabilityListViewModel}
 * * Unavailability
 *    * {@link UnavailabilityEditViewModel}
 *    * {@link UnavailabilityWeekViewModel}
 *    * {@link UnavailabilityYearViewModel}
 *
 * ## Controllers
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
 * ## Data layer
 *
 * ### Relational database
 *
 * * {@link Database Database}
 * * {@link Repository Repository}
 *
 * ### Key-value store
 *
 * * {@link KeyStore}
 * * {@link IKeyStore}
 * * {@link IKeyValue}
 *
 * ### Repositories
 *
 * * {@link ColorRepository Color Repository}
 * * {@link ScheduleRepository Schedule Repository}
 * * {@link ShiftContextRepository Shift Context Repository}
 * * {@link ShiftContextNoteRepository Shift Context Note Repository}
 * * {@link ShiftContextPreferenceRepository Shift Context Preference Repository}
 * * {@link SubstituteRepository Substitute Repository}
 * * {@link TeamMemberRepository Team Member Repository}
 * * {@link TimeSlotRepository Time Slot Repository}
 * * {@link TypicalAvailabilityRepository Typical Availability Repository}
 * * {@link UnavailabilityRepository Unavailability Repository}
 *
 * ### Repository interfaces
 *
 * * {@link IColorRepository}
 * * {@link IScheduleRepository}
 * * {@link IShiftContextRepository}
 * * {@link IShiftContextNoteRepository}
 * * {@link IShiftContextPreferenceRepository}
 * * {@link ISubstituteRepository}
 * * {@link ITeamMemberRepository}
 * * {@link ITimeSlotRepository}
 * * {@link ITypicalAvailabilityRepository}
 * * {@link IUnavailabilityRepository}
 *
 * ## Views
 *
 * * _shared/
 *   * _layout.html - The base layout for all pages
 *   * calendar.html - A macro for rendering a calendar given a calendar model
 *   * csrf.html - A macro for rendering an anti-csrf input element within all forms
 *   * delete.html - A generic delete confirmation page
 *   * error.html - A generic error page
 *   * field.html - A macro for rendering a label and input within a form
 *   * formatDate.html - A macro for formatting a date as a string in yyyy-mm-dd format
 *   * formatTime.html - A macro for formatting a time as a string in hh:mm format
 *   * formErrors.html - A macro for rendering a list of form errors
 *   * inlineStyles.html - A macro for rendering a list of inline CSS styles
 *   * teamMemberTabs.html - A macro for rendering tabs on the team member profile pages
 * * color/
 *   * edit.html - The color add/edit form
 *   * list.html - The color list page
 * * schedule/
 *   * export.html - The schedule export form
 *   * week.html - The schedule week editor page
 *   * year.html - The schedule year page
 * * shiftContext/
 *   * edit.html - The shift context add/edit form
 *   * list.html - The shift context list page
 * * shiftContextNote/
 *   * edit.html - The shift context note add/edit form
 * * shiftContextPreference
 *   * edit.html - The shift context preferences view/edit form
 * * substitute/
 *   * edit.html - The daily substitute list view/edit form
 * * teamMember/
 *   * edit.html - The team member add/edit form
 *   * list.html - The team member list page
 *   * profile.html - The team member profile page
 * * timeSlot/
 *   * assigneeRecommendations.html - A partial for rendering a table of time slot assignee recommendations
 *   * clear.html - The time slot date range clear form
 *   * copy.html - The time slot date range copy form
 *   * copyPreview.html - The time slot date range copy preview confirmation form
 *   * edit.html - The time slot add/edit form
 * * typicalAvailability/
 *   * edit.html - The team member typical availability add/edit form
 *   * list.html - The team member typical availability list page
 * * unavailability/
 *   * edit.html - The team member unavailability add/edit form
 *   * week.html - The team member unavailability week list
 *   * year.html - The team member unavailability calendar year
 *
 * @module
 */

// Date library

export { default as BetterDate } from "./_dates/BetterDate.ts";
export { default as CalendarMonthPage } from "./_dates/CalendarMonthPage.ts";
export { default as DateLib } from "./_dates/DateLib.ts";
export type { DayOfWeek } from "./_dates/DayOfWeek.ts";

// Web framework library

export { default as Context } from "./_framework/Context.ts";
export { default as Controller } from "./_framework/Controller.ts";
export { default as MapWrapper } from "./_framework/MapWrapper.ts";
export { default as ResponseWrapper } from "./_framework/ResponseWrapper.ts";
export { default as Route } from "./_framework/Route.ts";

// Controllers

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

// Middleware

export { default as CsrfMiddleware } from "./middleware/CsrfMiddleware.ts";
export { default as SessionMiddleware } from "./middleware/SessionMiddleware.ts";
export { default as StaticFilesMiddleware } from "./middleware/StaticFilesMiddleware.ts";

// Models - entities

export { default as AssigneeRecommendation } from "./models/entities/AssigneeRecommendation.ts";
export { default as Color } from "./models/entities/Color.ts";
export { default as Schedule } from "./models/entities/Schedule.ts";
export { default as ScheduleWarnings } from "./models/entities/ScheduleWarnings.ts";
export { default as ShiftContext } from "./models/entities/ShiftContext.ts";
export { default as ShiftContextNote } from "./models/entities/ShiftContextNote.ts";
export { default as ShiftContextPreference } from "./models/entities/ShiftContextPreference.ts";
export { default as Substitute } from "./models/entities/Substitute.ts";
export { default as SubstituteList } from "./models/entities/SubstituteList.ts";
export { default as TeamMember } from "./models/entities/TeamMember.ts";
export { default as TimeSlot } from "./models/entities/TimeSlot.ts";
export { default as TimeSlotGroup } from "./models/entities/TimeSlotGroup.ts";
export { default as TimeSlotPossibility } from "./models/entities/TimeSlotPossibility.ts";
export { default as TimeSlotWarnings } from "./models/entities/TimeSlotWarnings.ts";
export { default as TypicalAvailability } from "./models/entities/TypicalAvailability.ts";
export { default as Unavailability } from "./models/entities/Unavailability.ts";

// Models - repositories

export { default as Database } from "./models/repositories/_Database.ts";
export { default as Repository } from "./models/repositories/_Repository.ts";
export type {
  default as ColorRepository,
  IColorRepository,
  IColorRow,
} from "./models/repositories/ColorRepository.ts";
export type {
  default as ScheduleRepository,
  IMaxWeeklyDaysViolationRow,
  IMaxWeeklyHoursViolationRow,
  IScheduleRepository,
  IShiftContextRowComponent,
  ITeamMemberRowComponent,
  ITeamMemberTimeSlotTimeSlotRow,
  ITimeSlotRowComponent,
  ITimeSlotTeamMemberRow,
  ITimeSlotTeamMemberShiftContextRow,
} from "./models/repositories/ScheduleRepository.ts";
export type {
  default as ShiftContextNoteRepository,
  IShiftContextNoteRepository,
  IShiftContextNoteRow,
} from "./models/repositories/ShiftContextNoteRepository.ts";
export type {
  default as ShiftContextPreferenceRepository,
  IShiftContextPreferenceRepository,
  ShiftContextPreferencesList,
} from "./models/repositories/ShiftContextPreferenceRepository.ts";
export type {
  default as ShiftContextRepository,
  IShiftContextRepository,
  IShiftContextRow,
} from "./models/repositories/ShiftContextRepository.ts";
export type {
  default as SubstituteRepository,
  ISubstituteRepository,
  ISubstituteRow,
} from "./models/repositories/SubstituteRepository.ts";
export type {
  default as TeamMemberRepository,
  ITeamMemberRepository,
  ITeamMemberRow,
} from "./models/repositories/TeamMemberRepository.ts";
export type {
  default as TimeSlotRepository,
  ITimeSlotGroupRow,
  ITimeSlotRepository,
  ITimeSlotRow,
} from "./models/repositories/TimeSlotRepository.ts";
export type {
  default as TypicalAvailabilityRepository,
  ITypicalAvailabilityRepository,
  ITypicalAvailabilityRow,
} from "./models/repositories/TypicalAvailabilityRepository.ts";
export type {
  default as UnavailabilityRepository,
  IUnavailabilityRepository,
  IUnavailabilityRow,
} from "./models/repositories/UnavailabilityRepository.ts";

// View models

export { default as FormViewModel } from "./models/viewModels/_shared/_FormViewModel.ts";
export { default as ViewModel } from "./models/viewModels/_shared/_ViewModel.ts";
export { default as CalendarViewPartial } from "./models/viewModels/_shared/CalendarViewPartial.ts";
export { default as DeleteViewModel } from "./models/viewModels/_shared/DeleteViewModel.ts";
export { default as ErrorViewModel } from "./models/viewModels/_shared/ErrorViewModel.ts";
export { default as ColorEditViewModel } from "./models/viewModels/color/ColorEditViewModel.ts";
export { default as ColorsViewModel } from "./models/viewModels/color/ColorsViewModel.ts";
export { default as ScheduleClearViewModel } from "./models/viewModels/schedule/ScheduleClearViewModel.ts";
export { default as ScheduleCopyViewModel } from "./models/viewModels/schedule/ScheduleCopyViewModel.ts";
export { default as ScheduleExportViewModel } from "./models/viewModels/schedule/ScheduleExportViewModel.ts";
export { default as ScheduleWeekViewModel } from "./models/viewModels/schedule/ScheduleWeekViewModel.ts";
export { default as ShiftContextEditViewModel } from "./models/viewModels/shiftContext/ShiftContextEditViewModel.ts";
export { default as ShiftContextReorderModel } from "./models/viewModels/shiftContext/ShiftContextReorderViewModel.ts";
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

export { default as fetch } from "./main.ts";
