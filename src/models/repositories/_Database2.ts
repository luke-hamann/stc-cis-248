import {
  Client,
  ExecuteResult,
} from "https://deno.land/x/mysql@v2.12.1/mod.ts";

export class Database2 {
  private _client: Client | null = null;

  public async execute(
    sql: string,
    params?: (null | string | number | boolean | Date)[],
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
