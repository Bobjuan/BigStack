import React from 'react';
import { Typography, Box, List, ListItem } from '@mui/material';

const BoardTextureAnalysis = () => {
  return (
    <Box sx={{ color: 'white' }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'white' }}>
        Board Texture Analysis
      </Typography>

      <Typography paragraph sx={{ color: 'white' }}>
        Understanding board texture is crucial for developing a winning poker strategy. Different board textures favor different ranges and require specific strategic adjustments in terms of bet sizing and frequency.
      </Typography>

      <Typography variant="h5" gutterBottom sx={{ mt: 3, color: 'white' }}>
        High Card Boards
      </Typography>
      
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Ace-High Boards:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Less need for protection</ListItem>
        <ListItem>Check more frequently</ListItem>
        <ListItem>Favor smaller bet sizes on dry boards</ListItem>
        <ListItem>Larger sizes on draw-heavy boards</ListItem>
        <ListItem>Consider range advantage</ListItem>
      </List>

      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        King/Queen-High Boards:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>More protection needed than ace-high</ListItem>
        <ListItem>Higher betting frequency</ListItem>
        <ListItem>Consider opponent's range composition</ListItem>
        <ListItem>Adjust for position and ranges</ListItem>
        <ListItem>Balance value and bluffs</ListItem>
      </List>

      <Typography variant="h5" gutterBottom sx={{ mt: 3, color: 'white' }}>
        Connected Boards
      </Typography>
      
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Low Connected:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Higher checking frequency</ListItem>
        <ListItem>More straight possibilities</ListItem>
        <ListItem>Consider equity distribution</ListItem>
        <ListItem>Important for range construction</ListItem>
        <ListItem>Careful with continuation betting</ListItem>
      </List>

      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        High Connected:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>More polarized betting ranges</ListItem>
        <ListItem>Consider straight draws</ListItem>
        <ListItem>Important for range advantage</ListItem>
        <ListItem>Adjust sizing based on wetness</ListItem>
        <ListItem>Balance protection and value</ListItem>
      </List>

      <Typography variant="h5" gutterBottom sx={{ mt: 3, color: 'white' }}>
        Monotone Boards
      </Typography>
      
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Strategic Considerations:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Higher checking frequency overall</ListItem>
        <ListItem>Smaller bet sizes preferred</ListItem>
        <ListItem>Consider range composition</ListItem>
        <ListItem>Important for nut advantage</ListItem>
        <ListItem>Careful with bluff selection</ListItem>
      </List>

      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Position Impact:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>More important on monotone boards</ListItem>
        <ListItem>Affects continuation betting</ListItem>
        <ListItem>Influences bluffing frequency</ListItem>
        <ListItem>Consider range advantages</ListItem>
        <ListItem>Adjust based on stack depths</ListItem>
      </List>

      <Typography variant="h5" gutterBottom sx={{ mt: 3, color: 'white' }}>
        Turn Card Analysis
      </Typography>
      
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Overcard Turns:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Consider previous street action</ListItem>
        <ListItem>Adjust sizing appropriately</ListItem>
        <ListItem>Think about range advantages</ListItem>
        <ListItem>Important for protection</ListItem>
        <ListItem>Balance value and bluffs</ListItem>
      </List>

      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Board Pairing Turns:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Often warrants larger sizing</ListItem>
        <ListItem>Consider range shifts</ListItem>
        <ListItem>Important for value betting</ListItem>
        <ListItem>Affects bluffing frequency</ListItem>
        <ListItem>Think about opponent's range</ListItem>
      </List>

      <Typography variant="h5" gutterBottom sx={{ mt: 3, color: 'white' }}>
        Betting Strategy Adjustments
      </Typography>
      
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Sizing Principles:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Smaller sizes on dry boards</ListItem>
        <ListItem>Larger sizes on wet boards</ListItem>
        <ListItem>Consider stack-to-pot ratio</ListItem>
        <ListItem>Adjust for board texture</ListItem>
        <ListItem>Think about opponent tendencies</ListItem>
      </List>

      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Frequency Adjustments:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Higher frequency on favorable boards</ListItem>
        <ListItem>Lower frequency on dangerous boards</ListItem>
        <ListItem>Consider position and ranges</ListItem>
        <ListItem>Adjust for opponent types</ListItem>
        <ListItem>Balance range construction</ListItem>
      </List>
    </Box>
  );
};

export default BoardTextureAnalysis; 