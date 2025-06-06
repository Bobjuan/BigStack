import React from 'react';
import { Typography, Box, List, ListItem, ListItemText } from '@mui/material';

const PlayingAgainstLimpers = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Playing Against Limpers
      </Typography>

      <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
        Understanding Limper Types
      </Typography>
      <Typography paragraph>
        Before developing a strategy against limpers, it's crucial to understand the different types of players who limp:
      </Typography>
      <List>
        <ListItem>
          <ListItemText 
            primary="Common Limper" 
            secondary="Raises premium hands, limps marginal/junky hands, folds trash. When they limp, you can often remove top 10% of hands from their range. They'll often fold to a sizable preflop raise, or at best flop a marginal hand."
          />
        </ListItem>
        <ListItem>
          <ListItemText 
            primary="Trappy Limper" 
            secondary="Limps their entire playable range, including premium hands. More dangerous as they can have strong hands in their limping range."
          />
        </ListItem>
        <ListItem>
          <ListItemText 
            primary="Position-Based Limper" 
            secondary="Limps a mix of monsters and speculative hands from early position, but a wide range from late position."
          />
        </ListItem>
      </List>

      <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
        Strategy Against One Limper
      </Typography>
      
      <Typography variant="h6" gutterBottom>
        Early Position Limper (Wide Range)
      </Typography>
      <List>
        <ListItem>
          <ListItemText 
            primary="When You're Also in Early Position" 
            secondary="• Raise with strong hands (9-9+, A-J+, K-Q+)
• Call with drawing hands (small pairs, suited connectors)
• Fold junk hands (weak Ax, unconnected low cards)
• With marginal hands like K-J or J-T, either raise or fold if players behind might squeeze"
          />
        </ListItem>
        <ListItem>
          <ListItemText 
            primary="When You're in Middle/Late Position" 
            secondary="• More inclined to raise a wider range (including Ax, suited connectors)
• Raising for heads-up in position is often better than limping behind with draws"
          />
        </ListItem>
      </List>

      <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
        Early Position Limper (Tight Range)
      </Typography>
      <List>
        <ListItem>
          <ListItemText 
            primary="Adjusting to Tight Limpers" 
            secondary="• Only raise premium hands
• Call with drawing hands
• Fold marginal hands (A-9, K-T)
• With hands like A-J or K-Q, limp along if they're truly only limping premiums"
          />
        </ListItem>
      </List>

      <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
        Strategy Against Multiple Limpers
      </Typography>
      <List>
        <ListItem>
          <ListItemText 
            primary="Premium Hands" 
            secondary="• Raise for value
• If limpers are wide, your value range widens (can raise 7-7, A-T, K-J)
• Adjust bet size (larger to make them fold, pot-sized or less to get calls)"
          />
        </ListItem>
        <ListItem>
          <ListItemText 
            primary="Marginal Hands" 
            secondary="• Feel free to limp along with hands like Q-J, J-T
• Profitable if you play well postflop
• Be cautious with weaker hands like Q-9, J-8, T-9"
          />
        </ListItem>
        <ListItem>
          <ListItemText 
            primary="Drawing Hands" 
            secondary="• More willing to see flops
• Avoid raising small pairs over multiple limpers
• See cheap flops with suited connectors and small pairs
• Be aware of domination risk with flush draws"
          />
        </ListItem>
      </List>

      <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
        Dealing with Limp-Reraises
      </Typography>
      <List>
        <ListItem>
          <ListItemText 
            primary="Against Nuts-Only Limp-Reraisers" 
            secondary="• Continue only with very strong hands (AA, KK)
• Don't pay off with hands like QQ, JJ, AK"
          />
        </ListItem>
        <ListItem>
          <ListItemText 
            primary="Against Mixed-Range Limp-Reraisers" 
            secondary="• More difficult to play against
• If you 4-bet, they only continue with their best hands
• Call their limp-reraise with your entire profitable playing range
• Adjust calling range based on how wide/bluffy their limp-reraising range is"
          />
        </ListItem>
      </List>

      <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
        Key Tips
      </Typography>
      <List>
        <ListItem>
          <ListItemText 
            primary="Image Matters" 
            secondary="If opponents expect you to raise limps frequently, they'll fight back more. If they see you as straightforward, look for spots to steal their limps."
          />
        </ListItem>
        <ListItem>
          <ListItemText 
            primary="Position is Crucial" 
            secondary="Play more aggressively in position, more cautiously out of position. Position allows you to control pot size and make better decisions postflop."
          />
        </ListItem>
        <ListItem>
          <ListItemText 
            primary="Stack Sizes Matter" 
            secondary="With deeper stacks, you can play more speculative hands that can make the nuts. With shorter stacks, prefer hands that make strong top pair."
          />
        </ListItem>
      </List>
    </Box>
  );
};

export default PlayingAgainstLimpers; 