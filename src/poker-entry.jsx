import React from 'react';
import { createRoot } from 'react-dom/client';
import PokerGame from './js/components/poker/PokerGame';
import './index.css'; // Assuming shared styles for now

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <PokerGame />
  </React.StrictMode>
); 