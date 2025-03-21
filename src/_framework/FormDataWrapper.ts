export default class FormDataWrapper {
  private formData: FormData;

  public constructor(formData: FormData) {
    this.formData = formData;
  }

  public getBool(key: string): boolean {
    return this.formData.has(key);
  }

  public getString(key: string): string {
    return (this.formData.get(key) as string ?? "").trim();
  }

  public getNumber(key: string): number | null {
    const value = parseInt(this.getString(key));

    if (isNaN(value)) {
      return null;
    }

    return value;
  }

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

  public getColorHex(key: string): string {
    const value = this.getString(key);
    const isValid = /^#[0123456789abcdef]{6}$/.test(value);
    return isValid ? value.substring(1) : "";
  }

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

  public getTime(key: string): string {
    const value = this.getString(key);
    const isValid = /^(([01]\d)|(2[0-3]))(:[0-5]\d){1,2}$/g.test(value);
    return isValid ? value : "";
  }
}
