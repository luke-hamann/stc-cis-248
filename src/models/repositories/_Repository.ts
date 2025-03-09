import Database from "./_Database.ts";

export default abstract class Repository {
  protected database: Database;

  constructor(database: Database) {
    this.database = database;
  }
}
