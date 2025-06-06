import React from 'react';
import { Typography, Box, List, ListItem } from '@mui/material';

const StartingHandSelection = () => {
  return (
    <Box sx={{ color: 'white' }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'white' }}>
        Starting Hand Selection
      </Typography>

      <Typography paragraph sx={{ color: 'white' }}>
        Starting hand selection is one of the most fundamental aspects of poker strategy. Your preflop decisions set the foundation for the rest of the hand and greatly impact your overall profitability.
      </Typography>

      <Typography variant="h5" gutterBottom sx={{ mt: 3, color: 'white' }}>
        Position-Based Selection
      </Typography>
      
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Early Position:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Play tighter ranges</ListItem>
        <ListItem>Focus on strong hands that play well postflop</ListItem>
        <ListItem>Premium pairs (TT+) and strong broadways</ListItem>
        <ListItem>Suited connectors need to be more selective</ListItem>
      </List>

      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Late Position:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Can play wider ranges</ListItem>
        <ListItem>More suited connectors and one-gappers</ListItem>
        <ListItem>More offsuit broadways</ListItem>
        <ListItem>Can play more speculative hands</ListItem>
      </List>

      <Typography variant="h5" gutterBottom sx={{ mt: 3, color: 'white' }}>
        Stack Depth Considerations
      </Typography>
      
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Deep Stack Play (100BB+):
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Increase value of suited connectors</ListItem>
        <ListItem>Play more hands that can make the nuts</ListItem>
        <ListItem>Reduce frequency of offsuit broadways</ListItem>
        <ListItem>Consider implied odds more heavily</ListItem>
      </List>

      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Short Stack Play:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Focus on high card strength</ListItem>
        <ListItem>Reduce suited connector frequency</ListItem>
        <ListItem>Increase broadway hands</ListItem>
        <ListItem>Value immediate equity more</ListItem>
      </List>

      <Typography variant="h5" gutterBottom sx={{ mt: 3, color: 'white' }}>
        Hand Categories
      </Typography>
      
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Premium Pairs:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>TT+ are always playable</ListItem>
        <ListItem>Consider 3-betting for value</ListItem>
        <ListItem>Strong enough to play from any position</ListItem>
        <ListItem>Can play aggressively postflop</ListItem>
      </List>

      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Medium Pairs:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>77-99 are position dependent</ListItem>
        <ListItem>Better as calls than 3-bets</ListItem>
        <ListItem>Need careful postflop play</ListItem>
        <ListItem>Value decreases multiway</ListItem>
      </List>

      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Suited Connectors:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Great in position</ListItem>
        <ListItem>Strong implied odds</ListItem>
        <ListItem>Good for board coverage</ListItem>
        <ListItem>Excellent in deep stack play</ListItem>
      </List>

      <Typography variant="h5" gutterBottom sx={{ mt: 3, color: 'white' }}>
        Game Type Adjustments
      </Typography>
      
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Cash Games:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Can play more speculative hands</ListItem>
        <ListItem>Focus on implied odds</ListItem>
        <ListItem>Position is extremely important</ListItem>
        <ListItem>Can adjust based on table dynamics</ListItem>
      </List>

      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Tournaments:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Tighter early game selection</ListItem>
        <ListItem>Stack size heavily impacts selection</ListItem>
        <ListItem>Need to consider ICM implications</ListItem>
        <ListItem>More emphasis on playability</ListItem>
      </List>

      <Typography variant="h5" gutterBottom sx={{ mt: 3, color: 'white' }}>
        Common Mistakes
      </Typography>
      
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Position Mistakes:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Playing too loose from early position</ListItem>
        <ListItem>Not widening range enough in late position</ListItem>
        <ListItem>Overvaluing suited hands from early position</ListItem>
        <ListItem>Not considering table dynamics</ListItem>
      </List>

      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Hand Selection Errors:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Playing too many weak suited hands</ListItem>
        <ListItem>Overvaluing small pairs</ListItem>
        <ListItem>Not adjusting to table conditions</ListItem>
        <ListItem>Ignoring stack depth considerations</ListItem>
      </List>
    </Box>
  );
};

export default StartingHandSelection; 