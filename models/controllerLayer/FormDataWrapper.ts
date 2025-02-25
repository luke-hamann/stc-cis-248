export default class FormDataWrapper {
  private formData: FormData;

  public constructor(formData: FormData) {
    this.formData = formData;
  }

  public getBool(key: string): boolean {
    return this.formData.has(key);
  }

  public getString(key: string): string {
    return (this.formData.get(key) as string).trim() ?? "";
  }

  public getNumber(key: string): number | null {
    const value = Number(this.getString(key));

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

  public getDate(key: string): Date | null {
    const value = this.getString(key);
    const timestamp = Date.parse(value);

    if (isNaN(timestamp)) {
      return null;
    }

    return new Date(timestamp);
  }
}
