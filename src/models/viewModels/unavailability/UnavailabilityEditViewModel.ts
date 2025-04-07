import BetterDate from "../../../_dates/BetterDate.ts";
import FormDataWrapper from "../../../_framework/FormDataWrapper.ts";
import TeamMember from "../../entities/TeamMember.ts";
import Unavailability from "../../entities/Unavailability.ts";
import FormViewModel from "../_shared/_FormViewModel.ts";

/** A view model for the unavailability add/edit form */
export default class UnavailabilityEditViewModel extends FormViewModel {
  /** The team member the unavailability is for */
  public teamMember: TeamMember | null;

  /** The unavailability being added/edited */
  public unavailability: Unavailability;

  /** The start date of the unavailability from the form */
  public startDate: Date | null = null;

  /** Constructs the view model
   * @param teamMember
   * @param unavailability
   * @param isEdit
   * @param errors
   */
  public constructor(
    teamMember: TeamMember | null,
    unavailability: Unavailability,
    isEdit: boolean,
    errors: [],
  ) {
    super(isEdit, errors);
    this.teamMember = teamMember;
    this.unavailability = unavailability;
  }

  /** Constructs a view model using incoming form data
   * @param request The HTTP request
   * @returns The view model
   */
  public static async fromRequest(
    request: Request,
  ): Promise<UnavailabilityEditViewModel> {
    const formData = new FormDataWrapper(await request.formData());

    const date = formData.getDate("date");
    const startTime = formData.getTime("startTime");
    const endTime = formData.getTime("endTime");
    const isPreference = formData.getBool("isPreference");

    const dateString = date ? BetterDate.fromDate(date).toDateString() : "";

    let startDateTime: Date | null = null;
    if (date != null && startTime != "") {
      startDateTime = new Date(`${dateString}T${startTime}`);
    }

    let endDateTime: Date | null = null;
    if (date != null && endTime != "") {
      endDateTime = new Date(`${dateString}T${endTime}`);
    }

    const unavailability = new Unavailability(
      0,
      0,
      null,
      startDateTime,
      endDateTime,
      isPreference,
    );

    return new UnavailabilityEditViewModel(null, unavailability, false, []);
  }

  /** Gets the start date as a string in yyyy-mm-dd format */
  public get startDateString(): string {
    if (!this.startDate) return "";
    return BetterDate.fromDate(this.startDate).toDateString();
  }

  /** Gets the cancel link for the form */
  public get cancelLink(): string {
    const date = this.unavailability.startDateTime ?? this.startDate ??
      new Date();
    const datePath = BetterDate.fromDate(date).floorToSunday().toDateString(
      "/",
    );
    return `/team-member/${this.teamMember!.id}/unavailability/${datePath}/`;
  }
}
