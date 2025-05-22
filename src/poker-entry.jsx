import React from 'react';
import { createRoot } from 'react-dom/client';
import CashGamePage from './pages/game/CashGamePage';
import './styles/main.css';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<CashGamePage />); 