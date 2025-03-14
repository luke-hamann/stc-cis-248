import FormDataWrapper from "../../_framework/FormDataWrapper.ts";
import TeamMember from "../entities/TeamMember.ts";
import TypicalAvailability, {
  isDayOfWeek,
} from "../entities/TypicalAvailability.ts";
import FormViewModel from "./_FormViewModel.ts";

export default class TypicalAvailabilityEditViewModel extends FormViewModel {
  public typicalAvailability: TypicalAvailability;

  public constructor(
    typicalAvailability: TypicalAvailability,
    isEdit: boolean,
    errors: string[],
    csrf_token: string,
  ) {
    super(isEdit, errors, csrf_token);
    this.typicalAvailability = typicalAvailability;
  }

  public static async fromRequest(
    request: Request,
  ): Promise<TypicalAvailabilityEditViewModel> {
    const formData = new FormDataWrapper(await request.formData());

    const teamMemberId = formData.getInt("teamMemberId") ?? 0;
    let dayOfWeek = formData.getInt("dayOfWeek");
    const startTime = formData.getTime("startTime");
    const endTime = formData.getTime("endTime");
    const isPreference = formData.getBool("isPreference");

    if (!isDayOfWeek(dayOfWeek)) dayOfWeek = null;

    let startTimeDate: Date | null = new Date(startTime);
    if (isNaN(startTimeDate.getTime())) startTimeDate = null;

    let endTimeDate: Date | null = new Date(endTime);
    if (isNaN(endTimeDate.getTime())) endTimeDate = null;

    const typicalAvailability = new TypicalAvailability(
      0,
      teamMemberId,
      null,
      dayOfWeek,
      startTimeDate,
      endTimeDate,
      isPreference,
    );

    return new TypicalAvailabilityEditViewModel(
      typicalAvailability,
      false,
      [],
      "",
    );
  }
}
