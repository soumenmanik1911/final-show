"use client";

import * as React from "react";
import Link from "next/link";


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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10">
        {/* Header Buttons Section */}
        <div className="w-full max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            {/* Feedback Button */}
            <div className="flex flex-col items-center gap-2">
              <Link href="/my-feedback">
                <button className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold py-3 px-6 sm:px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-cyan-500/25 hover:scale-105 backdrop-blur-sm border border-white/10">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Feedback
                  </div>
                </button>
              </Link>
              <p className="text-sm text-cyan-300 font-medium text-center">Your feedback matters to us</p>
            </div>

            {/* How to Use Button */}
            <div className="flex flex-col items-center gap-2">
              <Link href="/how-to-use">
                <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-6 sm:px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-purple-500/25 hover:scale-105 backdrop-blur-sm border border-white/10">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    How to Use
                  </div>
                </button>
              </Link>
               <p className="text-sm text-cyan-300 font-medium text-center">Easy to use</p>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center min-h-screen px-4 py-16">
          <div className="text-center max-w-6xl mx-auto">
            {/* Logo */}
            <div className="mb-12 flex justify-center animate-bounce">
              <MeetMeLogo />
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x">
              MeetMe
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl lg:text-3xl text-gray-300 mb-16 max-w-4xl mx-auto leading-relaxed">
              Revolutionizing meetings with AI-powered intelligence and seamless collaboration.
            </p>

            {/* Features Section */}
            <div className="space-y-16">
              {/* Feature 1 */}
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 shadow-2xl hover:bg-white/10 transition-all duration-300">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-3 text-cyan-400">Real-Time Transcription</h3>
                    <p className="text-base text-gray-300 leading-relaxed">
                      Experience crystal-clear, instant transcription of your meetings with advanced AI speech recognition.
                      Never miss a word with our cutting-edge technology that captures every detail in real-time.
                    </p>
                  </div>
                  <div className="w-24 h-24 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-3xl">🎙️</span>
                  </div>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 shadow-2xl hover:bg-white/10 transition-all duration-300">
                <div className="flex flex-col md:flex-row-reverse items-center gap-6">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-3 text-purple-400">Intelligent Summaries</h3>
                    <p className="text-base text-gray-300 leading-relaxed">
                      Get AI-generated summaries that capture key points, action items, and decisions from your meetings.
                      Save time and stay focused with automated insights that highlight what matters most.
                    </p>
                  </div>
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-3xl">📊</span>
                  </div>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 shadow-2xl hover:bg-white/10 transition-all duration-300">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-3 text-green-400">Seamless Integration </h3>
                    <p className="text-base text-gray-300 leading-relaxed">
                      Connect effortlessly with your favorite tools and platforms. From calendar sync to video conferencing,
                      MeetMe integrates everywhere you work for a unified and productive experience.
                    </p>
                  </div>
                  <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-3xl">🔗</span>
                  </div>
                </div>
              </div>

              {/* Agent Mode Development Notice */}
              <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-lg rounded-2xl p-8 border border-orange-500/30 shadow-2xl">
                <div className="text-center">
                  <h3 className="text-3xl font-bold mb-4 text-orange-400">🚀 Agent Mode - Coming Soon</h3>
                  <p className="text-lg text-gray-300 leading-relaxed max-w-3xl mx-auto">
                    Our revolutionary AI Agent Mode is currently under development. This advanced feature will bring
                    intelligent assistants that can join your meetings, provide real-time insights, and automate
                    follow-up tasks. Stay tuned for the future of collaborative AI!
                  </p>
                  <div className="mt-6 inline-flex items-center px-6 py-3 bg-orange-500/20 border border-orange-500/50 rounded-full text-orange-300 font-semibold">
                    <span className="animate-pulse mr-2">⚡</span>
                    In Development
                  </div>
                </div>
              </div>

              {/* How to Use Link */}
              <div className="text-center pt-8">
                <Link href="/how-to-use">
                  <button className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                    📖 Learn How to Use MeetMe
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
