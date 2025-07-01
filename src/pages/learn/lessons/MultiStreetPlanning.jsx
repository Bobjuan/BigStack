import React from 'react';
import { Typography, Box, List, ListItem } from '@mui/material';

const MultiStreetPlanning = () => {
  return (
    <Box sx={{ color: 'white' }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'white' }}>
        Multi-Street Planning
      </Typography>

      <Typography paragraph sx={{ color: 'white' }}>
        Multi-street planning is essential for maximizing value and minimizing losses in poker. It involves thinking ahead about future streets and how different board runouts will affect your strategy.
      </Typography>

      <Typography variant="h5" gutterBottom sx={{ mt: 3, color: 'white' }}>
        Preflop Considerations
      </Typography>
      
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Hand Selection:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Consider post-flop playability</ListItem>
        <ListItem>Account for position</ListItem>
        <ListItem>Think about stack depths</ListItem>
        <ListItem>Factor in opponent types</ListItem>
        <ListItem>Plan for common scenarios</ListItem>
      </List>

      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Stack Size Impact:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Deep stack implications</ListItem>
        <ListItem>Short stack adjustments</ListItem>
        <ListItem>SPR considerations</ListItem>
        <ListItem>Commitment thresholds</ListItem>
        <ListItem>Implied odds impact</ListItem>
      </List>

      <Typography variant="h5" gutterBottom sx={{ mt: 3, color: 'white' }}>
        Flop Strategy
      </Typography>
      
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Betting Decisions:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Consider turn cards</ListItem>
        <ListItem>Plan for draws</ListItem>
        <ListItem>Think about pot size</ListItem>
        <ListItem>Account for ranges</ListItem>
        <ListItem>Factor in position</ListItem>
      </List>

      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Board Texture Analysis:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Evaluate draw potential</ListItem>
        <ListItem>Consider range advantage</ListItem>
        <ListItem>Think about equity distribution</ListItem>
        <ListItem>Plan for scary cards</ListItem>
        <ListItem>Account for stack depths</ListItem>
      </List>

      <Typography variant="h5" gutterBottom sx={{ mt: 3, color: 'white' }}>
        Turn Strategy
      </Typography>
      
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Barrel Decisions:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Consider previous action</ListItem>
        <ListItem>Evaluate board changes</ListItem>
        <ListItem>Think about river cards</ListItem>
        <ListItem>Plan sizing strategy</ListItem>
        <ListItem>Account for fold equity</ListItem>
      </List>

      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Draw Completion:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Adjust to completed draws</ListItem>
        <ListItem>Consider new draws</ListItem>
        <ListItem>Think about pot odds</ListItem>
        <ListItem>Plan river strategy</ListItem>
        <ListItem>Factor in implied odds</ListItem>
      </List>

      <Typography variant="h5" gutterBottom sx={{ mt: 3, color: 'white' }}>
        River Strategy
      </Typography>
      
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Value Betting:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Consider previous streets</ListItem>
        <ListItem>Evaluate opponent's range</ListItem>
        <ListItem>Think about sizing</ListItem>
        <ListItem>Plan for responses</ListItem>
        <ListItem>Account for history</ListItem>
      </List>

      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Bluffing Decisions:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Review hand history</ListItem>
        <ListItem>Consider story credibility</ListItem>
        <ListItem>Think about blockers</ListItem>
        <ListItem>Evaluate fold equity</ListItem>
        <ListItem>Plan sizing carefully</ListItem>
      </List>
    </Box>
  );
};

export default MultiStreetPlanning; 