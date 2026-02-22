import React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Match } from '../types/matches';

interface Props {
  match: Match;
}

function formatMatchDate(utcDate: string): { day: string; time: string } {
  const date = new Date(utcDate);
  const day = new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  }).format(date);
  const time = `${new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
    hour12: false,
  }).format(date)} UTC`;

  return { day, time };
}

const MatchCard: React.FC<Props> = ({ match }) => {
  const { day, time } = formatMatchDate(match.utcDate);

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 2,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
      }}
    >
      <Box
        sx={{
          px: 2,
          py: 1,
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'action.hover',
        }}
      >
        <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
          {day}
        </Typography>
        <Typography variant="caption" color="secondary.main" sx={{ fontWeight: 700 }}>
          {time}
        </Typography>
      </Box>

      <Box
        sx={{
          px: 2,
          py: 2,
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          gap: 1,
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
          <Box
            component="img"
            src={match.homeTeam.crest}
            alt={match.homeTeam.name}
            sx={{ width: 48, height: 48, objectFit: 'contain' }}
            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <Typography variant="body1" sx={{ fontWeight: 700, textAlign: 'center' }}>
            {match.homeTeam.shortName || match.homeTeam.name}
          </Typography>
        </Box>

        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
          vs
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
          <Box
            component="img"
            src={match.awayTeam.crest}
            alt={match.awayTeam.name}
            sx={{ width: 48, height: 48, objectFit: 'contain' }}
            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <Typography variant="body1" sx={{ fontWeight: 700, textAlign: 'center' }}>
            {match.awayTeam.shortName || match.awayTeam.name}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default MatchCard;