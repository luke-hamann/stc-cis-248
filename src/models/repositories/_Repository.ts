import Database2 from "./_Database2.ts";

export default abstract class Repository {
  protected database: Database2;

  constructor(database: Database2) {
    this.database = database;
  }
}
