const BASE_URL = "https://v3.football.api-sports.io";

export type ApiEnvelope<T> = {
  errors: string[] | Record<string, unknown>;
  results: number;
  paging: { current: number; total: number };
  response: T;
};

export type ApiFixture = {
  fixture: {
    id: number;
    date: string;
    status: { short: string };
  };
  league: {
    id: number;
    season: number;
    round: string;
  };
  teams: {
    home: { id: number; name: string };
    away: { id: number; name: string };
  };
  goals: {
    home: number | null;
    away: number | null;
  };
  score: {
    penalty: {
      home: number | null;
      away: number | null;
    };
  };
};

export type ApiTeam = {
  team: { id: number; name: string; code: string };
};

function apiKey(): string {
  const key = process.env.API_SPORTS_KEY;
  if (!key) throw new Error("API_SPORTS_KEY env var is not set");
  return key;
}

async function get<T>(
  path: string,
  params: Record<string, string | number>,
): Promise<ApiEnvelope<T>> {
  const url = new URL(path, BASE_URL);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, String(v));
  }

  const res = await fetch(url.toString(), {
    headers: { accept: "application/json", "x-apisports-key": apiKey() },
    // Next.js: do not cache — results change as matches finish
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`API-Sports ${path} → ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<ApiEnvelope<T>>;
}

export async function fetchFixturesByDate(
  league: number,
  season: number,
  date: string, // YYYY-MM-DD
): Promise<ApiFixture[]> {
  const data = await get<ApiFixture[]>("/fixtures", { league, season, date });
  return data.response ?? [];
}

export async function fetchFinishedFixtures(
  league: number,
  season: number,
): Promise<ApiFixture[]> {
  const data = await get<ApiFixture[]>("/fixtures", {
    league,
    season,
    status: "FT",
  });
  return data.response ?? [];
}

export async function fetchTeams(
  league: number,
  season: number,
): Promise<ApiTeam[]> {
  const data = await get<ApiTeam[]>("/teams", { league, season });
  return data.response ?? [];
}
