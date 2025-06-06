import React from 'react';
import { Typography, Box, List, ListItem } from '@mui/material';

const MentalGame = () => {
  return (
    <Box sx={{ color: 'white' }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'white' }}>
        Mental Game
      </Typography>

      <Typography paragraph sx={{ color: 'white' }}>
        The mental game is a crucial aspect of poker success. Understanding and managing psychological factors can significantly impact your decision-making and long-term results.
      </Typography>

      <Typography variant="h5" gutterBottom sx={{ mt: 3, color: 'white' }}>
        The Three Negative States
      </Typography>
      
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Tilt:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Loss of rational thinking</ListItem>
        <ListItem>Emotional decision making</ListItem>
        <ListItem>Inability to process information</ListItem>
        <ListItem>Triggered by bad beats</ListItem>
        <ListItem>Affected by variance</ListItem>
      </List>

      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Pseudo Tilt:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Prioritizing wrong goals</ListItem>
        <ListItem>Getting even mentality</ListItem>
        <ListItem>Revenge-seeking behavior</ListItem>
        <ListItem>Locking up wins</ListItem>
        <ListItem>Rational but incorrect decisions</ListItem>
      </List>

      <Typography variant="h5" gutterBottom sx={{ mt: 3, color: 'white' }}>
        Cognitive Biases
      </Typography>
      
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Common Biases:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Confirmation bias</ListItem>
        <ListItem>Outcome bias</ListItem>
        <ListItem>Gambler's fallacy</ListItem>
        <ListItem>Dunning-Kruger effect</ListItem>
        <ListItem>Results-oriented thinking</ListItem>
      </List>

      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Managing Biases:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Focus on process</ListItem>
        <ListItem>Analyze decisions objectively</ListItem>
        <ListItem>Understand variance</ListItem>
        <ListItem>Accept uncertainty</ListItem>
        <ListItem>Learn from mistakes</ListItem>
      </List>

      <Typography variant="h5" gutterBottom sx={{ mt: 3, color: 'white' }}>
        Confidence Management
      </Typography>
      
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Over-Confidence:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Unnecessary risk-taking</ListItem>
        <ListItem>Playing above skill level</ListItem>
        <ListItem>Ignoring learning opportunities</ListItem>
        <ListItem>Overestimating abilities</ListItem>
        <ListItem>Poor game selection</ListItem>
      </List>

      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Under-Confidence:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Risk aversion</ListItem>
        <ListItem>Missing value bets</ListItem>
        <ListItem>Avoiding tough spots</ListItem>
        <ListItem>Self-doubt impact</ListItem>
        <ListItem>Missed opportunities</ListItem>
      </List>

      <Typography variant="h5" gutterBottom sx={{ mt: 3, color: 'white' }}>
        Physical and Mental Fatigue
      </Typography>
      
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Physical Tiredness:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Can still think clearly</ListItem>
        <ListItem>Decision quality maintained</ListItem>
        <ListItem>Consider good opportunities</ListItem>
        <ListItem>Take appropriate breaks</ListItem>
        <ListItem>Manage session length</ListItem>
      </List>

      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Mental Fatigue:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Decision quality drops</ListItem>
        <ListItem>Take necessary breaks</ListItem>
        <ListItem>Avoid extended sessions</ListItem>
        <ListItem>Recognize warning signs</ListItem>
        <ListItem>Maintain work-life balance</ListItem>
      </List>

      <Typography variant="h5" gutterBottom sx={{ mt: 3, color: 'white' }}>
        Long-Term Success
      </Typography>
      
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Study Habits:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Regular review sessions</ListItem>
        <ListItem>Focus on improvement</ListItem>
        <ListItem>Learn from mistakes</ListItem>
        <ListItem>Stay updated with theory</ListItem>
        <ListItem>Maintain discipline</ListItem>
      </List>

      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Lifestyle Balance:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Proper rest and recovery</ListItem>
        <ListItem>Healthy routines</ListItem>
        <ListItem>Stress management</ListItem>
        <ListItem>Bankroll discipline</ListItem>
        <ListItem>Life-poker balance</ListItem>
      </List>
    </Box>
  );
};

export default MentalGame; 