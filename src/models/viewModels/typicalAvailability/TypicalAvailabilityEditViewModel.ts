import FormDataWrapper from "../../../_framework/FormDataWrapper.ts";
import TeamMember from "../../entities/TeamMember.ts";
import TypicalAvailability, {
  isDayOfWeek,
} from "../../entities/TypicalAvailability.ts";
import FormViewModel from "../_shared/_FormViewModel.ts";

export default class TypicalAvailabilityEditViewModel extends FormViewModel {
  public teamMember: TeamMember | null;
  public typicalAvailability: TypicalAvailability;

  public constructor(
    teamMember: TeamMember | null,
    typicalAvailability: TypicalAvailability,
    isEdit: boolean,
    errors: string[],
    csrf_token: string,
  ) {
    super(isEdit, errors, csrf_token);
    this.teamMember = teamMember;
    this.typicalAvailability = typicalAvailability;
  }

  public static async fromRequest(
    request: Request,
  ): Promise<TypicalAvailabilityEditViewModel> {
    const formData = new FormDataWrapper(await request.formData());

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
      "",
    );
  }
}
