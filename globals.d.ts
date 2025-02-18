type HTTPMethod = "GET" | "POST";

type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

interface IContext {
  csrf_token: string;
}

type IActionHandler = (
  request: Request,
  match: string[],
  context: IContext,
) => void | IContext | Response | Promise<void | IContext | Response>;

/**
 * Entity interfaces
 */

interface IColor {
  id: number;
  name: string;
  hex: string;
}

interface IShiftContext {
  id: number;
  name: string;
  ageGroup: string;
  location: string;
  description: string;
}

interface IShiftContextNote {
  shiftContextId: number;
  date: Date;
  note: string;
  colorId: number;
}

interface IShiftContextPreference {
  teamMemberId: number;
  shiftContextId: number;
}

interface ISubstitute {
  teamMemberId: number;
  date: Date;
}

interface ITeamMember {
  id: number;
  firstName: string;
  middleName: string;
  lastName: string;
  birthDate: Date;
  email: string;
  phone: string;
  isExternal: boolean;
  maxWeeklyHours: number;
  maxWeeklyDays: number;
  username: string;
  password: string;
  isAdmin: boolean;
}

interface ITimeSlot {
  id: number;
  shiftContextId: number;
  startDateTime: Date;
  endDateTime: Date;
  requiresAdult: boolean;
  teamMemberId: number;
  note: string;
  colorId: number;
}
