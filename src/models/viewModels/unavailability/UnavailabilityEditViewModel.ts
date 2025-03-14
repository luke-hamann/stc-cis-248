import BetterDate from "../../../_dates/BetterDate.ts";
import FormDataWrapper from "../../../_framework/FormDataWrapper.ts";
import TeamMember from "../../entities/TeamMember.ts";
import Unavailability from "../../entities/Unavailability.ts";
import FormViewModel from "../_shared/_FormViewModel.ts";

export default class UnavailabilityEditViewModel extends FormViewModel {
  public teamMember: TeamMember | null;
  public unavailability: Unavailability;

  public constructor(
    teamMember: TeamMember | null,
    unavailability: Unavailability,
    isEdit: boolean,
    errors: [],
    csrf_token: string,
  ) {
    super(isEdit, errors, csrf_token);
    this.teamMember = teamMember;
    this.unavailability = unavailability;
  }

  public static async fromRequest(
    request: Request,
  ): Promise<UnavailabilityEditViewModel> {
    const formData = new FormDataWrapper(await request.formData());

    const date = formData.getDate("date");
    const startTime = formData.getTime("startTime");
    const endTime = formData.getTime("endTime");
    const isPreference = formData.getBool("isPreference");

    const dateString = date ? BetterDate.fromDate(date).toString() : "";

    let startDateTime: Date | null = null;
    if (date != null && startTime != null) {
      startDateTime = new Date(`${dateString}T${startTime}`);
    }

    let endDateTime: Date | null = null;
    if (date != null && endTime != null) {
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

    return new UnavailabilityEditViewModel(null, unavailability, false, [], "");
  }
}
