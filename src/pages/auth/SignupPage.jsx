import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import LoginImage from '../../assets/images/ChatGPT Image May 23, 2025, 08_09_53 PM.png';

const SignupPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate username
    if (!username.match(/^[a-z0-9_]{3,20}$/)) {
      setError('Username must be 3–20 characters, letters/numbers/underscores only.');
      setLoading(false);
      return;
    }

    try {
      // Check if username is taken
      const { data: existing } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .single();

      if (existing) {
        throw new Error('That username is already taken.');
      }

      // Sign up
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;

      // Insert username into profiles table
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({ id: data.user.id, username });

      if (insertError) throw insertError;

      // Redirect to login page with success message
      navigate('/login', { state: { message: 'Signup successful! Please check your email to verify your account.' } });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-black p-6 relative overflow-hidden"
      style={{
        backgroundImage: `url(${LoginImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Background decoration (no overlay) */}
      <div className="absolute top-0 left-0 w-full h-full z-20">
        <div className="absolute top-[10%] left-[5%] w-[40rem] h-[40rem] bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[10%] right-[5%] w-[30rem] h-[30rem] bg-white/5 rounded-full blur-3xl"></div>
      </div>

      {/* Auth card */}
      <div className="w-full max-w-md relative z-30">
        <div className="bg-white rounded-2xl shadow-2xl shadow-black/30 p-8 lg:p-10">
          {/* Card header at the very top inside the box */}
          <div className="text-center mb-4 mt-0">
            <h1 className="text-3xl font-extrabold tracking-tight mb-2 bg-gradient-to-r from-purple-900 via-purple-700 to-purple-800 bg-clip-text text-transparent leading-relaxed py-1 whitespace-nowrap">
              Create Your Account
            </h1>
          </div>

          {/* Auth card body */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase())}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent shadow-sm text-gray-900 placeholder-gray-500"
                placeholder="Choose a username"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent shadow-sm text-gray-900 placeholder-gray-500"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent shadow-sm text-gray-900 placeholder-gray-500"
                placeholder="Choose a password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-6 bg-black text-white rounded-full font-medium text-base transition-all duration-150 ${
                loading
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-gray-900 active:scale-95 hover:shadow-lg hover:shadow-black/10 hover:-translate-y-0.5'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </span>
              ) : (
                'Create account'
              )}
            </button>
          </form>
          {/* Footer inside the box */}
          <p className="mt-8 text-center text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 font-medium hover:text-indigo-400 transition-colors duration-150">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage; 