/** A wrapper class for form data and route data */
export default class MapWrapper {
  /** The map of string keys with string values */
  private _map: Map<string, string>;

  /** Constructs the wrapper given a map
   * @param map
   */
  public constructor(map: Map<string, string>) {
    this._map = map;
  }

  /** Constructs the wrapper with an empty map
   * @returns The wrapper
   */
  public static empty(): MapWrapper {
    return new MapWrapper(new Map<string, string>());
  }

  /** Constructs the wrapper given form data
   * @param formData
   * @returns The wrapper
   */
  public static fromFormData(formData: FormData): MapWrapper {
    const map = new Map<string, string>();
    for (const [key, value] of formData.entries()) {
      map.set(key, value.toString());
    }
    return new MapWrapper(map);
  }

  /** Constructs the wrapper given route data
   *
   * The mappings consist of an array where the number refers to an index in the array from the regex match,
   * and the string refers to what that regex match component in the array should be named.
   *
   * @param matches An array of strings resulting from a Regex match result
   * @param mappings An array of mappings
   * @returns The wrapper
   */
  public static fromRouteData(
    matches: string[],
    mappings: [number, string][],
  ): MapWrapper {
    const map = new Map<string, string>();
    for (const [index, keyName] of mappings) {
      map.set(keyName, matches[index]);
    }
    return new MapWrapper(map);
  }

  /** Gets a boolean value for a key
   * @param key The key
   * @returns The boolean
   */
  public getBool(key: string): boolean {
    return this._map.has(key);
  }

  /** Gets a string value for a key
   *
   * Returns an empty string if the key does not have a value
   *
   * @param key The key
   * @returns The string
   */
  public getString(key: string): string {
    return (this._map.get(key) as string ?? "").trim();
  }

  /** Gets a numerical value for a key, or null if the key does not exist
   * @param key The key
   * @returns The number or null
   */
  public getNumber(key: string): number | null {
    const value = parseInt(this.getString(key));

    if (isNaN(value)) {
      return null;
    }

    return value;
  }

  /** Gets an integer value for a key, or null if the key does not exist
   * @param key The key
   * @returns The integer or null
   */
  public getInt(key: string): number | null {
    const value = this.getNumber(key);

    if (value == null) {
      return null;
    }

    if (value % 1 != 0) {
      return null;
    }

    return value;
  }

  /** Gets a hexadecimal color string for a key, or an empty string if the value is invalid
   *
   * The string is in format of hash symbol, followed by 6 hex digit characters.
   *
   * @param key The key
   * @returns The color string or an empty string
   */
  public getColorHex(key: string): string {
    const value = this.getString(key);
    const isValid = /^#[0123456789abcdef]{6}$/.test(value);
    return isValid ? value.substring(1) : "";
  }

  /** Gets a date object for a key, or null if the key does not exist or the date is invalid
   *
   * The incoming value is expected to be in "yyyy-mm-dd" format.
   *
   * @param key The key
   * @returns The date or null
   */
  public getDate(key: string): Date | null {
    const value = this.getString(key);
    const match = value.matchAll(/^(\d{4})-(\d{2})-(\d{2})$/g).toArray()[0];
    if (!match) return null;

    const date = new Date(
      parseInt(match[1]),
      parseInt(match[2]) - 1,
      parseInt(match[3]),
    );
    if (isNaN(date.getTime())) {
      return null;
    }

    return date;
  }

  public getDateMulti(
    yearKey: string,
    monthKey: string,
    dateKey: string,
  ): Date | null {
    const year = this.getInt(yearKey);
    const month = this.getInt(monthKey);
    const date = this.getInt(dateKey);

    if (year == null || month == null || date == null) return null;

    const out = new Date(year, month, date);
    if (isNaN(out.getTime())) return null;

    return out;
  }

  /** Gets a time string for a key, or an empty string if the key does not exist or the time is invalid
   *
   * The time string is expected to be in 24-hour "HH:MM" or "HH:MM:SS" format.
   *
   * @param key The key
   * @returns The time string or an empty string
   */
  public getTime(key: string): string {
    const value = this.getString(key);
    const isValid = /^(([01]\d)|(2[0-3]))(:[0-5]\d){1,2}$/g.test(value);
    return isValid ? value : "";
  }
}
