import MapWrapper from "../../../_framework/MapWrapper.ts";
import TeamMember from "../../entities/TeamMember.ts";
import TypicalAvailability, {
  isDayOfWeek,
} from "../../entities/TypicalAvailability.ts";
import FormViewModel from "../_shared/_FormViewModel.ts";

/** A view model for the typical availability add/edit form */
export default class TypicalAvailabilityEditViewModel extends FormViewModel {
  /** The team member the typical availability is for */
  public teamMember: TeamMember | null;

  /** The typical availability being added/edited */
  public typicalAvailability: TypicalAvailability;

  /** Constructs the view model
   * @param teamMember
   * @param typicalAvailability
   * @param isEdit
   * @param errors
   */
  public constructor(
    teamMember: TeamMember | null,
    typicalAvailability: TypicalAvailability,
    isEdit: boolean,
    errors: string[],
  ) {
    super(isEdit, errors);
    this.teamMember = teamMember;
    this.typicalAvailability = typicalAvailability;
  }

  /** Constructs a view model using incoming form data
   * @param request The HTTP request
   * @returns The view model
   */
  public static async fromRequest(
    request: Request,
  ): Promise<TypicalAvailabilityEditViewModel> {
    const formData = MapWrapper.fromFormData(await request.formData());

    const teamMemberId = formData.getInt("teamMemberId") ?? 0;
    let dayOfWeek = formData.getInt("dayOfWeek");
    const startTimeString = formData.getTime("startTime");
    const endTimeString = formData.getTime("endTime");
    const isPreference = formData.getBool("isPreference");

    if (!isDayOfWeek(dayOfWeek)) dayOfWeek = null;

    let startTime: Date | null = null;
    if (startTimeString != "") {
      startTime = new Date(`1970-01-01T${startTimeString}`);
    }

    let endTime: Date | null = null;
    if (endTimeString != "") {
      endTime = new Date(`1970-01-01T${endTimeString}`);
    }

    const typicalAvailability = new TypicalAvailability(
      0,
      teamMemberId,
      null,
      dayOfWeek,
      startTime,
      endTime,
      isPreference,
    );

    return new TypicalAvailabilityEditViewModel(
      null,
      typicalAvailability,
      false,
      [],
    );
  }
}
