import { config } from '../config';
import { Match, MatchesResponse } from '../types/matches';

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

export async function fetchMatches(): Promise<MatchesResponse> {
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

  return {
    filters: data.filters ?? {},
    resultSet: data.resultSet ?? {},
    matches: (data.matches ?? []).map(mapMatch),
  };
}
