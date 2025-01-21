"use client";
import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { MessageCircle, MessageSquareIcon } from "lucide-react";
import axios from "axios";

interface Message {
  text: string;
  isUser: boolean;
}

const STORAGE_KEY = "chat_conversations";

const ConversationPage = () => {
  const searchParams = useSearchParams();
  const prompt = searchParams.get("prompt");
  const [messages, setMessages] = useState<Message[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const initialRenderRef = useRef(false);

  // Load conversations from localStorage on initial mount
  useEffect(() => {
    const savedMessages = localStorage.getItem(STORAGE_KEY);
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  // Save conversations to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  // Handle initial prompt
  useEffect(() => {
    if (prompt && !initialRenderRef.current) {
      initialRenderRef.current = true;
      handleGenerate(prompt);
    }
  }, [prompt]);

  const handleGenerate = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    setLoading(true);
    try {
      // Add user message
      const userMessage: Message = { text: textToSend, isUser: true };
      setMessages((prev) => [...prev, userMessage]);

      const response = await axios({
        url: `${process.env.NEXT_PUBLIC_GEMINI_API_URL}`,
        method: "POST",
        data: {
          contents: [
            {
              parts: [{ text: textToSend }],
            },
          ],
        },
      });

      // Add AI response
      const aiMessage: Message = {
        text: response.data.candidates[0].content.parts[0].text,
        isUser: false,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to generate response");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (query.trim()) {
      handleGenerate(query);
      setQuery("");
    }
  };

  // Clear conversation history
  const handleClearHistory = () => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="text-white hover:text-[#63e]">
            ← Back to Home
          </Link>
          <button
            onClick={handleClearHistory}
            className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
          >
            Clear History
          </button>
        </div>

        {/* Chat Messages */}
        <div className="space-y-4 mb-8 h-[60vh] overflow-y-auto">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-lg ${
                  message.isUser
                    ? "bg-[#63e] text-black"
                    : "bg-gray-800 text-white"
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input Section */}
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-2xl bg-black/50 backdrop-blur-lg p-4 rounded-xl">
          {error && <p className="text-red-500 mb-2">Error: {error}</p>}

          <div className="flex gap-4">
            <form
              className="flex w-full gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              <input
                className="flex-1 bg-gray-800 text-white rounded-lg p-3 resize-none"
                placeholder="Enter your message..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-1 rounded-xl ${
                  loading
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-[#63e] hover:scale-105 transform transition-all"
                }`}
              >
                {loading ? "Generating..." : "Send"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationPage;
