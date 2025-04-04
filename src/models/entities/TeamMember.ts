import BetterDate from "../../_dates/BetterDate.ts";

/** Represents a team member */
export default class TeamMember {
  /** The team member id */
  public id: number = 0;

  /** The team member's first name */
  public firstName: string = "";

  /** The team member's middle name */
  public middleName: string = "";

  /** The team member's last name */
  public lastName: string = "";

  /** The team member's birth date */
  public birthDate: Date | null = null;

  /** The team member's email address */
  public email: string = "";

  /** The team member's phone number */
  public phone: string = "";

  /** Whether the team member is an external resource */
  public isExternal: boolean = false;

  /** The maximum number of hours per week the team member can work */
  public maxWeeklyHours: number | null = null;

  /** The maximum number of days per week the team member can work */
  public maxWeeklyDays: number | null = null;

  /** The team member's username */
  public username: string = "";

  /** The team member's password */
  public password: string = "";

  /** Whether the team member is an admin user */
  public isAdmin: boolean = false;

  /**
   * Constructs the team member
   * @param id
   * @param firstName
   * @param middleName
   * @param lastName
   * @param birthDate
   * @param email
   * @param phone
   * @param isExternal
   * @param maxWeeklyHours
   * @param maxWeeklyDays
   * @param username
   * @param password
   * @param isAdmin
   */
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

  /** Gets the full name of the team member */
  public get fullName(): string {
    return this.firstName + " " + this.lastName;
  }

  /** Gets the birth date as a string in yyyy-mm-dd format */
  public get birthDateString(): string {
    return this.birthDate
      ? BetterDate.fromDate(this.birthDate).toDateString()
      : "";
  }
}
