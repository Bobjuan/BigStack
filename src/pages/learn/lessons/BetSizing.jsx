import React from 'react';
import { Typography, Box, List, ListItem } from '@mui/material';

const BetSizing = () => {
  return (
    <Box sx={{ color: 'white' }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'white' }}>
        Bet Sizing
      </Typography>

      <Typography paragraph sx={{ color: 'white' }}>
        Proper bet sizing is crucial for maximizing value and minimizing losses. Your bet sizes should be based on board texture, stack depths, opponent tendencies, and your overall strategy.
      </Typography>

      <Typography variant="h5" gutterBottom sx={{ mt: 3, color: 'white' }}>
        Preflop Sizing
      </Typography>
      
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Opening Raises:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>2.5-3x in late position</ListItem>
        <ListItem>3-4x in middle position</ListItem>
        <ListItem>4-5x in early position</ListItem>
        <ListItem>Larger with antes</ListItem>
        <ListItem>Adjust for table dynamics</ListItem>
      </List>

      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        3-Betting:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>3x the open in position</ListItem>
        <ListItem>3.5-4x out of position</ListItem>
        <ListItem>Larger vs loose players</ListItem>
        <ListItem>Consider stack depths</ListItem>
        <ListItem>Account for player tendencies</ListItem>
      </List>

      <Typography variant="h5" gutterBottom sx={{ mt: 3, color: 'white' }}>
        Flop Betting
      </Typography>
      
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        C-Bet Sizing:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>33% on dry boards</ListItem>
        <ListItem>50-66% on wet boards</ListItem>
        <ListItem>75%+ on polarized ranges</ListItem>
        <ListItem>Consider stack-to-pot ratio</ListItem>
        <ListItem>Adjust for opponent types</ListItem>
      </List>

      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Check-Raise Sizing:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>2.5-3x on dry boards</ListItem>
        <ListItem>3-4x on wet boards</ListItem>
        <ListItem>Consider pot geometry</ListItem>
        <ListItem>Factor in stack depths</ListItem>
        <ListItem>Adjust for opponent tendencies</ListItem>
      </List>

      <Typography variant="h5" gutterBottom sx={{ mt: 3, color: 'white' }}>
        Turn Play
      </Typography>
      
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Double Barreling:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>66-75% on favorable cards</ListItem>
        <ListItem>50% for pot control</ListItem>
        <ListItem>Consider previous action</ListItem>
        <ListItem>Account for board texture</ListItem>
        <ListItem>Think about opponent range</ListItem>
      </List>

      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Delayed Aggression:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Size based on flop action</ListItem>
        <ListItem>Consider pot size</ListItem>
        <ListItem>Factor in stack depths</ListItem>
        <ListItem>Think about opponent range</ListItem>
        <ListItem>Adjust for player type</ListItem>
      </List>

      <Typography variant="h5" gutterBottom sx={{ mt: 3, color: 'white' }}>
        River Strategy
      </Typography>
      
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Value Betting:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>75-100% pot for strong hands</ListItem>
        <ListItem>50-66% for thin value</ListItem>
        <ListItem>Consider opponent's range</ListItem>
        <ListItem>Think about calling frequency</ListItem>
        <ListItem>Account for player type</ListItem>
      </List>

      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Bluffing:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Match value bet sizing</ListItem>
        <ListItem>Consider fold equity</ListItem>
        <ListItem>Think about blockers</ListItem>
        <ListItem>Account for player tendencies</ListItem>
        <ListItem>Factor in previous action</ListItem>
      </List>
    </Box>
  );
};

export default BetSizing; 