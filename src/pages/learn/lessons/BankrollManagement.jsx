import React from 'react';
import { Typography, Box, List, ListItem, ListItemText } from '@mui/material';

const BankrollManagement = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Bankroll Management
      </Typography>

      <Typography paragraph>
        Bankroll management is the poker equivalent of risk management. Without proper bankroll management, you are absolutely certain to lose all your money, no matter how well you play. Understanding variance and following strict guidelines is essential for long-term success.
      </Typography>

      <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
        Core Rules for Bankroll Management
      </Typography>
      <List>
        <ListItem>
          <ListItemText 
            primary="Rule #1 – Have a Dedicated Poker Bankroll" 
            secondary="• Keep poker funds separate from life expenses
• Only play with money you can afford to lose
• Your bankroll should be a comfortable fraction of your net worth
• Never play with money needed for living expenses"
          />
        </ListItem>
        <ListItem>
          <ListItemText 
            primary="Rule #2 – Maintain Proper Buy-in Requirements" 
            secondary="• Minimum 25 buy-ins for cash games
• Minimum 50 buy-ins for tournaments
• Optimal: 40 buy-ins for cash games, 100 for tournaments
• Never exceed these limits even when running well"
          />
        </ListItem>
        <ListItem>
          <ListItemText 
            primary="Rule #3 – Network and Build Relationships" 
            secondary="• Make connections with other players
• They can become potential investors
• Helpful for moving up in stakes
• Can share action to reduce variance"
          />
        </ListItem>
      </List>

      <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
        Understanding Variance
      </Typography>
      <List>
        <ListItem>
          <ListItemText 
            primary="Short-term Results vs Long-term Expectation" 
            secondary="Even with a positive win rate of 5BB/100 hands, there's still a 30% chance of losing money over a 10,000-hand sample. This demonstrates why proper bankroll management is crucial."
          />
        </ListItem>
        <ListItem>
          <ListItemText 
            primary="Dealing with Downswings" 
            secondary="• Accept that losing days are normal
• Understand that profit is long-term
• Losing your entire session is bound to happen
• Focus on making correct decisions rather than results"
          />
        </ListItem>
      </List>

      <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
        Moving Up in Stakes
      </Typography>
      <List>
        <ListItem>
          <ListItemText 
            primary="When to Move Up" 
            secondary="• Have the required number of buy-ins for the next level
• Consistently winning at current stake
• Comfortable with the skill level increase
• Prepared for increased variance"
          />
        </ListItem>
        <ListItem>
          <ListItemText 
            primary="Moving Up Strategies" 
            secondary="• Consider selling action to reduce risk
• Take shots at higher stakes with a portion of bankroll
• Be prepared to move back down if needed
• Don't let ego prevent moving down in stakes"
          />
        </ListItem>
      </List>

      <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
        Common Bankroll Management Mistakes
      </Typography>
      <List>
        <ListItem>
          <ListItemText 
            primary="Playing Too High" 
            secondary="• Playing stakes beyond your bankroll
• Chasing losses at higher stakes
• Not moving down when necessary
• Letting ego influence decisions"
          />
        </ListItem>
        <ListItem>
          <ListItemText 
            primary="Poor Money Management" 
            secondary="• Mixing poker funds with life expenses
• Taking money out of bankroll while building it
• Not keeping accurate records
• Playing when emotionally compromised"
          />
        </ListItem>
      </List>

      <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
        Additional Considerations
      </Typography>
      <List>
        <ListItem>
          <ListItemText 
            primary="Game Selection Impact" 
            secondary="Better game selection allows for slightly lower bankroll requirements as your edge is higher."
          />
        </ListItem>
        <ListItem>
          <ListItemText 
            primary="Win Rate Consideration" 
            secondary="Higher win rates can justify slightly lower bankroll requirements, but err on the side of caution."
          />
        </ListItem>
        <ListItem>
          <ListItemText 
            primary="Life Factors" 
            secondary="Consider your personal financial situation, responsibilities, and risk tolerance when setting bankroll requirements."
          />
        </ListItem>
      </List>
    </Box>
  );
};

export default BankrollManagement; 