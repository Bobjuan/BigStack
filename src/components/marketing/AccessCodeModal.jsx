import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AccessCodeModal({ isOpen, onClose }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Check password
    if (password === 'bigstackcool!') {
      // Correct password - redirect to welcome
      setTimeout(() => {
        navigate('/welcome');
        onClose();
        setPassword('');
        setLoading(false);
      }, 500);
    } else {
      // Wrong password
      setError('Invalid access code');
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPassword('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-[#181A1B] border border-white/10 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">Enter Access Code</h2>
          <p className="text-gray-400 text-sm">
            Enter your beta access code to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Access code"
            className="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            autoFocus
          />
          
          {error && (
            <div className="text-red-400 text-sm text-center">{error}</div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-3 text-gray-300 border border-white/15 rounded-xl hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white rounded-xl hover:from-indigo-400 hover:to-fuchsia-400 transition-colors disabled:opacity-60"
            >
              {loading ? 'Checking...' : 'Access'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}