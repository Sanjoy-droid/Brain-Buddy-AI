// "use client";

"use client";
import React, { useEffect, useState, useRef, useMemo } from "react";
import { Send, Trash2, MessageCircle, Loader2 } from "lucide-react";
import axios from "axios";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: number;
}

const MyDay: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [query]);

  const handleGenerate = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    setLoading(true);
    setError("");

    try {
      const userMessage: Message = {
        id: crypto.randomUUID(),
        text: textToSend,
        isUser: true,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setQuery("");

      const response = await axios({
        url: process.env.NEXT_PUBLIC_GEMINI_API_URL,
        method: "POST",
        data: {
          contents: [{ parts: [{ text: textToSend }] }],
        },
        timeout: 30000,
      });

      const aiMessage: Message = {
        id: crypto.randomUUID(),
        text: response.data.candidates[0].content.parts[0].text,
        isUser: false,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to generate response. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !loading) {
      handleGenerate(query);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (query.trim() && !loading) {
        handleGenerate(query);
      }
    }
  };

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear all messages?")) {
      setMessages([]);
    }
  };

  // Memoized time formatting
  const formatTime = useMemo(() => {
    return (timestamp: number) => {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e] text-white">
      <div className="flex items-center justify-between p-4 bg-[#0f3460]/30 backdrop-blur-md shadow-lg">
        <div className="flex items-center space-x-3">
          <MessageCircle className="w-8 h-8 text-blue-400" />
          <h1 className="text-2xl font-bold tracking-wide">My Day Assistant</h1>
        </div>
        <button
          onClick={handleClearHistory}
          disabled={messages.length === 0}
          className="p-2 rounded-full hover:bg-red-500/20 transition-colors duration-300 group"
        >
          <Trash2
            className={`w-6 h-6 ${
              messages.length === 0
                ? "text-gray-500"
                : "text-red-500 group-hover:scale-110 transition-transform"
            }`}
          />
        </button>
      </div>

      <div
        ref={messagesContainerRef}
        className="flex-grow overflow-y-auto p-4 space-y-4 custom-scrollbar"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`
                max-w-[80%] p-3 rounded-2xl relative 
                ${
                  message.isUser
                    ? "bg-blue-600/80 text-white"
                    : "bg-gray-700/50 text-gray-100"
                }
                shadow-md mb-2
              `}
            >
              <p className="text-sm leading-relaxed">{message.text}</p>
              <span className="text-xs text-gray-300 opacity-70 block text-right mt-1 ">
                {formatTime(message.timestamp)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="px-4 mb-2 text-center">
          <p className="text-red-400 text-sm bg-red-900/30 p-2 rounded-lg">
            {error}
          </p>
        </div>
      )}

      <div className="p-4 bg-[#0f3460]/30 backdrop-blur-md">
        <form
          onSubmit={handleSubmit}
          className="flex items-end space-x-2 max-w-3xl mx-auto"
        >
          <textarea
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            rows={1}
            disabled={loading}
            className="
              flex-grow 
              bg-gray-800/50 
              text-white 
              rounded-xl 
              p-3 
              resize-none 
              max-h-32 
              overflow-y-auto 
              focus:outline-none 
              focus:ring-2 
              focus:ring-blue-500
              transition-all
              duration-300
            "
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className={`
              p-3 
              rounded-full 
              transition-all 
              duration-300 
              ${
                loading || !query.trim()
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 hover:scale-105 active:scale-95"
              }
            `}
          >
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <Send className="w-6 h-6" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MyDay;
