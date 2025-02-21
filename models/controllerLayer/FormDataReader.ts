export default class FormDataReader {
  private formData: FormData;

  public constructor(formData: FormData) {
    this.formData = formData;
  }

  public getString(key: string): string {
    return this.formData.get(key) as string ?? "";
  }

  public getInt(key: string): Number {
    let value = Number(this.formData.get(key))
    if (isNaN(value)) {
      return 0;
    }
  }
}
