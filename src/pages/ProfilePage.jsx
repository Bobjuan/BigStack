import React from 'react';
import PageLayout from '../components/layout/PageLayout';
import Button from '../components/common/Button';

const ProfilePage = () => {
  const stats = [
    { label: 'Hands Played', value: '10,234' },
    { label: 'Win Rate', value: '5.2 BB/100' },
    { label: 'Total Profit', value: '$2,345' },
    { label: 'Tournaments Won', value: '3' }
  ];

  return (
    <PageLayout>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-[#2f3542] rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-2">John Doe</h1>
          <p className="text-gray-400">Member since January 2024</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-[#2f3542] p-4 rounded-lg text-center">
              <div className="text-xl font-bold">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <Button variant="primary" className="w-full py-3">
            Edit Profile
          </Button>
          <Button variant="secondary" className="w-full py-3">
            View Game History
          </Button>
          <Button variant="danger" className="w-full py-3">
            Log Out
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default ProfilePage; 