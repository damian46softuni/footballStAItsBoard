import { config } from '../config';
import { Match, MatchesResponse, MatchDetail, MatchDetailResponse, SquadMember, Prediction } from '../types/matches';
import { getCached, setCached } from './cacheService';

const EXTERNAL_API_URL = 'https://api.football-data.org/v4/matches';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapMatch(raw: any): Match {
  return {
    id: raw.id,
    utcDate: raw.utcDate,
    homeTeam: {
      id: raw.homeTeam.id,
      name: raw.homeTeam.name,
      shortName: raw.homeTeam.shortName,
      crest: raw.homeTeam.crest,
    },
    awayTeam: {
      id: raw.awayTeam.id,
      name: raw.awayTeam.name,
      shortName: raw.awayTeam.shortName,
      crest: raw.awayTeam.crest,
    },
    area: {
      id: raw.area.id,
      name: raw.area.name,
      code: raw.area.code,
      flag: raw.area.flag,
    },
    competition: {
      id: raw.competition.id,
      name: raw.competition.name,
      code: raw.competition.code,
      emblem: raw.competition.emblem,
    },
  };
}

const MATCHES_CACHE_KEY = 'matches';

export async function fetchMatches(): Promise<MatchesResponse> {
  const cached = await getCached(MATCHES_CACHE_KEY);
  if (cached) {
    return cached as MatchesResponse;
  }

  const response = await fetch(EXTERNAL_API_URL, {
    headers: {
      'X-Auth-Token': config.externalApiToken,
    },
  });

  if (!response.ok) {
    const text = await response.text().catch(() => response.statusText);
    throw new Error(`External API responded with ${response.status}: ${text}`);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = await response.json();

  const result: MatchesResponse = {
    filters: data.filters ?? {},
    resultSet: data.resultSet ?? {},
    matches: (data.matches ?? []).map(mapMatch),
  };

  await setCached(MATCHES_CACHE_KEY, result);
  return result;
}

// --- Match Detail ---

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function externalApiFetch(url: string): Promise<any> {
  const response = await fetch(url, {
    headers: { 'X-Auth-Token': config.externalApiToken },
  });
  if (!response.ok) {
    const text = await response.text().catch(() => response.statusText);
    throw new Error(`External API responded with ${response.status}: ${text}`);
  }
  return response.json();
}

function computeMedian(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  const median =
    sorted.length % 2 !== 0
      ? sorted[mid]
      : (sorted[mid - 1] + sorted[mid]) / 2;
  return Math.round(median);
}

export async function fetchMatchDetail(matchId: string): Promise<MatchDetailResponse> {
  const cacheKey = `match_detail_${matchId}`;
  const cached = await getCached(cacheKey);
  if (cached) {
    return cached as MatchDetailResponse;
  }

  const EXTERNAL_BASE = 'https://api.football-data.org/v4';

  // Step 1 & 2: head2head + match details (parallel)
  const [head2headData, matchData] = await Promise.all([
    externalApiFetch(`${EXTERNAL_BASE}/matches/${matchId}/head2head`),
    externalApiFetch(`${EXTERNAL_BASE}/matches/${matchId}`),
  ]);

  const competitionCode = matchData.competition.code;
  const homeTeamId = matchData.homeTeam.id;
  const awayTeamId = matchData.awayTeam.id;

  // Step 3, 4, 5: standings + both team squads (parallel)
  const [_standingsData, homeTeamData, awayTeamData] = await Promise.all([
    externalApiFetch(`${EXTERNAL_BASE}/competitions/${competitionCode}/standings`),
    externalApiFetch(`${EXTERNAL_BASE}/teams/${homeTeamId}`),
    externalApiFetch(`${EXTERNAL_BASE}/teams/${awayTeamId}`),
  ]);

  // Map squad arrays
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapSquad = (raw: any[]): SquadMember[] =>
    (raw ?? []).map((p: any) => ({
      id: p.id,
      name: p.name,
      position: p.position ?? 'Unknown',
      dateOfBirth: p.dateOfBirth ?? '',
      nationality: p.nationality ?? '',
    }));

  // Compute prediction from head-to-head match scores (integer median)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const h2hMatches: any[] = head2headData.matches ?? [];
  const homeScores: number[] = [];
  const awayScores: number[] = [];

  for (const m of h2hMatches) {
    const ft = m.score?.fullTime;
    if (ft && ft.home != null && ft.away != null) {
      homeScores.push(ft.home);
      awayScores.push(ft.away);
    }
  }

  const prediction: Prediction = {
    score: {
      fullTime: {
        home: computeMedian(homeScores),
        away: computeMedian(awayScores),
      },
    },
  };

  const matchDetail: MatchDetail = {
    id: matchData.id,
    utcDate: matchData.utcDate,
    homeTeam: {
      id: matchData.homeTeam.id,
      name: matchData.homeTeam.name,
      shortName: matchData.homeTeam.shortName,
      crest: matchData.homeTeam.crest,
      squad: mapSquad(homeTeamData.squad),
    },
    awayTeam: {
      id: matchData.awayTeam.id,
      name: matchData.awayTeam.name,
      shortName: matchData.awayTeam.shortName,
      crest: matchData.awayTeam.crest,
      squad: mapSquad(awayTeamData.squad),
    },
    area: {
      id: matchData.area.id,
      name: matchData.area.name,
      code: matchData.area.code,
      flag: matchData.area.flag,
    },
    competition: {
      id: matchData.competition.id,
      name: matchData.competition.name,
      code: matchData.competition.code,
      emblem: matchData.competition.emblem,
    },
    prediction,
  };

  const result: MatchDetailResponse = { match: matchDetail };
  await setCached(cacheKey, result);
  return result;
}
