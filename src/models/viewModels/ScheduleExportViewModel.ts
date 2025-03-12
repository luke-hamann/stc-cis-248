import BetterDate from "../../_dates/BetterDate.ts";

export default class ScheduleExportViewModel {
  public title: string;
  public startDate: BetterDate;
  public endDate: BetterDate;
  public format: "csv" | "excel" | null;
  public csrf_token: string;

  public constructor(
    title: string,
    startDate: BetterDate,
    endDate: BetterDate,
    format: "csv" | "excel" | null,
    csrf_token: string,
  ) {
    this.title = title;
    this.startDate = startDate;
    this.endDate = endDate;
    this.format = format;
    this.csrf_token = csrf_token;
  }

  public get cancelLink() {
    const weekStart = this.startDate.floorToSunday();
    const component = weekStart.toDateString().replaceAll("-", "/");
    return `/schedule/${component}/`;
  }
}
