import React, { useState, useEffect, useRef } from 'react';

export default function AnimatedStatCard({ number, label, suffix = '', delay = 0 }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const steps = 60;
    const increment = number / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= number) {
        setCount(number);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isVisible, number]);

  return (
    <div 
      ref={cardRef}
      className={`relative group transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-fuchsia-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:border-white/20 transition-colors">
        <div className="text-4xl md:text-5xl font-bold mb-2">
          <span className="bg-gradient-to-r from-indigo-400 to-fuchsia-400 bg-clip-text text-transparent">
            {count}{suffix}
          </span>
        </div>
        <div className="text-sm text-gray-400 uppercase tracking-wider">{label}</div>
      </div>
    </div>
  );
}