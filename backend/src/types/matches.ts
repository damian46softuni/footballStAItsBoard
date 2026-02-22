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

export interface SquadMember {
  id: number;
  name: string;
  position: string;
  dateOfBirth: string;
  nationality: string;
}

export interface DetailTeam {
  id: number;
  name: string;
  shortName: string;
  crest: string;
  squad: SquadMember[];
}

export interface Prediction {
  score: {
    fullTime: {
      home: number;
      away: number;
    };
  };
}

export interface MatchDetail {
  id: number;
  utcDate: string;
  homeTeam: DetailTeam;
  awayTeam: DetailTeam;
  area: Area;
  competition: Competition;
  prediction: Prediction;
}

export interface MatchDetailResponse {
  match: MatchDetail;
}
