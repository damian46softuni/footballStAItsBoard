import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import MatchesList from './components/MatchesList';

function App() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="sticky" sx={{ top: 0, zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <SportsSoccerIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            footballStAItsBoard
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4, flex: 1 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 800 }}>
          Today's Matches
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          All available matches grouped by competition.
        </Typography>

        <MatchesList />
      </Container>
    </Box>
  );
}

export default App;
