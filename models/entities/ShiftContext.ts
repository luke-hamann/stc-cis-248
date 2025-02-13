export default class ShiftContext {
  private _id: number = 0;
  private _name: string = "";
  private _ageGroup: string = "";
  private _location: string = "";
  private _description: string = "";

  public constructor(
    id: number,
    name: string,
    ageGroup: string,
    location: string,
    description: string,
  ) {
    this.id = id;
    this.name = name;
    this.ageGroup = ageGroup;
    this.location = location;
    this.description = description;
  }

  public get id(): number {
    return this._id;
  }

  public set id(value: number) {
    this._id = value;
  }

  public get name(): string {
    return this._name;
  }

  public set name(value: string) {
    this._name = value;
  }

  public get ageGroup(): string {
    return this._ageGroup;
  }

  public set ageGroup(value: string) {
    this._ageGroup = value;
  }

  public get location(): string {
    return this._location;
  }

  public set location(value: string) {
    this._location = value;
  }

  public get description(): string {
    return this._description;
  }

  public set description(value: string) {
    this._description = value;
  }
}
