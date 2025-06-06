import React from 'react';
import { Typography, Box, List, ListItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ThreeBettingStrategy = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ color: 'white' }}>
      

      <Typography variant="h4" gutterBottom sx={{ color: 'white' }}>
        3-Betting Strategy
      </Typography>

      <Typography paragraph sx={{ color: 'white' }}>
        3-betting is one of the most powerful weapons in poker. A well-constructed 3-betting strategy allows you to build bigger pots with your strong hands and put pressure on your opponents with well-chosen bluffs.
      </Typography>

      <Typography variant="h5" gutterBottom sx={{ mt: 3, color: 'white' }}>
        Position-Based 3-Betting
      </Typography>
      
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        In Position 3-Betting:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>More aggressive frequencies</ListItem>
        <ListItem>Wider value range</ListItem>
        <ListItem>More bluffing opportunities</ListItem>
        <ListItem>Can include more speculative hands</ListItem>
        <ListItem>Better post-flop playability</ListItem>
      </List>

      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Out of Position 3-Betting:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Tighter value range</ListItem>
        <ListItem>More polarized strategy</ListItem>
        <ListItem>Premium hands and strong bluffs</ListItem>
        <ListItem>Less speculative hands</ListItem>
        <ListItem>Focus on strong playability</ListItem>
      </List>

      <Typography variant="h5" gutterBottom sx={{ mt: 3, color: 'white' }}>
        Hand Selection
      </Typography>
      
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Value 3-Bets:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Premium pairs (QQ+)</ListItem>
        <ListItem>Strong broadway hands (AK, AQs)</ListItem>
        <ListItem>Position-dependent strength</ListItem>
        <ListItem>Hands that play well multiway</ListItem>
        <ListItem>Good post-flop playability</ListItem>
      </List>

      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Bluff 3-Bets:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Suited connectors in position</ListItem>
        <ListItem>Blocker effects (AXs, KXs)</ListItem>
        <ListItem>Good removal properties</ListItem>
        <ListItem>Playable post-flop</ListItem>
        <ListItem>Balance with value range</ListItem>
      </List>

      <Typography variant="h5" gutterBottom sx={{ mt: 3, color: 'white' }}>
        Sizing Considerations
      </Typography>
      
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Standard Sizing:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Usually 3x the original raise</ListItem>
        <ListItem>Adjust based on position</ListItem>
        <ListItem>Consider stack depths</ListItem>
        <ListItem>Account for antes if present</ListItem>
        <ListItem>Larger vs limpers</ListItem>
      </List>

      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Situational Adjustments:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Larger sizes out of position</ListItem>
        <ListItem>Smaller sizes in position</ListItem>
        <ListItem>Adjust for opponent tendencies</ListItem>
        <ListItem>Consider table dynamics</ListItem>
        <ListItem>Account for stack-to-pot ratio</ListItem>
      </List>

      <Typography variant="h5" gutterBottom sx={{ mt: 3, color: 'white' }}>
        Post-Flop Strategy
      </Typography>
      
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        C-Betting Strategy:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Higher frequency on favorable boards</ListItem>
        <ListItem>Smaller sizes on dry boards</ListItem>
        <ListItem>Larger sizes on wet boards</ListItem>
        <ListItem>Consider range advantage</ListItem>
        <ListItem>Adjust based on opponent's calling range</ListItem>
      </List>

      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        When Called:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Continue with strong value hands</ListItem>
        <ListItem>Have clear bluffing strategy</ListItem>
        <ListItem>Consider board texture</ListItem>
        <ListItem>Plan for multiple streets</ListItem>
        <ListItem>Maintain balanced ranges</ListItem>
      </List>

      <Typography variant="h5" gutterBottom sx={{ mt: 3, color: 'white' }}>
        Common Mistakes
      </Typography>
      
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Strategic Errors:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>3-betting too wide out of position</ListItem>
        <ListItem>Not having enough bluffs</ListItem>
        <ListItem>Poor hand selection for bluffs</ListItem>
        <ListItem>Incorrect sizing adjustments</ListItem>
        <ListItem>Not considering stack depths</ListItem>
      </List>

      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Post-Flop Mistakes:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>C-betting too frequently</ListItem>
        <ListItem>Wrong sizing choices</ListItem>
        <ListItem>Not planning for turns</ListItem>
        <ListItem>Poor bluff selection</ListItem>
        <ListItem>Giving up too easily</ListItem>
      </List>
    </Box>
  );
};

export default ThreeBettingStrategy; 