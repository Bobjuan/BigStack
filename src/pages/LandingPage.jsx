import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import image1 from '../assets/images/image1.png';
import image2 from '../assets/images/image2.png';
import image3 from '../assets/images/image3.png';
import TopNavBar from '../components/layout/TopNavBar';
import Footer from '../components/layout/Footer';

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [showImage1, setShowImage1] = useState(false);
  const [showImage2, setShowImage2] = useState(false);
  const [showImage3, setShowImage3] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    setTimeout(() => setShowImage1(true), 500);
    setTimeout(() => setShowImage2(true), 1000);
    setTimeout(() => setShowImage3(true), 1500);
  }, []);

  const handleStartLearning = (e) => {
    e.preventDefault();
    if (user) {
      navigate('/learn');
    } else {
      navigate('/signup');
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1115] text-white font-inter">
      <TopNavBar />
      <main className="flex flex-col items-center justify-start min-h-screen px-4 sm:px-6 lg:px-8 pt-40 relative z-20">
        <div className="max-w-4xl mx-auto text-center relative z-30">
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-8 text-white relative z-30 leading-relaxed py-1">
            {user ? 'Welcome back to BigStack!' : 'BigStack: Dynamic Poker Training'}
          </h1>
          <div className={`transform transition-all duration-1000 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'} relative z-30`}>
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              {user 
                ? 'Ready to continue your poker training journey? Jump back into live play, lessons, or take a quiz.'
                : 'Live Play, Interactive Lessons, and AI Review to provide all the training you need to go all-in.'
              }
            </p>
            <div className="relative z-30">
              <div className="flex gap-4 justify-center">
                {user ? (
                  <>
                    <Link
                      to="/play"
                      className="relative z-30 inline-block cursor-pointer px-8 py-4 text-lg font-medium text-[#0F1115] bg-white rounded-full transition-all duration-150 hover:-translate-y-0.5 hover:bg-gray-200 hover:text-[#0F1115] hover:shadow-2xl hover:shadow-indigo-500/80"
                      aria-label="Play Now"
                    >
                      Play Now
                    </Link>
                    <Link
                      to="/learn"
                      className="relative z-30 inline-block cursor-pointer px-8 py-4 text-lg font-medium text-white border-2 border-white rounded-full transition-all duration-150 hover:-translate-y-0.5 hover:bg-white hover:text-[#0F1115] hover:shadow-2xl hover:shadow-indigo-500/80"
                      aria-label="Continue Learning"
                    >
                      Continue Learning
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="relative z-30 inline-block cursor-pointer px-8 py-4 text-lg font-medium text-[#0F1115] bg-white rounded-full transition-all duration-150 hover:-translate-y-0.5 hover:bg-gray-200 hover:text-[#0F1115] hover:shadow-2xl hover:shadow-indigo-500/80"
                      aria-label="Play Now"
                    >
                      Play Now
                    </Link>
                    <button
                      onClick={handleStartLearning}
                      className="relative z-30 inline-block cursor-pointer px-8 py-4 text-lg font-medium text-[#0F1115] bg-white rounded-full transition-all duration-150 hover:-translate-y-0.5 hover:bg-gray-200 hover:text-[#0F1115] hover:shadow-2xl hover:shadow-indigo-500/80"
                      aria-label="Start Learning"
                    >
                      Start Learning
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="w-full max-w-7xl mx-auto mt-12 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className={`relative w-full md:w-1/3 transition-opacity duration-1000 ${showImage1 ? 'opacity-100' : 'opacity-0'} md:mt-8`}>
              <img
                src={image1}
                alt="Poker Training"
                className="w-full h-auto object-contain rounded-2xl"
              />
            </div>
            <div className={`relative w-full md:w-1/4 transition-opacity duration-1000 ${showImage2 ? 'opacity-100' : 'opacity-0'} md:mt-12`}>
              <img
                src={image3}
                alt="AI Analysis"
                className="w-full h-auto object-contain rounded-2xl"
              />
            </div>
            <div className={`relative w-full md:w-1/3 transition-opacity duration-1000 ${showImage3 ? 'opacity-100' : 'opacity-0'}`}>
              <img
                src={image2}
                alt="Live Play"
                className="w-full h-auto object-contain rounded-2xl"
              />
            </div>
          </div>
        </div>
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="text-4xl font-bold text-white leading-tight">
                BigStack is here to make learning poker easy.
              </h2>
            </div>
            <div className="pt-2">
              <p className="text-xl text-gray-300 leading-relaxed">
                Say goodbye to scouring the internet looking for information to help you level up your game. Whether you're just starting out or looking to refine your strategy, BigStack offers everything you are looking for: competitive play, comprehensive lessons, and in-depth review with BigStack AI.
              </p>
            </div>
          </div>
          <div className="w-full h-px bg-gray-800 my-24"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div className="pt-2">
              <p className="text-xl text-gray-300 leading-relaxed">
                As college students passionate about poker, we're committed to democratizing poker education. We understand that traditional training platforms can be prohibitively expensive, which is why we've created an accessible alternative that delivers high-quality training without the premium price tag.
              </p>
            </div>
            <div>
              <h2 className="text-4xl font-bold text-white leading-tight">
                For poker players, by poker players.
              </h2>
            </div>
          </div>
        </div>
      </main>
      <div className="h-32"></div>
      <Footer />
    </div>
  );
};

export default LandingPage; 