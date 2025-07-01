import React from 'react';
import { Typography, Box, List, ListItem } from '@mui/material';

const CourseIntroduction = () => {
  return (
    <Box sx={{ color: 'white' }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'white' }}>
        Course Introduction & Your Poker Development
      </Typography>

      <Typography variant="h5" gutterBottom sx={{ mt: 3, color: 'white' }}>
        Setting Up for Success
      </Typography>
      <Typography paragraph sx={{ color: 'white' }}>
        Poker is a simple game to learn but a difficult game to master. Success in poker requires more than just understanding the rules - it demands a comprehensive approach to the game that includes both strategic knowledge and proper preparation.
      </Typography>

      <Typography variant="h5" gutterBottom sx={{ mt: 3, color: 'white' }}>
        Core Principles
      </Typography>
      
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Key Concepts:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Master the basic concepts before moving on to advanced strategies. A solid foundation in fundamentals is crucial for long-term success</ListItem>
        <ListItem>To succeed long-term, focus on learning rather than money. If you want to make money, you must continuously improve as other players will evolve</ListItem>
        <ListItem>Setting yourself up for success before sitting at the table is just as important as playing a sound strategy</ListItem>
      </List>

      <Typography variant="h5" gutterBottom sx={{ mt: 3, color: 'white' }}>
        Key Areas of Focus
      </Typography>
      
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Strategic Development:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Understanding position and ranges</ListItem>
        <ListItem>Mastering preflop and postflop play</ListItem>
        <ListItem>Developing hand reading skills</ListItem>
        <ListItem>Learning bet sizing and board texture analysis</ListItem>
      </List>

      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Mental Game:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Managing variance and emotions</ListItem>
        <ListItem>Maintaining focus during sessions</ListItem>
        <ListItem>Understanding that losing days are normal</ListItem>
        <ListItem>Building resilience against downswings</ListItem>
      </List>

      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Game Selection:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Choosing profitable games</ListItem>
        <ListItem>Understanding table dynamics</ListItem>
        <ListItem>Recognizing player types</ListItem>
        <ListItem>Adapting to different stake levels</ListItem>
      </List>

      <Typography variant="h5" gutterBottom sx={{ mt: 3, color: 'white' }}>
        Course Structure
      </Typography>
      
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Learning Approach:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>The course is structured to build your skills progressively, starting with fundamentals and moving to more advanced concepts</ListItem>
        <ListItem>Each lesson includes practical examples and scenarios to help you apply the concepts in real game situations</ListItem>
        <ListItem>From basic hand selection to advanced multi-street planning, the course covers all aspects needed to become a winning player</ListItem>
      </List>

      <Typography variant="h5" gutterBottom sx={{ mt: 3, color: 'white' }}>
        Keys to Success
      </Typography>
      
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Essential Habits:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Success requires diligent study and practice. Take time to review concepts and analyze your play regularly</ListItem>
        <ListItem>Follow strict bankroll management guidelines to protect yourself from variance and enable long-term success</ListItem>
        <ListItem>Regularly evaluate your game, identify leaks, and make adjustments based on your findings</ListItem>
      </List>
    </Box>
  );
};

export default CourseIntroduction; 