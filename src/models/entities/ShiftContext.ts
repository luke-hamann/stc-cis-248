/** Represents a shift context that a time slot can take place within */
export default class ShiftContext {
  /** The shift context id */
  public id: number = 0;

  /** The shift context name */
  public name: string = "";

  /** The shift context age group */
  public ageGroup: string = "";

  /** The shift context location */
  public location: string = "";

  /** The shift context description */
  public description: string = "";

  /** The sort priority index */
  public sortPriority: number = 0;

  /** Constructs the shift context
   * @param id
   * @param name
   * @param ageGroup
   * @param location
   * @param description
   * @param sortPriority
   */
  public constructor(
    id: number,
    name: string,
    ageGroup: string,
    location: string,
    description: string,
    sortPriority: number,
  ) {
    this.id = id;
    this.name = name;
    this.ageGroup = ageGroup;
    this.location = location;
    this.description = description;
    this.sortPriority = sortPriority;
  }

  /** Constructs an empty shift context
   * @returns The shift context
   * @constructor
   */
  public static empty() {
    return new ShiftContext(0, "", "", "", "", 0);
  }
}
