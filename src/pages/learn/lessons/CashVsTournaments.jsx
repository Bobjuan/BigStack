import React from 'react';
import { Typography, Box, List, ListItem } from '@mui/material';

const CashVsTournaments = () => {
  return (
    <Box sx={{ color: 'white' }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'white' }}>
        Understanding Cash Games vs Tournaments
      </Typography>

      <Typography paragraph sx={{ color: 'white' }}>
        Cash games and tournaments are two fundamentally different formats of poker, each requiring distinct strategies and approaches. Understanding these differences is crucial for success in either format.
      </Typography>

      <Typography variant="h5" gutterBottom sx={{ mt: 3, color: 'white' }}>
        Structural Differences
      </Typography>
      
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Cash Games:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Fixed blind levels</ListItem>
        <ListItem>Can buy in for any amount within table limits</ListItem>
        <ListItem>Can reload or leave at any time</ListItem>
        <ListItem>Consistent stack-to-blind ratios</ListItem>
        <ListItem>More emphasis on deep stack play</ListItem>
      </List>

      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Tournaments:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Increasing blind levels</ListItem>
        <ListItem>Fixed buy-in amount</ListItem>
        <ListItem>Must play until elimination</ListItem>
        <ListItem>Changing stack-to-blind ratios</ListItem>
        <ListItem>More emphasis on short stack play</ListItem>
      </List>

      <Typography variant="h5" gutterBottom sx={{ mt: 3, color: 'white' }}>
        Strategic Differences
      </Typography>
      
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Cash Game Strategy:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Value betting is more important</ListItem>
        <ListItem>Can play more straightforward</ListItem>
        <ListItem>Position is extremely valuable</ListItem>
        <ListItem>Can wait for premium hands</ListItem>
        <ListItem>More focus on maximizing each hand</ListItem>
      </List>

      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Tournament Strategy:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Survival and chip accumulation balance</ListItem>
        <ListItem>ICM considerations affect decisions</ListItem>
        <ListItem>Must adapt to changing stack depths</ListItem>
        <ListItem>Can't wait for only premium hands</ListItem>
        <ListItem>More emphasis on stealing blinds/antes</ListItem>
      </List>

      <Typography variant="h5" gutterBottom sx={{ mt: 3, color: 'white' }}>
        Bankroll Requirements
      </Typography>
      
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Cash Games:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Minimum 25 buy-ins recommended</ListItem>
        <ListItem>Optimal: 40+ buy-ins</ListItem>
        <ListItem>Can move up/down stakes freely</ListItem>
        <ListItem>Lower variance than tournaments</ListItem>
        <ListItem>Easier to maintain steady bankroll</ListItem>
      </List>

      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Tournaments:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Minimum 50 buy-ins recommended</ListItem>
        <ListItem>Optimal: 100+ buy-ins</ListItem>
        <ListItem>Higher variance than cash games</ListItem>
        <ListItem>Longer time to realize true win rate</ListItem>
        <ListItem>Need larger bankroll relative to buy-in</ListItem>
      </List>

      <Typography variant="h5" gutterBottom sx={{ mt: 3, color: 'white' }}>
        Skill Set Requirements
      </Typography>
      
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Cash Game Skills:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Deep stack post-flop play</ListItem>
        <ListItem>Hand reading in deep stacks</ListItem>
        <ListItem>Value betting thin</ListItem>
        <ListItem>Table selection crucial</ListItem>
        <ListItem>Emotional control for long sessions</ListItem>
      </List>

      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Tournament Skills:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Short stack play</ListItem>
        <ListItem>Push/fold strategy</ListItem>
        <ListItem>ICM understanding</ListItem>
        <ListItem>Adapting to changing dynamics</ListItem>
        <ListItem>Endurance for long events</ListItem>
      </List>

      <Typography variant="h5" gutterBottom sx={{ mt: 3, color: 'white' }}>
        Choosing Your Format
      </Typography>
      
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Consider Cash Games If:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>You prefer consistent action</ListItem>
        <ListItem>Want flexible playing schedules</ListItem>
        <ListItem>Like deep stack poker</ListItem>
        <ListItem>Prefer steady, predictable results</ListItem>
        <ListItem>Want to minimize variance</ListItem>
      </List>

      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Consider Tournaments If:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>You enjoy competition format</ListItem>
        <ListItem>Don't mind irregular schedules</ListItem>
        <ListItem>Like the possibility of big payouts</ListItem>
        <ListItem>Enjoy adapting to changing dynamics</ListItem>
        <ListItem>Can handle higher variance</ListItem>
      </List>
    </Box>
  );
};

export default CashVsTournaments; 