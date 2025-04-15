import React from 'react';
import ReactDOM from 'react-dom/client';
import PokerGame from './js/components/poker/PokerGame';
import './index.css'; // Assuming shared styles for now

ReactDOM.createRoot(document.getElementById('poker-root')).render(
  <React.StrictMode>
    <PokerGame />
  </React.StrictMode>,
); 