export interface Team {
  id: number;
  name: string;
  shortName: string;
  crest: string;
}

export interface Area {
  id: number;
  name: string;
  code: string;
  flag: string;
}

export interface Competition {
  id: number;
  name: string;
  code: string;
  emblem: string;
}

export interface Match {
  id: number;
  utcDate: string;
  homeTeam: Team;
  awayTeam: Team;
  area: Area;
  competition: Competition;
}

export interface MatchesResponse {
  filters: Record<string, unknown>;
  resultSet: Record<string, unknown>;
  matches: Match[];
}