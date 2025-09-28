"use client";

import { EmptyState } from "@/components/empty-state";
import { Bot, Users, MessageSquare } from "lucide-react";

interface AgentsEmptyStateProps {
  onCreateAgent: () => void;
}

export const AgentsEmptyState = ({ onCreateAgent }: AgentsEmptyStateProps) => {
  return (
    <div className="flex flex-1 items-center justify-center py-16 px-4">
      <div className="flex flex-col items-center justify-center gap-y-8 max-w-lg mx-auto text-center">
        {/* Custom Illustration */}
        <div className="relative">
          <div className="w-32 h-32 bg-gradient-to-br from-green-50 to-green-100 rounded-3xl flex items-center justify-center shadow-lg">
            <div className="relative">
              {/* Main agent card */}
              <div className="w-20 h-16 bg-white rounded-xl shadow-md flex items-center p-2">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-2">
                  <Bot className="w-3 h-3 text-white" />
                </div>
                <div className="flex-1">
                  <div className="h-1 bg-green-500 rounded w-8 mb-1"></div>
                  <div className="h-1 bg-gray-300 rounded w-6 mb-1"></div>
                  <div className="h-1 bg-gray-300 rounded w-4"></div>
                </div>
              </div>
              {/* Floating elements */}
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-md">
                <Users className="w-3 h-3 text-white" />
              </div>
              <div className="absolute -bottom-1 -left-1 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center shadow-md">
                <MessageSquare className="w-2 h-2 text-white" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex flex-col gap-y-4">
          <h3 className="text-3xl font-bold text-gray-900">Create your first agent</h3>
          <p className="text-gray-600 leading-relaxed text-lg">
            Create an agent to join your meetings. Each agent will follow your instructions 
            and can interact with participants during the call.
          </p>
        </div>
        
        {/* Action Button */}
        <button 
          onClick={onCreateAgent}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:scale-105 hover:shadow-lg flex items-center gap-3"
        >
          <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-lg font-bold">+</span>
          </div>
          New Agent
        </button>
      </div>
    </div>
  );
};
