type HTTPMethod = "GET" | "POST";

interface IApplicationContext {
  csrf: string;
}

type HandlerResult = Promise<Response | IApplicationContext | void>;

type Handler = (
  request: Request,
  match: string[],
  context: IApplicationContext,
) => HandlerResult;

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
