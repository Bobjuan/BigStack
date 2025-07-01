import React from 'react';
import { Typography, Box, List, ListItem } from '@mui/material';

const PositionAndHandRanges = () => {
  return (
    <Box sx={{ color: 'white' }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'white' }}>
        Position and Hand Ranges
      </Typography>

      <Typography paragraph sx={{ color: 'white' }}>
        Understanding position and hand ranges is crucial for success in poker. Position is one of your biggest advantages, and properly constructing ranges based on position will significantly improve your win rate.
      </Typography>

      <Typography variant="h5" gutterBottom sx={{ mt: 3, color: 'white' }}>
        Position Fundamentals
      </Typography>
      
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        In Position (IP) Advantages:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Act last on all postflop streets</ListItem>
        <ListItem>More control over pot size</ListItem>
        <ListItem>Better bluffing opportunities</ListItem>
        <ListItem>More information for decisions</ListItem>
        <ListItem>Can pot control with marginal hands</ListItem>
      </List>

      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Out of Position (OOP) Adjustments:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Need stronger hands to play</ListItem>
        <ListItem>More emphasis on strong made hands</ListItem>
        <ListItem>Less bluffing frequency</ListItem>
        <ListItem>More check-raising to gain initiative</ListItem>
        <ListItem>Must play more defensively</ListItem>
      </List>

      <Typography variant="h5" gutterBottom sx={{ mt: 3, color: 'white' }}>
        Range Construction
      </Typography>
      
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Early Position Ranges:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Tighter opening ranges</ListItem>
        <ListItem>Premium hands and strong broadways</ListItem>
        <ListItem>Less suited connectors</ListItem>
        <ListItem>Focus on hands that play well multiway</ListItem>
        <ListItem>Emphasis on high card strength</ListItem>
      </List>

      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Late Position Ranges:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Wider opening ranges</ListItem>
        <ListItem>More speculative hands</ListItem>
        <ListItem>More suited connectors and gappers</ListItem>
        <ListItem>Can play more marginal hands</ListItem>
        <ListItem>More bluffing opportunities</ListItem>
      </List>

      <Typography variant="h5" gutterBottom sx={{ mt: 3, color: 'white' }}>
        Range Advantages
      </Typography>
      
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Understanding Range Advantage:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Which range has greater equity</ListItem>
        <ListItem>How equity shifts throughout hand</ListItem>
        <ListItem>Impact of board texture</ListItem>
        <ListItem>Effect of position on range advantage</ListItem>
        <ListItem>Importance of nut advantage</ListItem>
      </List>

      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Nut Advantage:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Having more nutted combinations</ListItem>
        <ListItem>Affects betting and leading strategies</ListItem>
        <ListItem>Important for multiway pots</ListItem>
        <ListItem>Influences check-raising frequency</ListItem>
        <ListItem>Key for aggressive play</ListItem>
      </List>

      <Typography variant="h5" gutterBottom sx={{ mt: 3, color: 'white' }}>
        Board Texture Considerations
      </Typography>
      
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        High Card Boards:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Ace-high boards favor preflop raiser</ListItem>
        <ListItem>King-high boards need more protection</ListItem>
        <ListItem>Queen/Jack-high boards more balanced</ListItem>
        <ListItem>Consider range vs range equity</ListItem>
        <ListItem>Adjust continuation betting accordingly</ListItem>
      </List>

      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Connected Boards:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>More favorable for defending ranges</ListItem>
        <ListItem>Requires careful range construction</ListItem>
        <ListItem>More check-raising opportunities</ListItem>
        <ListItem>Important for straight possibilities</ListItem>
        <ListItem>Consider backdoor possibilities</ListItem>
      </List>

      <Typography variant="h5" gutterBottom sx={{ mt: 3, color: 'white' }}>
        Multiway Considerations
      </Typography>
      
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Adjusting Ranges:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Play tighter in multiway pots</ListItem>
        <ListItem>Value strong hands more</ListItem>
        <ListItem>Reduce bluffing frequency</ListItem>
        <ListItem>Need stronger hands to continue</ListItem>
        <ListItem>More emphasis on nutted hands</ListItem>
      </List>

      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Position Impact:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Position even more crucial multiway</ListItem>
        <ListItem>Last to act has significant advantage</ListItem>
        <ListItem>Need stronger continuing ranges</ListItem>
        <ListItem>More careful with marginal hands</ListItem>
        <ListItem>Consider all players' ranges</ListItem>
      </List>
    </Box>
  );
};

export default PositionAndHandRanges; 