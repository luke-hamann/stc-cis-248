import Repository from "./_Repository.ts";

export default class SubstituteRepository extends Repository {
  public async validate(substituteIds: number[]): Promise<string[]> {
    return await Promise.resolve([]);
  }

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
    const dateString = date.toISOString().substring(0, 10);

    await this.database.execute(
      `
        DELETE FROM Substitutes
        WHERE date = ?
      `,
      [dateString],
    );

    for (const teamMemberId of teamMemberIds) {
      await this.database.execute(
        `
          INSERT INTO Substitutes (teamMemberId, date)
          VALUES (?, ?)
        `,
        [teamMemberId, dateString],
      );
    }
  }
}
