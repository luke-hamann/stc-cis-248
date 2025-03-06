import Database from "./_Database.ts";

export class SubstituteRepository {
  public async getSubstituteIds(date: Date): Promise<number[]> {
    const results = await Database.execute(
      `
        SELECT teamMemberId
        FROM Substitutes
        WHERE date = ?
      `,
      [date.toISOString().substring(0, 10)],
    );

    if (!results.rows) return [];

    return (results.rows as unknown as { teamMemberId: number }[]).map((row) =>
      row.teamMemberId
    );
  }
}
