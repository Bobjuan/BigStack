import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoginImage from '../../assets/images/ChatGPT Image May 23, 2025, 08_09_53 PM.png';
import { supabase } from '../../config/supabase';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let loginEmail = email;
      // If input does not contain '@', treat as username and look up email
      if (!email.includes('@')) {
        const { data, error: profileError } = await supabase
          .from('profiles')
          .select('email')
          .eq('username', email)
          .single();
        if (profileError || !data) {
          throw new Error('No account found with that username.');
        }
        loginEmail = data.email;
      }
      const { error } = await signIn({ email: loginEmail, password });
      if (error) throw error;
      const from = location.state?.from?.pathname || '/play';
      navigate(from, { replace: true });
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
      {/* Background decoration overlay for readability */}
      {/* <div className="absolute top-0 left-0 w-full h-full bg-black/30 z-10" /> */}
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full z-20">
        <div className="absolute top-[10%] left-[5%] w-[40rem] h-[40rem] bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[10%] right-[5%] w-[30rem] h-[30rem] bg-white/5 rounded-full blur-3xl"></div>
      </div>

      {/* Auth card */}
      <div className="w-full max-w-md relative z-30">
        <div className="bg-white rounded-2xl shadow-2xl shadow-black/30 p-8 lg:p-10">
          {/* Card header at the very top inside the box */}
          <div className="text-center mb-4 mt-0">
            <h1 className="text-5xl font-extrabold tracking-tight mb-2 bg-gradient-to-r from-purple-900 via-purple-700 to-purple-800 bg-clip-text text-transparent leading-relaxed py-1">
              Welcome Back
            </h1>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide">
                EMAIL / USERNAME
              </label>
              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent shadow-sm text-gray-900 placeholder-gray-500"
                placeholder="Enter your email or username"
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
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-200 bg-gray-50 text-black focus:ring-black" />
                <span className="ml-2 text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-gray-700 hover:text-black font-medium transition-colors duration-150">
                Forgot password?
              </a>
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
                  Signing in...
                </span>
              ) : (
                'Sign in'
              )}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-gray-50 border border-gray-200 rounded-full text-gray-700 font-medium transition-all hover:bg-gray-100 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 active:scale-95"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M23.766 12.2764C23.766 11.4607 23.6999 10.6406 23.5588 9.83807H12.24V14.4591H18.7217C18.4528 15.9494 17.5885 17.2678 16.323 18.1056V21.1039H20.19C22.4608 19.0139 23.766 15.9274 23.766 12.2764Z" fill="#4285F4"/>
                <path d="M12.24 24.0008C15.4764 24.0008 18.2058 22.9382 20.1944 21.1039L16.3274 18.1055C15.2516 18.8375 13.8626 19.252 12.24 19.252C9.07106 19.252 6.40935 17.1399 5.4635 14.3003H1.45667V17.3912C3.50277 21.4434 7.7029 24.0008 12.24 24.0008Z" fill="#34A853"/>
                <path d="M5.4635 14.3003C5.23003 13.5681 5.09865 12.7862 5.09865 12C5.09865 11.2138 5.23003 10.4319 5.4635 9.69977V6.60889H1.45667C0.530324 8.22586 0 10.0682 0 12H4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="#FBBC05"/>
                <path d="M12.24 4.74966C14.0217 4.74966 15.6085 5.36715 16.8563 6.54837L20.2697 3.12504C18.2026 1.18976 15.4764 0 12.24 0C7.7029 0 3.50277 2.55737 1.45667 6.60889L5.4635 9.69977C6.40935 6.86017 9.07106 4.74966 12.24 4.74966Z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
          </form>
          {/* Footer inside the box */}
          <p className="mt-8 text-center text-gray-400">
            Don't have an account?{' '}
            <Link to="/signup" className="text-indigo-600 font-medium hover:text-indigo-400 transition-colors duration-150">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 