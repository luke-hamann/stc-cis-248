import {
  Client,
  ExecuteResult,
} from "https://deno.land/x/mysql@v2.12.1/mod.ts";

export default class Database {
  private static _client: Client | null = null;

  public static async execute(
    sql: string,
    params?: (string | number)[],
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
