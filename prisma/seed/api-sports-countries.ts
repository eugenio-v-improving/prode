/**
 * One-time script: populates Country.externalId from the API-Sports team catalog.
 *
 * Run once before the first sync:
 *   API_SPORTS_KEY=<key> DATABASE_URL=<url> tsx prisma/seed/api-sports-countries.ts
 *
 * Safe to re-run — skips countries that already have an externalId.
 */

import { PrismaClient } from "../../src/generated/prisma";
import { fetchTeams } from "../../src/lib/api-sports/client";

const WC_LEAGUE_ID = 1;
const WC_SEASON = 2026;

// Manual overrides for known name mismatches between API-Sports and our DB.
// Key = API-Sports team name, value = exact Country.name in our DB.
const NAME_OVERRIDES: Record<string, string> = {
  "Korea Republic": "South Korea",
  "IR Iran": "Iran",
  "USA": "United States",
  "Ivory Coast": "Côte d'Ivoire",
};

async function main() {
  const prisma = new PrismaClient();

  try {
    const teams = await fetchTeams(WC_LEAGUE_ID, WC_SEASON);
    console.log(`Fetched ${teams.length} teams from API-Sports`);

    const countries = await prisma.country.findMany();
    const byName = new Map(countries.map((c) => [c.name.toLowerCase(), c]));

    let linked = 0;
    let notFound: string[] = [];

    for (const { team } of teams) {
      if (!team?.id || !team?.name) continue;

      const resolvedName = NAME_OVERRIDES[team.name] ?? team.name;
      const country = byName.get(resolvedName.toLowerCase());

      if (!country) {
        notFound.push(team.name);
        continue;
      }

      if (country.externalId !== null) {
        // Already linked — skip
        continue;
      }

      await prisma.country.update({
        where: { id: country.id },
        data: { externalId: team.id },
      });

      console.log(`  ✓ ${country.name} → externalId ${team.id}`);
      linked++;
    }

    console.log(`\nLinked: ${linked}`);
    if (notFound.length) {
      console.warn(`Not found in DB (add to NAME_OVERRIDES or check spelling):`);
      notFound.forEach((n) => console.warn(`  - ${n}`));
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
