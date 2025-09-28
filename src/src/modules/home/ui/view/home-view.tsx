"use client";

import * as React from "react";


const MeetMeLogo = () => (
  <svg width="56" height="56" viewBox="0 0 64 64">
    <circle cx="32" cy="32" r="30" fill="url(#grad)" />
    <text x="32" y="40" textAnchor="middle" fontSize="28" fill="#00FFC6" fontWeight="bold">🤝</text>
    <defs>
      <radialGradient id="grad" cx="50%" cy="50%" r="70%" fx="50%" fy="50%">
        <stop offset="0%" stopColor="#2be9a7" />
        <stop offset="100%" stopColor="#111" />
      </radialGradient>
    </defs>
  </svg>
);

export const HomeView = () => {



  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      home 
      
    </div>
  );
};
