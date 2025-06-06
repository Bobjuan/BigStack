import React from 'react';
import { Typography, Box, List, ListItem } from '@mui/material';

const TableSelection = () => {
  return (
    <Box sx={{ color: 'white' }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'white' }}>
        Table Selection
      </Typography>

      <Typography paragraph sx={{ color: 'white' }}>
        "If you can't spot the sucker in your first half hour at the table, then you ARE the sucker." This famous quote from Rounders perfectly encapsulates the importance of table selection in poker. Your ability to choose the right game can be just as important as your technical poker skills.
      </Typography>

      <Typography variant="h5" gutterBottom sx={{ mt: 3, color: 'white' }}>
        Identifying Profitable Games
      </Typography>
      
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Evaluating Player Types:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Look for players making clear strategic mistakes</ListItem>
        <ListItem>Observe showdown hands carefully</ListItem>
        <ListItem>Track betting patterns and tendencies</ListItem>
        <ListItem>Identify overly loose or passive players</ListItem>
      </List>

      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Game Quality Assessment:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Better to play lower stakes with weak players</ListItem>
        <ListItem>Avoid tough games even if properly bankrolled</ListItem>
        <ListItem>Look for recreational players having fun</ListItem>
        <ListItem>Consider table dynamics and atmosphere</ListItem>
      </List>

      <Typography variant="h5" gutterBottom sx={{ mt: 3, color: 'white' }}>
        Seat Selection
      </Typography>
      
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Position Principles:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Sit to the left of loose/weak players</ListItem>
        <ListItem>Sit to the right of tight/strong players</ListItem>
        <ListItem>Maximize hands played in position vs weak players</ListItem>
        <ListItem>Minimize hands played out of position vs strong players</ListItem>
      </List>

      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Strategic Considerations:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Position affects your ability to steal blinds</ListItem>
        <ListItem>Consider how players react to aggression</ListItem>
        <ListItem>Evaluate post-flop playing styles</ListItem>
        <ListItem>Look for exploitable tendencies</ListItem>
      </List>

      <Typography variant="h5" gutterBottom sx={{ mt: 3, color: 'white' }}>
        Recognizing Weak Players
      </Typography>
      
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Common Mistakes to Look For:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Frequent limping</ListItem>
        <ListItem>Playing too many hands</ListItem>
        <ListItem>Calling too often with draws</ListItem>
        <ListItem>Inconsistent bet sizing</ListItem>
        <ListItem>Poor position awareness</ListItem>
      </List>

      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Player Type Analysis:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Too loose players lose at high rates</ListItem>
        <ListItem>Too tight players lose at small rates</ListItem>
        <ListItem>Look for emotional decision making</ListItem>
        <ListItem>Identify players on tilt</ListItem>
      </List>

      <Typography variant="h5" gutterBottom sx={{ mt: 3, color: 'white' }}>
        Game Selection Strategy
      </Typography>
      
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Table Dynamics:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>One loose-weak player better than multiple tight players</ListItem>
        <ListItem>Consider overall table atmosphere</ListItem>
        <ListItem>Watch for changing dynamics as players come and go</ListItem>
        <ListItem>Be willing to change tables when conditions deteriorate</ListItem>
      </List>

      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Stake Level Considerations:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Lower stakes often more profitable than higher</ListItem>
        <ListItem>Consider skill level difference between stakes</ListItem>
        <ListItem>Don't let ego drive stake selection</ListItem>
        <ListItem>Balance challenge with profitability</ListItem>
      </List>

      <Typography variant="h5" gutterBottom sx={{ mt: 3, color: 'white' }}>
        Maintaining Your Edge
      </Typography>
      
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Continuous Assessment:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Regularly evaluate game quality</ListItem>
        <ListItem>Track your results in different games</ListItem>
        <ListItem>Be willing to quit unfavorable games</ListItem>
        <ListItem>Keep detailed notes on regular players</ListItem>
      </List>

      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
        Adaptability:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4, '& .MuiListItem-root': { display: 'list-item', color: 'white' } }}>
        <ListItem>Be ready to change tables when needed</ListItem>
        <ListItem>Adjust your strategy to table dynamics</ListItem>
        <ListItem>Don't get stuck in bad games</ListItem>
        <ListItem>Stay focused on profitability over ego</ListItem>
      </List>
    </Box>
  );
};

export default TableSelection; 