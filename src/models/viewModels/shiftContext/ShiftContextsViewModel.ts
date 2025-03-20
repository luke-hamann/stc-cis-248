import ShiftContext from "../../entities/ShiftContext.ts";

export default class ShiftContextsViewModel {
  public shiftContexts: ShiftContext[] = [];

  public constructor(shiftContexts: ShiftContext[]) {
    this.shiftContexts = shiftContexts;
  }
}
