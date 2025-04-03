/** Wraps a FormData object in a more developer-friendly interface */
export default class FormDataWrapper {
  /** The form data being wrapped */
  private _formData: FormData;

  /**
   * Constructs the form data wrapper
   * @param formData The original form data object
   */
  public constructor(formData: FormData) {
    this._formData = formData;
  }

  /**
   * Gets a boolean value for a form data key
   * @param key The key
   * @returns The boolean
   */
  public getBool(key: string): boolean {
    return this._formData.has(key);
  }

  /**
   * Gets a string value for a form data key
   *
   * Returns an empty string if the key does not have a value
   *
   * @param key The form data key
   * @returns The string
   */
  public getString(key: string): string {
    return (this._formData.get(key) as string ?? "").trim();
  }

  /**
   * Gets a numerical value for a form data key, or null if the key does not exist
   * @param key The form data key
   * @returns The number or null
   */
  public getNumber(key: string): number | null {
    const value = parseInt(this.getString(key));

    if (isNaN(value)) {
      return null;
    }

    return value;
  }

  /**
   * Gets an integer value for a form data key, or null if the key does not exist
   * @param key The form data key
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

  /**
   * Gets a hexadecimal color string for a form data key, or an empty string if the value is invalid
   *
   * The string is in format of hash symbol, followed by 6 hex digit characters.
   *
   * @param key The form data key
   * @returns The color string or an empty string
   */
  public getColorHex(key: string): string {
    const value = this.getString(key);
    const isValid = /^#[0123456789abcdef]{6}$/.test(value);
    return isValid ? value.substring(1) : "";
  }

  /**
   * Gets a date object for a form data key, or null if the key does not exist or the date is invalid
   *
   * The incoming form data value is expected to be in "yyyy-mm-dd" format.
   *
   * @param key The form data key
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

  /**
   * Gets a time string for a form data key, or an empty string if the key does not exist or the time is invalid
   *
   * The time string is expected to be in 24-hour "HH:MM" or "HH:MM:SS" format.
   *
   * @param key The form data key
   * @returns The time string or an empty string
   */
  public getTime(key: string): string {
    const value = this.getString(key);
    const isValid = /^(([01]\d)|(2[0-3]))(:[0-5]\d){1,2}$/g.test(value);
    return isValid ? value : "";
  }
}
