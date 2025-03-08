import Repository from "./_Repository.ts";

export default class SubstituteRepository extends Repository {
  public async getSubstituteIds(date: Date): Promise<number[]> {
    const results = await this.database.execute(
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

  public async updateSubstitutesIds(
    date: Date,
    teamMemberIds: number[],
  ): Promise<void> {
  }
}
