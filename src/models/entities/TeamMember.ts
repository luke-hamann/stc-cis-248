import BetterDate from "../../_dates/BetterDate.ts";

export default class TeamMember {
  public id: number = 0;
  public firstName: string = "";
  public middleName: string = "";
  public lastName: string = "";
  public birthDate: Date | null = null;
  public email: string = "";
  public phone: string = "";
  public isExternal: boolean = false;
  public maxWeeklyHours: number | null = null;
  public maxWeeklyDays: number | null = null;
  public username: string = "";
  public password: string = "";
  public isAdmin: boolean = false;

  public constructor(
    id: number,
    firstName: string,
    middleName: string,
    lastName: string,
    birthDate: Date | null,
    email: string,
    phone: string,
    isExternal: boolean,
    maxWeeklyHours: number | null,
    maxWeeklyDays: number | null,
    username: string,
    password: string,
    isAdmin: boolean,
  ) {
    this.id = id;
    this.firstName = firstName;
    this.middleName = middleName;
    this.lastName = lastName;
    this.birthDate = birthDate;
    this.email = email;
    this.phone = phone;
    this.isExternal = isExternal;
    this.maxWeeklyHours = maxWeeklyHours;
    this.maxWeeklyDays = maxWeeklyDays;
    this.username = username;
    this.password = password;
    this.isAdmin = isAdmin;
  }

  public static empty(): TeamMember {
    return new TeamMember(
      0,
      "",
      "",
      "",
      null,
      "",
      "",
      false,
      null,
      null,
      "",
      "",
      false,
    );
  }

  public toString(): string {
    return this.fullName;
  }

  public get fullName(): string {
    return this.firstName + " " + this.lastName;
  }

  public get birthDateString(): string {
    return this.birthDate
      ? BetterDate.fromDate(this.birthDate).toDateString()
      : "";
  }
}
