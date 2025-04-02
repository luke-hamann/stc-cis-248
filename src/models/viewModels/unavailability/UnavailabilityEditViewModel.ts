import BetterDate from "../../../_dates/BetterDate.ts";
import FormDataWrapper from "../../../_framework/FormDataWrapper.ts";
import TeamMember from "../../entities/TeamMember.ts";
import Unavailability from "../../entities/Unavailability.ts";
import FormViewModel from "../_shared/_FormViewModel.ts";

export default class UnavailabilityEditViewModel extends FormViewModel {
  public teamMember: TeamMember | null;
  public unavailability: Unavailability;
  public startDate: Date | null = null;

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

    return new UnavailabilityEditViewModel(null, unavailability, false, [], "");
  }

  public get startDateString(): string {
    if (!this.startDate) return "";
    return BetterDate.fromDate(this.startDate).toDateString();
  }

  public get cancelLink(): string {
    const date = this.unavailability.startDateTime ?? this.startDate ??
      new Date();
    const datePath = BetterDate.fromDate(date).floorToSunday().toDateString(
      "/",
    );
    return `/team-member/${this.teamMember!.id}/unavailability/${datePath}/`;
  }
}
