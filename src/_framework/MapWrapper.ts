/** A wrapper class for form data and route data */
export default class MapWrapper {
  /** The map relating string keys to string values */
  private _map: Map<string, string>;

  /** Constructs the wrapper given a map
   * @param map The map
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
   *
   * Form data entries can potentially have more than one value for a key.
   * The wrapper assumes each key has a single value.
   * The last value for a given key within the form data entries takes precedence.
   *
   * @param formData The form data
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
   * The mappings consist of an array where the number refers to a regex group match,
   * and the string refers to what that regex group match should be named.
   *
   * @param matches An array of strings resulting from a regex match result
   * @param mappings An array mapping regex group match indexes to string names
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
    return this._map.get(key) != undefined;
  }

  /** Gets a string value for a key, or an empty string if the key does not exist or has no value
   * @param key The key
   * @returns The string
   */
  public getString(key: string): string {
    return (this._map.get(key) ?? "").trim();
  }

  /** Gets a numerical value for a key, or null if the key does not exist or has no value
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

  /** Gets an integer value for a key, or null if the key does not exist or has no value
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
   * The string is in the format of a hash symbol, followed by 6 hex digit characters.
   *
   * @param key The key
   * @returns The color string or an empty string
   */
  public getColorHex(key: string): string {
    const value = this.getString(key);
    const isValid = /^#[0123456789abcdef]{6}$/.test(value);
    return isValid ? value.substring(1) : "";
  }

  /** Gets a date for a key, or null if the key does not exist, or the date is invalid
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

  /** Gets a date based on keys referring to date components: year, month, and date
   *
   * Returns null if a valid date cannot be retrieved
   *
   * @param yearKey The key to look up the year value
   * @param monthKey The key to look up the month value
   * @param dateKey The key to look up the date value
   * @returns The date or null
   */
  public getDateMulti(
    yearKey: string,
    monthKey: string,
    dateKey: string,
  ): Date | null {
    const year = this.getInt(yearKey);
    const month = this.getInt(monthKey);
    const date = this.getInt(dateKey);

    if (year == null || month == null || date == null) return null;

    const out = new Date(year, month - 1, date);
    if (isNaN(out.getTime())) return null;

    return out;
  }

  /** Gets a date and a time based on keys referring to date components: year, month, date, hour, and minute
   *
   * Returns null if a valid date cannot be retrieved
   *
   * @param yearKey The key of the year value
   * @param monthKey The key of the month value
   * @param dateKey The key of the date value
   * @param hourKey The key of the hour value
   * @param minuteKey The key of the minute value
   * @returns The date or null
   */
  public getDateTimeMulti(
    yearKey: string,
    monthKey: string,
    dateKey: string,
    hourKey: string,
    minuteKey: string,
  ): Date | null {
    const date = this.getDateMulti(yearKey, monthKey, dateKey);
    if (date == null) return null;

    const hours = this.getInt(hourKey);
    const minutes = this.getInt(minuteKey);

    const isValidHours = hours != null && hours >= 0 && hours <= 23;
    const isValidMinutes = minutes != null && minutes >= 0 && minutes <= 59;

    if (!isValidHours || !isValidMinutes) return null;

    date.setHours(hours, minutes);

    return date;
  }

  /** Gets a time string for a key, or an empty string if the key does not exist, or the time is invalid
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

  /** Gets a URL path that is local to the web application
   *
   * Prevents [open redirection attacks](https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html).
   *
   * @param key The key of the url
   * @returns The path
   */
  public getLocalPath(key: string): string {
    return new URL(this.getString(key), "http://localhost").pathname;
  }
}
