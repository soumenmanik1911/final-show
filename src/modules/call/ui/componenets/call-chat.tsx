import { useState, useEffect, useRef } from "react";
import { Send, MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  isSystem?: boolean;
}

interface Props {
  isOpen: boolean;
  onToggle: () => void;
  messages: Message[];
  onSendMessage: (message: string) => void;
  participantCount: number;
}

export const CallChat = ({ isOpen, onToggle, messages, onSendMessage, participantCount }: Props) => {
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={onToggle}
          className="rounded-full w-12 h-12 bg-blue-600 hover:bg-blue-700 shadow-lg"
          size="icon"
        >
          <MessageCircle className="w-5 h-5" />
          {participantCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs"
            >
              {participantCount}
            </Badge>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 h-96 bg-slate-800 rounded-lg shadow-xl border border-slate-700 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-slate-700">
        <div className="flex items-center space-x-2">
          <MessageCircle className="w-4 h-4 text-blue-400" />
          <span className="text-white font-medium">Chat</span>
          <Badge variant="secondary" className="text-xs">
            {participantCount} online
          </Badge>
        </div>
        <Button
          onClick={onToggle}
          variant="ghost"
          size="icon"
          className="w-6 h-6 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-3 overflow-y-auto">
        <div className="space-y-3">
          {messages.length === 0 ? (
            <div className="text-center text-slate-400 text-sm py-8">
              No messages yet. Start the conversation!
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-white font-medium text-sm">
                    {message.sender}
                  </span>
                  <span className="text-slate-400 text-xs">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <div className={`text-sm p-2 rounded-lg max-w-xs break-words ${
                  message.isSystem
                    ? 'bg-slate-700 text-slate-300 text-center'
                    : 'bg-blue-600 text-white'
                }`}>
                  {message.content}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="p-3 border-t border-slate-700">
        <div className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
          />
          <Button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className="bg-blue-600 hover:bg-blue-700"
            size="icon"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};