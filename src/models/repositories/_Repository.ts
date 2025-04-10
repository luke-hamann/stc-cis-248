import Database from "./_Database.ts";

/** Represents a generic repository for working with an entity table in a database */
export default abstract class Repository {
  /** The database connection */
  protected _database: Database;

  /** Constructs the repository using a database connection
   * @param database The database connection
   */
  constructor(database: Database) {
    this._database = database;
  }
}
