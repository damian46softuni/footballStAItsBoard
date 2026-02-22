import React, { useEffect, useMemo } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { Link as RouterLink, useParams } from 'react-router';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { clearMatchDetail, fetchMatchDetail } from '../store/matchDetailSlice';
import { SquadMember } from '../types/matches';

function formatMatchDate(utcDate: string): { day: string; time: string } {
  const date = new Date(utcDate);
  const day = new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
  const time = `${new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
    hour12: false,
  }).format(date)} UTC`;

  return { day, time };
}

const positionOrder: Record<string, number> = {
  Goalkeeper: 0,
  Defender: 1,
  Midfielder: 2,
  Forward: 3,
};

function sortSquad(players: SquadMember[]): SquadMember[] {
  return [...players].sort((first, second) => {
    const firstOrder = positionOrder[first.position] ?? Number.MAX_SAFE_INTEGER;
    const secondOrder = positionOrder[second.position] ?? Number.MAX_SAFE_INTEGER;

    if (firstOrder !== secondOrder) {
      return firstOrder - secondOrder;
    }

    return first.name.localeCompare(second.name);
  });
}

function formatDateOfBirth(value: string): string {
  if (!value) {
    return '-';
  }

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}

const MatchDetail: React.FC = () => {
  const dispatch = useAppDispatch();
  const { matchId } = useParams<{ matchId: string }>();
  const { match, loading, error } = useAppSelector((state) => state.matchDetail);

  useEffect(() => {
    const parsedMatchId = Number(matchId);

    if (!Number.isFinite(parsedMatchId) || parsedMatchId <= 0) {
      return;
    }

    dispatch(fetchMatchDetail(parsedMatchId));

    return () => {
      dispatch(clearMatchDetail());
    };
  }, [dispatch, matchId]);

  const sortedHomeSquad = useMemo(() => sortSquad(match?.homeTeam.squad ?? []), [match?.homeTeam.squad]);
  const sortedAwaySquad = useMemo(() => sortSquad(match?.awayTeam.squad ?? []), [match?.awayTeam.squad]);

  if (!matchId || !Number.isFinite(Number(matchId)) || Number(matchId) <= 0) {
    return <Alert severity="error">Invalid match ID.</Alert>;
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!match) {
    return <Alert severity="info">Match details are not available.</Alert>;
  }

  const { day, time } = formatMatchDate(match.utcDate);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Breadcrumbs aria-label="breadcrumb">
        <Link component={RouterLink} underline="hover" color="inherit" to="/">
          Home
        </Link>
        <Typography color="text.secondary">{match.competition.name}</Typography>
        <Typography color="text.primary">Match</Typography>
      </Breadcrumbs>

      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          px: 2,
          py: 1.5,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        {match.competition.emblem ? (
          <Box
            component="img"
            src={match.competition.emblem}
            alt={match.competition.name}
            sx={{ width: 28, height: 28, objectFit: 'contain' }}
            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : null}

        <Typography variant="h6" sx={{ fontWeight: 800 }}>
          {match.competition.name}
        </Typography>

        <Box sx={{ ml: 1, display: 'flex', alignItems: 'center', gap: 0.75 }}>
          {match.area.flag ? (
            <Box
              component="img"
              src={match.area.flag}
              alt={match.area.name}
              sx={{ width: 22, height: 22, objectFit: 'contain' }}
              onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : null}
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
            {match.area.name}
          </Typography>
        </Box>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          p: 3,
          backgroundColor: 'background.paper',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
            {day}
          </Typography>
          <Typography variant="body2" color="secondary.main" sx={{ fontWeight: 700 }}>
            {time}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr auto 1fr' },
            gap: 2,
            alignItems: 'center',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', sm: 'flex-end' }, gap: 1.5 }}>
            <Box
              component="img"
              src={match.homeTeam.crest}
              alt={match.homeTeam.name}
              sx={{ width: 56, height: 56, objectFit: 'contain' }}
              onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              {match.homeTeam.shortName || match.homeTeam.name}
            </Typography>
          </Box>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontWeight: 700, textTransform: 'uppercase', justifySelf: 'center' }}
          >
            vs
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', sm: 'flex-start' }, gap: 1.5 }}>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              {match.awayTeam.shortName || match.awayTeam.name}
            </Typography>
            <Box
              component="img"
              src={match.awayTeam.crest}
              alt={match.awayTeam.name}
              sx={{ width: 56, height: 56, objectFit: 'contain' }}
              onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </Box>
        </Box>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'primary.dark',
          p: 3,
          backgroundColor: 'primary.main',
          color: 'primary.contrastText',
        }}
      >
        <Typography variant="overline" sx={{ letterSpacing: 1.2, opacity: 0.9 }}>
          Predicted Score
        </Typography>

        <Box
          sx={{
            mt: 1,
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, textAlign: 'right' }}>
            {match.homeTeam.shortName || match.homeTeam.name}
          </Typography>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 900,
              color: 'secondary.main',
              lineHeight: 1,
              px: 1,
            }}
          >
            {match.prediction.score.fullTime.home} - {match.prediction.score.fullTime.away}
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 700, textAlign: 'left' }}>
            {match.awayTeam.shortName || match.awayTeam.name}
          </Typography>
        </Box>
      </Paper>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider', height: '100%' }}
          >
            <Box
              sx={{
                px: 2,
                py: 1.5,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                borderBottom: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Box
                component="img"
                src={match.homeTeam.crest}
                alt={match.homeTeam.name}
                sx={{ width: 24, height: 24, objectFit: 'contain' }}
                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {match.homeTeam.name} Squad
              </Typography>
            </Box>

            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Position</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Nationality</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Date of Birth</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedHomeSquad.map((player) => (
                  <TableRow key={player.id} hover>
                    <TableCell>{player.name}</TableCell>
                    <TableCell>{player.position || '-'}</TableCell>
                    <TableCell>{player.nationality || '-'}</TableCell>
                    <TableCell>{formatDateOfBirth(player.dateOfBirth)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider', height: '100%' }}
          >
            <Box
              sx={{
                px: 2,
                py: 1.5,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                borderBottom: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Box
                component="img"
                src={match.awayTeam.crest}
                alt={match.awayTeam.name}
                sx={{ width: 24, height: 24, objectFit: 'contain' }}
                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {match.awayTeam.name} Squad
              </Typography>
            </Box>

            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Position</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Nationality</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Date of Birth</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedAwaySquad.map((player) => (
                  <TableRow key={player.id} hover>
                    <TableCell>{player.name}</TableCell>
                    <TableCell>{player.position || '-'}</TableCell>
                    <TableCell>{player.nationality || '-'}</TableCell>
                    <TableCell>{formatDateOfBirth(player.dateOfBirth)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MatchDetail;
