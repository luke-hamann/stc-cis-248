// deno-lint-ignore-file no-explicit-any
import mysql from "npm:mysql2/promise";

/** Represents a database connection */
export default class Database {
  /** The database client connection pool
   *
   * Connects to a MySQL database based on environment variables:
   *
   * * DATABASE_HOSTNAME
   * * DATABASE_USERNAME
   * * DATABASE_NAME
   * * DATABASE_PASSWORD
   */
  private _pool = mysql.createPool({
    host: Deno.env.get("DATABASE_HOSTNAME"),
    user: Deno.env.get("DATABASE_USERNAME"),
    database: Deno.env.get("DATABASE_NAME"),
    password: Deno.env.get("DATABASE_PASSWORD"),
  });

  /** Executes a SQL query against a MySQL database using given parameters
   * @param sql The SQL query
   * @param params An array of positional parameters for the query
   * @returns An object containing a rows property with the result rows
   */
  public async execute(
    sql: string,
    params?: (undefined | null | string | number | boolean | Date)[],
  ): Promise<{ rows?: any[] }> {
    const rows = (await this._pool.execute(sql, params))[0] as any[];
    return { rows };
  }
}
