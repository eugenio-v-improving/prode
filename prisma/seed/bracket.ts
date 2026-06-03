import { PrismaClient, Stage } from "@/generated/prisma";

type BracketMatch = { stage: Stage; date: string };

// All times are UTC, converted from openfootball/worldcup.json local times + UTC offsets.
// R32 = matches 73-88, R16 = 89-96, QF = 97-100, SF = 101-102.

const R32_MATCHES: BracketMatch[] = [
  { stage: "FINALS_16_1",  date: "2026-06-28T19:00:00.000Z" }, // #73  12:00 UTC-7
  { stage: "FINALS_16_2",  date: "2026-06-29T20:30:00.000Z" }, // #74  16:30 UTC-4
  { stage: "FINALS_16_3",  date: "2026-06-30T01:00:00.000Z" }, // #75  19:00 UTC-6
  { stage: "FINALS_16_4",  date: "2026-06-29T17:00:00.000Z" }, // #76  12:00 UTC-5
  { stage: "FINALS_16_5",  date: "2026-06-30T21:00:00.000Z" }, // #77  17:00 UTC-4
  { stage: "FINALS_16_6",  date: "2026-06-30T17:00:00.000Z" }, // #78  12:00 UTC-5
  { stage: "FINALS_16_7",  date: "2026-07-01T01:00:00.000Z" }, // #79  19:00 UTC-6
  { stage: "FINALS_16_8",  date: "2026-07-01T16:00:00.000Z" }, // #80  12:00 UTC-4
  { stage: "FINALS_16_9",  date: "2026-07-02T00:00:00.000Z" }, // #81  17:00 UTC-7
  { stage: "FINALS_16_10", date: "2026-07-01T20:00:00.000Z" }, // #82  13:00 UTC-7
  { stage: "FINALS_16_11", date: "2026-07-02T23:00:00.000Z" }, // #83  19:00 UTC-4
  { stage: "FINALS_16_12", date: "2026-07-02T19:00:00.000Z" }, // #84  12:00 UTC-7
  { stage: "FINALS_16_13", date: "2026-07-03T03:00:00.000Z" }, // #85  20:00 UTC-7
  { stage: "FINALS_16_14", date: "2026-07-03T22:00:00.000Z" }, // #86  18:00 UTC-4
  { stage: "FINALS_16_15", date: "2026-07-04T01:30:00.000Z" }, // #87  20:30 UTC-5
  { stage: "FINALS_16_16", date: "2026-07-03T18:00:00.000Z" }, // #88  13:00 UTC-5
];

const R16_MATCHES: BracketMatch[] = [
  { stage: "FINALS_8_1", date: "2026-07-04T21:00:00.000Z" }, // #89  17:00 UTC-4
  { stage: "FINALS_8_2", date: "2026-07-04T17:00:00.000Z" }, // #90  12:00 UTC-5
  { stage: "FINALS_8_3", date: "2026-07-05T20:00:00.000Z" }, // #91  16:00 UTC-4
  { stage: "FINALS_8_4", date: "2026-07-06T00:00:00.000Z" }, // #92  18:00 UTC-6
  { stage: "FINALS_8_5", date: "2026-07-06T19:00:00.000Z" }, // #93  14:00 UTC-5
  { stage: "FINALS_8_6", date: "2026-07-07T00:00:00.000Z" }, // #94  17:00 UTC-7
  { stage: "FINALS_8_7", date: "2026-07-07T16:00:00.000Z" }, // #95  12:00 UTC-4
  { stage: "FINALS_8_8", date: "2026-07-07T20:00:00.000Z" }, // #96  13:00 UTC-7
];

const QF_MATCHES: BracketMatch[] = [
  { stage: "FINALS_4_1", date: "2026-07-09T20:00:00.000Z" }, // #97  16:00 UTC-4
  { stage: "FINALS_4_2", date: "2026-07-10T19:00:00.000Z" }, // #98  12:00 UTC-7
  { stage: "FINALS_4_3", date: "2026-07-11T21:00:00.000Z" }, // #99  17:00 UTC-4
  { stage: "FINALS_4_4", date: "2026-07-12T01:00:00.000Z" }, // #100 20:00 UTC-5
];

const SF_MATCHES: BracketMatch[] = [
  { stage: "FINALS_2_1", date: "2026-07-14T19:00:00.000Z" }, // #101 14:00 UTC-5
  { stage: "FINALS_2_2", date: "2026-07-15T19:00:00.000Z" }, // #102 15:00 UTC-4
];

const FINAL_MATCHES: BracketMatch[] = [
  { stage: "THIRD_PLACE", date: "2026-07-18T21:00:00.000Z" }, // 17:00 UTC-4
  { stage: "FINALS",      date: "2026-07-19T19:00:00.000Z" }, // 15:00 UTC-4
];

const ALL_BRACKET_STAGES = [
  ...R32_MATCHES,
  ...R16_MATCHES,
  ...QF_MATCHES,
  ...SF_MATCHES,
  ...FINAL_MATCHES,
];

export async function seedBracket(prisma: PrismaClient, prodeId: string) {
  // Remove existing knockout matches for this prode
  await prisma.match.deleteMany({
    where: {
      prodeId,
      stage: {
        in: ALL_BRACKET_STAGES.map((m) => m.stage),
      },
    },
  });

  const matchData = ALL_BRACKET_STAGES.map(({ stage, date }) => ({
    prodeId,
    stage,
    countryLeftId: null as string | null,
    countryRightId: null as string | null,
    goalsLeft: null as number | null,
    goalsRight: null as number | null,
    penaltisLeft: null as number | null,
    penaltisRight: null as number | null,
    filled: false,
    date: new Date(date),
  }));

  await prisma.match.createMany({ data: matchData });
  console.log(`Seeded ${matchData.length} knockout-bracket matches.`);
}
