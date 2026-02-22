import React, { useEffect, useMemo } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import MatchCard from './MatchCard';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchMatches } from '../store/matchesSlice';
import { Match } from '../types/matches';

interface CompetitionGroup {
  competitionId: number;
  competitionName: string;
  competitionEmblem: string;
  areaName: string;
  areaFlag: string;
  matches: Match[];
}

const MatchesList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { matches, loading, error } = useAppSelector((state) => state.matches);

  useEffect(() => {
    dispatch(fetchMatches());
  }, [dispatch]);

  const groups = useMemo<CompetitionGroup[]>(() => {
    const map = new Map<number, CompetitionGroup>();

    for (const match of matches) {
      const competitionId = match.competition.id;
      if (!map.has(competitionId)) {
        map.set(competitionId, {
          competitionId,
          competitionName: match.competition.name,
          competitionEmblem: match.competition.emblem,
          areaName: match.area.name,
          areaFlag: match.area.flag,
          matches: [],
        });
      }
      map.get(competitionId)?.matches.push(match);
    }

    return Array.from(map.values());
  }, [matches]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (groups.length === 0) {
    return (
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <Typography color="text.secondary">No matches found.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {groups.map((group) => (
        <Box key={group.competitionId}>
          <Box
            sx={{
              mb: 2,
              pb: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              borderBottom: '1px solid',
              borderColor: 'divider',
            }}
          >
            {group.competitionEmblem ? (
              <Box
                component="img"
                src={group.competitionEmblem}
                alt={group.competitionName}
                sx={{ width: 28, height: 28, objectFit: 'contain' }}
                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : null}

            <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
              {group.competitionName}
            </Typography>

            <Box sx={{ ml: 1, display: 'flex', alignItems: 'center', gap: 0.75 }}>
              {group.areaFlag ? (
                <Box
                  component="img"
                  src={group.areaFlag}
                  alt={group.areaName}
                  sx={{ width: 22, height: 22, objectFit: 'contain' }}
                  onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : null}
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                {group.areaName}
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={2}>
            {group.matches.map((match) => (
              <Grid key={match.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <MatchCard match={match} />
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
    </Box>
  );
};

export default MatchesList;