export default class TeamMember {
  private _id: number = 0;
  private _firstName: string = "";
  private _middleName: string = "";
  private _lastName: string = "";
  private _birthDate: Date | null = null;
  private _email: string = "";
  private _phone: string = "";
  private _isExternal: boolean = false;
  private _maxWeeklyHours: number | null = null;
  private _maxWeeklyDays: number | null = null;
  private _username: string = "";
  private _password: string = "";
  private _isAdmin: boolean = false;

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

  public get id(): number {
    return this._id;
  }

  public set id(value: number) {
    this._id = value;
  }

  public get firstName(): string {
    return this._firstName;
  }

  public set firstName(value: string) {
    this._firstName = value;
  }

  public get middleName(): string {
    return this._middleName;
  }

  public set middleName(value: string) {
    this._middleName = value;
  }

  public get lastName(): string {
    return this._lastName;
  }

  public set lastName(value: string) {
    this._lastName = value;
  }

  public get birthDate(): Date | null {
    return this._birthDate;
  }

  public set birthDate(value: Date | null) {
    this._birthDate = value;
  }

  public get email(): string {
    return this._email;
  }

  public set email(value: string) {
    this._email = value;
  }

  public get phone(): string {
    return this._phone;
  }

  public set phone(value: string) {
    this._phone = value;
  }

  public get isExternal(): boolean {
    return this._isExternal;
  }

  public set isExternal(value: boolean) {
    this._isExternal = value;
  }

  public get maxWeeklyHours(): number | null {
    return this._maxWeeklyHours;
  }

  public set maxWeeklyHours(value: number | null) {
    this._maxWeeklyHours = value;
  }

  public get maxWeeklyDays(): number | null {
    return this._maxWeeklyDays;
  }

  public set maxWeeklyDays(value: number | null) {
    this._maxWeeklyDays = value;
  }

  public get username(): string {
    return this._username;
  }

  public set username(value: string) {
    this._username = value;
  }

  public get password(): string {
    return this._password;
  }

  public set password(value: string) {
    this._password = value;
  }

  public get isAdmin(): boolean {
    return this._isAdmin;
  }

  public set isAdmin(value: boolean) {
    this._isAdmin = value;
  }
}
