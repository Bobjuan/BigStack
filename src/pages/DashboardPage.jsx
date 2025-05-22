import React from 'react';
import PageLayout from '../components/layout/PageLayout';
import GameCard from '../components/common/GameCard';

const DashboardPage = () => {
  const gameOptions = [
    {
      title: '6-Max Cash',
      description: 'Play 6-handed cash games with advanced AI opponents',
      href: '/cash-game'
    },
    {
      title: 'Heads Up',
      description: 'Test your skills in 1-on-1 poker matches',
      href: '/heads-up'
    },
    {
      title: 'GTO Trainer',
      description: 'Learn optimal play with our GTO training tool',
      href: '/gto-trainer'
    },
    {
      title: 'Tournament',
      description: 'Compete in multi-table tournaments',
      href: '/tournament'
    }
  ];

  return (
    <PageLayout showNavigation={false}>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to BigStack</h1>
        <p className="text-gray-400">Choose your game mode to begin</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-items-center">
        {gameOptions.map((game, index) => (
          <GameCard
            key={index}
            title={game.title}
            description={game.description}
            href={game.href}
          />
        ))}
      </div>
    </PageLayout>
  );
};

export default DashboardPage; 