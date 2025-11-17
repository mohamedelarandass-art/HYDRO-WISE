
import React from 'react';

const HeroIllustration: React.FC = () => {
  return (
    <div className="relative w-full max-w-lg mx-auto lg:mr-0">
      {/* Background shape */}
      <div className="absolute inset-0 bg-gradient-to-tr from-teal-100 to-green-100 rounded-full blur-3xl opacity-40"></div>
      
      {/* SVG Illustration */}
      <svg viewBox="0 0 400 400" className="relative w-full h-auto drop-shadow-2xl">
        <defs>
          <linearGradient id="plant-leaf" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="pot-body" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#4A5568" />
            <stop offset="100%" stopColor="#2D3748" />
          </linearGradient>
        </defs>
        
        {/* Abstract background UI */}
        <rect x="50" y="70" width="300" height="200" rx="20" fill="#FFFFFF" fillOpacity="0.5" stroke="#E2E8F0" strokeWidth="2" />
        <path d="M 80 200 C 120 150, 180 150, 220 200 S 300 250, 340 200" stroke="#00C49F" strokeWidth="4" fill="none" opacity="0.7" />
        <circle cx="100" cy="120" r="5" fill="#00C49F" opacity="0.8" />
        <circle cx="280" cy="110" r="8" fill="#00C49F" opacity="0.5" />
        
        {/* Pot */}
        <path d="M120 250 H 280 L 260 350 H 140 Z" fill="url(#pot-body)" />
        
        {/* Plant */}
        <g transform="translate(200, 250)">
          {/* Stem */}
          <path d="M0 0 V -80" stroke="#10B981" strokeWidth="10" strokeLinecap="round" />
          {/* Leaves */}
          <path d="M0 -20 C 30 -30, 40 -60, 5 -60" fill="url(#plant-leaf)" transform="rotate(10)" />
          <path d="M0 -25 C -30 -35, -40 -65, -5 -65" fill="url(#plant-leaf)" transform="rotate(-10)" />
          <path d="M0 -40 C 20 -50, 30 -70, 0 -80" fill="url(#plant-leaf)" transform="rotate(20)" />
          <path d="M0 -45 C -20 -55, -30 -75, 0 -85" fill="url(#plant-leaf)" transform="rotate(-20)" />
        </g>
        
        {/* Hand representation */}
        <path d="M 100 350 C 150 380, 250 380, 300 350" stroke="#FBBF24" strokeWidth="35" strokeLinecap="round" fill="none" opacity="0.6" transform="translate(0, -10)" />
      </svg>
    </div>
  );
};

export default HeroIllustration;
