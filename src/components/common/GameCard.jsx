import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const GameCard = ({ title, description, href }) => {
  return (
    <Link to={href} className="game-card">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-sm text-gray-400">{description}</p>
    </Link>
  );
};

GameCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
};

export default GameCard; 