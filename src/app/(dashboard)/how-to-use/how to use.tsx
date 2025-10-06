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
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 md:mb-8 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x">
              How to Use MeetMe
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-300 mb-12 md:mb-16 max-w-4xl mx-auto leading-relaxed px-4">
              Your complete guide to creating agents, managing meetings, and maximizing productivity with AI-powered collaboration.
            </p>
          </div>
        </div>

        {/* Content Sections */}
        <div className="max-w-6xl mx-auto px-4 pb-16 space-y-16">
          {/* Section 1: Quickly Creating an Agent */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 shadow-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-cyan-400">🤖 Quickly Creating an Agent</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center">
              <div>
                <p className="text-lg text-gray-300 mb-4">
                  Agents are AI assistants that can join your meetings and provide intelligent insights. Here&apos;s how to create one quickly:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-gray-300">
                  <li>Navigate to the &quot;Agents&quot; section in your dashboard</li>
                  <li>Click the &quot;New Agent&quot; button</li>
                  <li>Fill in the agent name and description</li>
                  <li>Configure any specific settings if needed</li>
                  <li>Save to create your AI assistant</li>
                </ol>
                <div className="mt-6">
                  <Link href="/agents">
                    <button className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                      Go to Agents →
                    </button>
                  </Link>
                </div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <div className="text-sm text-gray-400 mb-2">Screenshot: Agent Creation</div>
                <img
                  src="/agent-creation.png"
                  alt="Agent creation interface"
                  className="w-full h-auto rounded border border-slate-600 max-w-full"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Creating a Meeting */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 shadow-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-purple-400">📅 Creating a Meeting</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
              <div>
                <p className="text-lg text-gray-300 mb-4">
                  Create professional meetings with AI assistance. Follow these steps:
                </p>
                <ol className="list-decimal list-inside space-y-3 text-gray-300">
                  <li><strong>Access Meetings:</strong> Go to the Meetings tab</li>
                  <li><strong>Initiate Creation:</strong> Click &quot;New Meeting&quot; button</li>
                  <li><strong>Meeting Details:</strong> Enter title, select agent, add guests</li>
                  <li><strong>Configure:</strong> Set date/time and any additional settings</li>
                  <li><strong>Generate Link:</strong> Create meeting and get shareable join link</li>
                </ol>
                <div className="mt-6">
                  <Link href="/meetings">
                    <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                      Create Meeting →
                    </button>
                  </Link>
                </div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <div className="text-sm text-gray-400 mb-2">Screenshot: Meeting Creation Form</div>
                <img
                  src="/meeting-creation.png"
                  alt="Meeting creation form"
                  className="w-full h-auto rounded border border-slate-600 max-w-full"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Joining or Starting a Meeting */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 shadow-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-pink-400">🎯 Joining or Starting a Meeting</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center">
              <div>
                <p className="text-lg text-gray-300 mb-4">
                  Whether you&apos;re the host or a guest, joining meetings is simple:
                </p>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-pink-300 mb-2">For Hosts:</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-300">
                      <li>Go to your meeting details page</li>
                      <li>Click "Start Meeting" when ready</li>
                      <li>Wait for participants to join</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-pink-300 mb-2">For Guests:</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-300">
                      <li>Click the shared meeting link</li>
                      <li>Enter your name on the join page</li>
                      <li>Click &quot;Join Meeting&quot; to enter</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <div className="text-sm text-gray-400 mb-2">Screenshot: Meeting Join Interface</div>
                <img
                  src="/meeting-join.png.png"
                  alt="Meeting join interface"
                  className="w-full h-auto rounded border border-slate-600 max-w-fit"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Obtaining a Meeting Summary */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 shadow-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-green-400">📋 Obtaining a Meeting Summary</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center">
              <div>
                <p className="text-lg text-gray-300 mb-4">
                  After your meeting ends, get AI-generated summaries automatically:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-gray-300">
                  <li>Meeting concludes automatically or manually</li>
                  <li>AI processes the conversation and generates insights</li>
                  <li>Access summary from the meeting details page</li>
                  <li>View key points, action items, and transcript</li>
                  <li>Share summary with participants via email</li>
                </ol>
                <p className="text-gray-400 mt-4">
                  Summaries include transcripts, key decisions, and actionable next steps.
                </p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <div className="text-sm text-gray-400 mb-2">Screenshot: Meeting Summary</div>
                <img
                  src="/meeting-summary.png.png"
                  alt="Meeting summary interface"
                  className="w-full h-auto rounded border border-slate-600 max-w-fit"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* Interactive Navigation */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 shadow-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-yellow-400">🚀 Ready to Get Started?</h2>
            <div className="text-center">
              <p className="text-lg text-gray-300 mb-8">
                Now that you know how to use MeetMe, start creating amazing AI-powered meetings!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/meetings">
                  <button className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-lg transition-all">
                    Create Your First Meeting
                  </button>
                </Link>
                <Link href="/agents">
                  <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-lg transition-all">
                    Create an Agent
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}