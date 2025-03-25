import ShiftContext from "../../entities/ShiftContext.ts";
import IViewModel from "../_shared/IViewModel.ts";

export default class ShiftContextsViewModel implements IViewModel {
  public csrf_token: string;
  public shiftContexts: ShiftContext[] = [];

  public constructor(shiftContexts: ShiftContext[], csrf_token: string) {
    this.shiftContexts = shiftContexts;
    this.csrf_token = csrf_token;
  }
}
