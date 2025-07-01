import React from 'react';
import { Typography, Box, List, ListItem } from '@mui/material';

const HandReading = () => {
  return (
    <Box sx={{ color: 'white' }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'white' }}>
        Hand Reading
      </Typography>

      <Typography paragraph sx={{ color: 'white' }}>
        Hand reading is a crucial skill in poker that allows you to make better decisions by narrowing down your opponent's possible holdings. This skill combines understanding of ranges, player tendencies, and betting patterns.
      </Typography>

      <Typography variant="h5" gutterBottom sx={{ mt: 3, color: 'white' }}>
        Preflop Range Construction
      </Typography>
      
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Opening Ranges:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Consider position and stack depth</ListItem>
        <ListItem>Account for player tendencies</ListItem>
        <ListItem>Adjust for table dynamics</ListItem>
        <ListItem>Factor in ante presence</ListItem>
        <ListItem>Note previous action patterns</ListItem>
      </List>

      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Defending Ranges:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Position relative to opener</ListItem>
        <ListItem>Stack-to-pot ratio considerations</ListItem>
        <ListItem>Player type adjustments</ListItem>
        <ListItem>Historical dynamics</ListItem>
        <ListItem>Tournament vs cash game context</ListItem>
      </List>

      <Typography variant="h5" gutterBottom sx={{ mt: 3, color: 'white' }}>
        Flop Analysis
      </Typography>
      
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Range vs Range:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Board texture interaction</ListItem>
        <ListItem>Range advantage assessment</ListItem>
        <ListItem>Nut advantage consideration</ListItem>
        <ListItem>Removal effects</ListItem>
        <ListItem>Equity distribution</ListItem>
      </List>

      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Betting Patterns:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Sizing tells</ListItem>
        <ListItem>Timing tells</ListItem>
        <ListItem>Frequency analysis</ListItem>
        <ListItem>Historical tendencies</ListItem>
        <ListItem>Situational context</ListItem>
      </List>

      <Typography variant="h5" gutterBottom sx={{ mt: 3, color: 'white' }}>
        Turn Considerations
      </Typography>
      
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Range Narrowing:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Previous street actions</ListItem>
        <ListItem>Board texture changes</ListItem>
        <ListItem>Pot size implications</ListItem>
        <ListItem>Stack depth impact</ListItem>
        <ListItem>Player tendencies</ListItem>
      </List>

      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Action Analysis:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Double barrel frequency</ListItem>
        <ListItem>Check-raise patterns</ListItem>
        <ListItem>Delayed aggression</ListItem>
        <ListItem>Pot control decisions</ListItem>
        <ListItem>Bluff catching spots</ListItem>
      </List>

      <Typography variant="h5" gutterBottom sx={{ mt: 3, color: 'white' }}>
        River Decision Making
      </Typography>
      
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Value Betting:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Range advantage assessment</ListItem>
        <ListItem>Sizing optimization</ListItem>
        <ListItem>Calling range construction</ListItem>
        <ListItem>Blocker effects</ListItem>
        <ListItem>Exploitative adjustments</ListItem>
      </List>

      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Bluff Catching:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Betting pattern analysis</ListItem>
        <ListItem>Range construction review</ListItem>
        <ListItem>Blocker consideration</ListItem>
        <ListItem>Sizing interpretation</ListItem>
        <ListItem>Player tendency assessment</ListItem>
      </List>
    </Box>
  );
};

export default HandReading; 