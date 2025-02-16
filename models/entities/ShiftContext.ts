export default class ShiftContext {
  public id: number = 0;
  public name: string = "";
  public ageGroup: string = "";
  public location: string = "";
  public description: string = "";

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
}
