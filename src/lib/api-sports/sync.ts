import { prisma } from "@/lib/prisma";
import { fetchFixturesByDate, fetchFinishedFixtures, type ApiFixture } from "./client";

export const WC_LEAGUE_ID = 1;
export const WC_SEASON = 2026;

export type SyncResult = {
  checked: number;
  updated: number;
  skipped: number;
  errors: string[];
};

/**
 * Syncs finished match results from API-Sports into the DB.
 *
 * Strategy:
 *  1. If a date is given, fetch only that day's fixtures (1 API call).
 *  2. Otherwise fetch all FT fixtures for the season (1 API call, used as fallback).
 *  3. For each FT fixture, find the matching Match row by:
 *     a. apiFixtureId (fast path — already linked on a previous sync)
 *     b. date window (±12 h) + both team externalIds (first sync)
 *  4. Skip matches already filled with the same score (idempotent).
 *  5. Write goals + penalty scores and set filled=true in a single update.
 */
export async function syncMatchResults(date?: string): Promise<SyncResult> {
  const result: SyncResult = { checked: 0, updated: 0, skipped: 0, errors: [] };

  let fixtures: ApiFixture[];
  try {
    fixtures = date
      ? await fetchFixturesByDate(WC_LEAGUE_ID, WC_SEASON, date)
      : await fetchFinishedFixtures(WC_LEAGUE_ID, WC_SEASON);
  } catch (err) {
    result.errors.push(`API fetch failed: ${err instanceof Error ? err.message : String(err)}`);
    return result;
  }

  const finished = fixtures.filter((f) => f.fixture.status.short === "FT");
  result.checked = finished.length;

  for (const fixture of finished) {
    try {
      await processFixture(fixture, result);
    } catch (err) {
      result.errors.push(
        `fixture ${fixture.fixture.id}: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }

  return result;
}

async function processFixture(fixture: ApiFixture, result: SyncResult) {
  const { id: fixtureId, date } = fixture.fixture;
  const { home, away } = fixture.goals;
  const penHome = fixture.score.penalty.home;
  const penAway = fixture.score.penalty.away;

  if (home === null || away === null) {
    result.skipped++;
    return;
  }

  // Fast path: match already linked by fixture ID
  let match = await prisma.match.findUnique({ where: { apiFixtureId: fixtureId } });

  // Slow path: link by date window + team externalIds
  if (!match) {
    const homeTeamId = fixture.teams.home.id;
    const awayTeamId = fixture.teams.away.id;

    const [homeCountry, awayCountry] = await Promise.all([
      prisma.country.findUnique({ where: { externalId: homeTeamId } }),
      prisma.country.findUnique({ where: { externalId: awayTeamId } }),
    ]);

    if (!homeCountry || !awayCountry) {
      result.skipped++;
      return;
    }

    const matchDate = new Date(date);
    const windowStart = new Date(matchDate.getTime() - 12 * 3600 * 1000);
    const windowEnd = new Date(matchDate.getTime() + 12 * 3600 * 1000);

    match = await prisma.match.findFirst({
      where: {
        countryLeftId: homeCountry.id,
        countryRightId: awayCountry.id,
        date: { gte: windowStart, lte: windowEnd },
      },
    });

    // Try swapped order — our DB may have home/away reversed
    if (!match) {
      match = await prisma.match.findFirst({
        where: {
          countryLeftId: awayCountry.id,
          countryRightId: homeCountry.id,
          date: { gte: windowStart, lte: windowEnd },
        },
      });
    }
  }

  if (!match) {
    result.skipped++;
    return;
  }

  // Already has the same score — nothing to do
  if (
    match.filled &&
    match.goalsLeft === home &&
    match.goalsRight === away &&
    match.penaltisLeft === (penHome ?? null) &&
    match.penaltisRight === (penAway ?? null)
  ) {
    result.skipped++;
    return;
  }

  await prisma.match.update({
    where: { id: match.id },
    data: {
      goalsLeft: home,
      goalsRight: away,
      penaltisLeft: penHome ?? null,
      penaltisRight: penAway ?? null,
      filled: true,
      apiFixtureId: fixtureId,
    },
  });

  result.updated++;
}
