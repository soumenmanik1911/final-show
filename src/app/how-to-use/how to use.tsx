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

export default function HowToUsePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center justify-center pt-16 pb-8 px-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-8 flex justify-center">
              <MeetMeLogo />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              How to Use MeetMe
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Your comprehensive guide to creating and managing AI-powered meetings with MeetMe.
            </p>
          </div>
        </div>

        {/* Content Sections */}
        <div className="max-w-6xl mx-auto px-4 pb-16 space-y-16">
          {/* Section 1: Starting a Meeting */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 shadow-2xl">
            <h2 className="text-3xl font-bold mb-6 text-cyan-400">🚀 How to Start a Meeting</h2>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-lg text-gray-300 mb-4">
                  To create a new meeting, navigate to the Meetings section of your dashboard.
                </p>
                <ol className="list-decimal list-inside space-y-2 text-gray-300">
                  <li>Click on "Meetings" in the sidebar or navigation menu</li>
                  <li>Look for the "New Meeting" button with a plus (+) icon</li>
                  <li>Click the button to open the meeting creation dialog</li>
                </ol>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <div className="text-sm text-gray-400 mb-2">GUI Preview:</div>
                <div className="bg-slate-900 rounded p-3 text-xs font-mono">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-cyan-400">My Meetings</span>
                    <button className="bg-green-600 px-3 py-1 rounded text-white">+ New Meeting</button>
                  </div>
                  <div className="text-gray-500">[Meeting List Table]</div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Steps to Create a Meeting */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 shadow-2xl">
            <h2 className="text-3xl font-bold mb-6 text-purple-400">📝 Steps to Create a Meeting</h2>
            <div className="grid md:grid-cols-2 gap-8 items-start">
              <div>
                <p className="text-lg text-gray-300 mb-4">
                  Once you've opened the New Meeting dialog, follow these steps to set up your meeting:
                </p>
                <ol className="list-decimal list-inside space-y-3 text-gray-300">
                  <li><strong>Title:</strong> Enter a descriptive name for your meeting</li>
                  <li><strong>Description:</strong> Add details about the meeting agenda</li>
                  <li><strong>Date & Time:</strong> Select when the meeting will occur</li>
                  <li><strong>Duration:</strong> Specify how long the meeting will last</li>
                  <li><strong>Click "Create Meeting"</strong> to save and generate the meeting link</li>
                </ol>
                <p className="text-gray-400 mt-4">
                  After creation, you'll be redirected to the meeting details page where you can share the join link.
                </p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <div className="text-sm text-gray-400 mb-2">Form Preview:</div>
                <div className="bg-slate-900 rounded p-4 text-xs font-mono space-y-2">
                  <div><span className="text-cyan-400">Title:</span> <input className="bg-slate-800 px-2 py-1 rounded w-full" placeholder="Team Standup" /></div>
                  <div><span className="text-cyan-400">Description:</span> <textarea className="bg-slate-800 px-2 py-1 rounded w-full" placeholder="Daily team sync..." /></div>
                  <div><span className="text-cyan-400">Date:</span> <input className="bg-slate-800 px-2 py-1 rounded" type="date" /></div>
                  <div><span className="text-cyan-400">Time:</span> <input className="bg-slate-800 px-2 py-1 rounded" type="time" /></div>
                  <button className="bg-green-600 px-4 py-2 rounded text-white w-full">Create Meeting</button>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: How Guests Can Join */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 shadow-2xl">
            <h2 className="text-3xl font-bold mb-6 text-pink-400">👥 How Guests Can Join Your Meeting</h2>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-lg text-gray-300 mb-4">
                  Share the meeting link with your guests so they can easily join the meeting.
                </p>
                <ol className="list-decimal list-inside space-y-2 text-gray-300">
                  <li>After creating the meeting, copy the join link from the meeting details</li>
                  <li>Share the link via email, chat, or any messaging platform</li>
                  <li>Guests click the link to access the join page</li>
                  <li>They enter their name and click "Join Meeting"</li>
                </ol>
                <p className="text-gray-400 mt-4">
                  The join link follows this format: <code className="bg-slate-800 px-2 py-1 rounded">https://yourapp.com/join/[meeting-id]</code>
                </p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <div className="text-sm text-gray-400 mb-2">Join Page Preview:</div>
                <div className="bg-slate-900 rounded p-4 text-center">
                  <div className="text-lg font-bold mb-4 text-cyan-400">Join Meeting</div>
                  <div className="text-sm text-gray-400 mb-4">Meeting: Team Standup</div>
                  <input className="bg-slate-800 px-3 py-2 rounded mb-4 w-full" placeholder="Enter your name" />
                  <button className="bg-green-600 px-6 py-2 rounded text-white">Join Meeting</button>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Using This Guidance Page */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 shadow-2xl">
            <h2 className="text-3xl font-bold mb-6 text-green-400">📖 Using This User Guidance Page</h2>
            <div className="text-center max-w-3xl mx-auto">
              <p className="text-lg text-gray-300 mb-6">
                This page provides step-by-step instructions to help you navigate and use MeetMe effectively.
                Whether you're new to the platform or need a quick refresher, you'll find all the information you need here.
              </p>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                  <div className="text-cyan-400 font-semibold mb-2">📚 Learn</div>
                  <p className="text-gray-400">Read through each section to understand meeting workflows</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                  <div className="text-purple-400 font-semibold mb-2">🎯 Follow Steps</div>
                  <p className="text-gray-400">Use the numbered guides to create and manage meetings</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                  <div className="text-pink-400 font-semibold mb-2">🔍 Reference</div>
                  <p className="text-gray-400">Come back anytime for quick reminders and tips</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}