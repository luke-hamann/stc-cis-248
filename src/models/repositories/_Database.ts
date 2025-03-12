import {
  Client,
  ExecuteResult,
} from "https://deno.land/x/mysql@v2.12.1/mod.ts";

/**
 * Represents a database connection
 */
export default class Database {
  /** The database client connection */
  private _client: Client | null = null;

  /**
   * Executes a SQL query against a MySQL database using given parameters
   *
   * Connects to a MySQL database based on environment variables:
   *
   * * DATABASE_HOSTNAME
   * * DATABASE_USERNAME
   * * DATABASE_NAME
   * * DATABASE_PASSWORD
   *
   * @param sql The SQL query
   * @param params An array of positional parameters for the query
   * @returns A promise of the query {@link ExecuteResult}
   */
  public async execute(
    sql: string,
    params?: (undefined | null | string | number | boolean | Date)[],
  ): Promise<ExecuteResult> {
    if (this._client == null) {
      this._client = await new Client().connect({
        hostname: Deno.env.get("DATABASE_HOSTNAME"),
        username: Deno.env.get("DATABASE_USERNAME"),
        db: Deno.env.get("DATABASE_NAME"),
        password: Deno.env.get("DATABASE_PASSWORD"),
      });
    }

    return await this._client.execute(sql, params);
  }
}
