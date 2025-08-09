import React, { useState } from 'react';
import { supabase } from '../../config/supabase';

export default function EmailWaitlistForm({ size = 'lg', className = '' }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Enter a valid email');
      return;
    }
    setLoading(true);
    setError('');
    try {
      // Store to a simple waitlist table; safe if table exists
      const { error: insertError } = await supabase
        .from('waitlist')
        .insert({ email, created_at: new Date().toISOString() });
      if (insertError) throw insertError;
      setSuccess(true);
      setEmail('');
    } catch (err) {
      console.error('Waitlist error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const sizes = {
    lg: {
      input: 'px-5 py-4 text-base',
      button: 'px-6 py-4 text-base',
      container: 'flex-col sm:flex-row gap-3',
    },
    md: {
      input: 'px-4 py-3 text-sm',
      button: 'px-5 py-3 text-sm',
      container: 'flex-col sm:flex-row gap-3',
    },
    sm: {
      input: 'px-3 py-2 text-sm',
      button: 'px-4 py-2 text-sm',
      container: 'flex-row gap-2',
    },
  };
  const s = sizes[size] || sizes.lg;

  if (success) {
    return (
      <div className={`w-full bg-emerald-500/10 border border-emerald-600/40 text-emerald-300 rounded-xl p-4 ${className}`}>
        {size === 'sm' ? "You're on the list!" : "You're on the list! We'll email you as beta slots open."}
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      <form onSubmit={handleSubmit} className={`flex ${s.container}`}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className={`flex-1 bg-white/5 border border-white/15 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${s.input}`}
          aria-label="Email address"
        />
        <button
          type="submit"
          disabled={loading}
          className={`rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-500 to-fuchsia-500 hover:from-indigo-400 hover:to-fuchsia-400 transition-colors disabled:opacity-60 whitespace-nowrap ${s.button}`}
        >
          {loading ? 'Joining…' : size === 'sm' ? 'Join' : 'Join the Waitlist'}
        </button>
      </form>
      {error && <div className="text-red-400 text-sm mt-2">{error}</div>}
      {/* Only show disclaimer on larger forms */}
      {size !== 'sm' && (
        <div className="text-xs text-gray-400 mt-2 text-center">Join 500+ players improving their game with data</div>
      )}
    </div>
  );
}