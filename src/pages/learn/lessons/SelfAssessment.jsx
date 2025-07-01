import React from 'react';
import { Typography, Box, List, ListItem } from '@mui/material';

const SelfAssessment = () => {
  return (
    <Box sx={{ color: 'white' }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'white' }}>
        Self-Assessment: Your Current Cash Game Understanding
      </Typography>

      <Typography paragraph sx={{ color: 'white' }}>
        Before diving deeper into advanced concepts, it's crucial to honestly assess your current skill level and identify areas for improvement. This self-assessment will help guide your poker development journey.
      </Typography>

      <Typography variant="h5" gutterBottom sx={{ mt: 3, color: 'white' }}>
        Preflop Play Assessment
      </Typography>
      
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Starting Hand Selection:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Do you have clear reasons for playing/folding hands?</ListItem>
        <ListItem>Are your ranges position-dependent?</ListItem>
        <ListItem>Do you adjust based on table dynamics?</ListItem>
        <ListItem>Can you articulate why certain hands play better in different positions?</ListItem>
      </List>

      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        3-Betting Strategy:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Do you have a balanced 3-betting range?</ListItem>
        <ListItem>Are you 3-betting for value and as bluffs?</ListItem>
        <ListItem>Do you adjust your 3-betting range by position?</ListItem>
        <ListItem>Can you explain your 3-betting strategy against different player types?</ListItem>
      </List>

      <Typography variant="h5" gutterBottom sx={{ mt: 3, color: 'white' }}>
        Postflop Skills
      </Typography>
      
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Board Texture Reading:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Can you quickly identify wet vs dry boards?</ListItem>
        <ListItem>Do you understand how board texture affects ranges?</ListItem>
        <ListItem>Are you adjusting your strategy based on board texture?</ListItem>
        <ListItem>Do you consider turn and river cards that could change board texture?</ListItem>
      </List>

      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Bet Sizing:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Do you use different bet sizes for different purposes?</ListItem>
        <ListItem>Can you explain why you choose specific bet sizes?</ListItem>
        <ListItem>Do you adjust sizing based on stack-to-pot ratio?</ListItem>
        <ListItem>Are you considering opponent tendencies in your sizing?</ListItem>
      </List>

      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Hand Reading:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Can you put opponents on logical hand ranges?</ListItem>
        <ListItem>Do you narrow ranges as hands progress?</ListItem>
        <ListItem>Are you considering blockers in your analysis?</ListItem>
        <ListItem>Do you track betting patterns to inform future decisions?</ListItem>
      </List>

      <Typography variant="h5" gutterBottom sx={{ mt: 3, color: 'white' }}>
        Game Selection and Table Dynamics
      </Typography>
      
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Table Selection:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Do you actively look for profitable games?</ListItem>
        <ListItem>Can you identify player types quickly?</ListItem>
        <ListItem>Are you aware of your win rate at different stakes?</ListItem>
        <ListItem>Do you maintain records of your sessions?</ListItem>
      </List>

      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Position Awareness:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Do you understand positional advantages?</ListItem>
        <ListItem>Are you more aggressive in position?</ListItem>
        <ListItem>Do you adjust your ranges based on position?</ListItem>
        <ListItem>Can you exploit positional advantages postflop?</ListItem>
      </List>

      <Typography variant="h5" gutterBottom sx={{ mt: 3, color: 'white' }}>
        Mental Game and Bankroll
      </Typography>
      
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Emotional Control:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Can you play your A-game while losing?</ListItem>
        <ListItem>Do you avoid tilting after bad beats?</ListItem>
        <ListItem>Are you able to quit when not playing your best?</ListItem>
        <ListItem>Do you maintain focus throughout sessions?</ListItem>
      </List>

      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Bankroll Management:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Do you follow strict bankroll guidelines?</ListItem>
        <ListItem>Are you playing within your means?</ListItem>
        <ListItem>Do you track your results accurately?</ListItem>
        <ListItem>Can you handle downswings professionally?</ListItem>
      </List>

      <Typography variant="h5" gutterBottom sx={{ mt: 3, color: 'white' }}>
        Action Items
      </Typography>
      
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Key Steps:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Start keeping detailed records of your play, including specific hands that gave you trouble and situations where you were unsure of the correct play</ListItem>
        <ListItem>Based on your self-assessment, create a focused study plan that addresses your weakest areas first</ListItem>
        <ListItem>Schedule regular review sessions to track your progress and adjust your study plan as needed</ListItem>
      </List>
    </Box>
  );
};

export default SelfAssessment; 