import React from 'react';
import { Typography, Box, List, ListItem } from '@mui/material';

const EssentialMindset = () => {
  return (
    <Box sx={{ color: 'white' }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'white' }}>
        Essential Mindset & Bankroll Prerequisites
      </Typography>

      <Typography paragraph sx={{ color: 'white' }}>
        Success in poker requires more than just technical skills. The right mindset and proper bankroll management are fundamental prerequisites that will determine your long-term success in the game.
      </Typography>

      <Typography variant="h5" gutterBottom sx={{ mt: 3, color: 'white' }}>
        The Winner's Mindset
      </Typography>
      
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Focus on Learning:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Prioritize improvement over immediate profits</ListItem>
        <ListItem>Study and analyze your play regularly</ListItem>
        <ListItem>Stay updated with evolving strategies</ListItem>
        <ListItem>Learn from both wins and losses</ListItem>
      </List>

      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Long-Term Perspective:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Understand that poker is a long-term game</ListItem>
        <ListItem>Accept that losing days are normal</ListItem>
        <ListItem>Focus on making correct decisions</ListItem>
        <ListItem>Don't let short-term results affect your play</ListItem>
      </List>

      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Emotional Control:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Play your best game regardless of results</ListItem>
        <ListItem>Avoid tilting after bad beats</ListItem>
        <ListItem>Know when to quit a session</ListItem>
        <ListItem>Maintain professional attitude at all times</ListItem>
      </List>

      <Typography variant="h5" gutterBottom sx={{ mt: 3, color: 'white' }}>
        Bankroll Prerequisites
      </Typography>
      
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Starting Capital:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Have sufficient buy-ins for your chosen stake</ListItem>
        <ListItem>Keep poker funds separate from life expenses</ListItem>
        <ListItem>Only play with money you can afford to lose</ListItem>
        <ListItem>Consider costs beyond buy-ins (travel, rake, etc.)</ListItem>
      </List>

      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Risk Management:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Follow strict bankroll management rules</ListItem>
        <ListItem>Never risk more than prescribed limits</ListItem>
        <ListItem>Have a plan for moving up/down in stakes</ListItem>
        <ListItem>Track all sessions and expenses</ListItem>
      </List>

      <Typography variant="h5" gutterBottom sx={{ mt: 3, color: 'white' }}>
        Study Habits
      </Typography>
      
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Regular Review:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Analyze your play after each session</ListItem>
        <ListItem>Keep detailed notes on tough spots</ListItem>
        <ListItem>Review hands with stronger players</ListItem>
        <ListItem>Study consistently, not just after losses</ListItem>
      </List>

      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Strategic Development:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Build a solid fundamental strategy</ListItem>
        <ListItem>Regularly update your knowledge</ListItem>
        <ListItem>Study opponents' tendencies</ListItem>
        <ListItem>Work on your weakest areas first</ListItem>
      </List>

      <Typography variant="h5" gutterBottom sx={{ mt: 3, color: 'white' }}>
        Game Selection
      </Typography>
      
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Table Selection:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Choose games where you have an edge</ListItem>
        <ListItem>Avoid games above your bankroll</ListItem>
        <ListItem>Look for profitable table dynamics</ListItem>
        <ListItem>Be willing to change tables when needed</ListItem>
      </List>

      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Stake Selection:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Play at stakes you're properly rolled for</ListItem>
        <ListItem>Move up only when ready both mentally and financially</ListItem>
        <ListItem>Be willing to move down when necessary</ListItem>
        <ListItem>Don't let ego influence stake selection</ListItem>
      </List>

      <Typography variant="h5" gutterBottom sx={{ mt: 3, color: 'white' }}>
        Professional Approach
      </Typography>
      
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Record Keeping:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Track all sessions and results</ListItem>
        <ListItem>Monitor win rates at different stakes</ListItem>
        <ListItem>Keep notes on regular opponents</ListItem>
        <ListItem>Analyze trends in your play</ListItem>
      </List>

      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Life Balance:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Maintain healthy lifestyle habits</ListItem>
        <ListItem>Manage time effectively</ListItem>
        <ListItem>Keep poker separate from personal life</ListItem>
        <ListItem>Have interests outside of poker</ListItem>
      </List>

      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Continuous Improvement:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Stay humble and eager to learn</ListItem>
        <ListItem>Network with other players</ListItem>
        <ListItem>Adapt to changing game conditions</ListItem>
        <ListItem>Regularly assess and adjust your game</ListItem>
      </List>
    </Box>
  );
};

export default EssentialMindset; 