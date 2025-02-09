"use client";
import React, { useEffect, useState, useRef } from "react";
import {
  LoaderCircle,
  MessageCircle,
  Trash2,
  SendHorizontal,
} from "lucide-react";
import Link from "next/link";
import axios from "axios";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: number;
}

const MyDay = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const mountedRef = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const conversationContainerRef = useRef<HTMLDivElement>(null);

  const [fetchedMessages, setFetchedMessages] = useState<Message[]>([]);

  // Scroll to bottom function

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  };

  // Always scroll to bottom when messages change
  useEffect(() => {
    const timer = setTimeout(scrollToBottom, 400);
    return () => clearTimeout(timer);
  }, [messages]);

  // Focus on input
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [loading]);

  // Update local storage and fetched messages
  useEffect(() => {
    const storedMessages = JSON.parse(
      localStorage.getItem("allMessage") || "[]",
    );

    const newMessages = messages.filter((message) => {
      return !storedMessages.some(
        (storedMessage: Message) => storedMessage.id === message.id,
      );
    });

    if (newMessages.length > 0) {
      const combinedMessages = [...storedMessages, ...newMessages];
      localStorage.setItem("allMessage", JSON.stringify(combinedMessages));
      setFetchedMessages(combinedMessages);
    }
  }, [messages]);

  // Initial fetch of messages
  useEffect(() => {
    setFetchedMessages(JSON.parse(localStorage.getItem("allMessage") || "[]"));
  }, []);

  // Handle initial prompt
  useEffect(() => {
    const initialPrompt = localStorage.getItem("initialPrompt");

    if (initialPrompt && !mountedRef.current) {
      mountedRef.current = true;
      localStorage.removeItem("initialPrompt");
      handleGenerate(initialPrompt);
    }
  }, []);

  // Generate chat response
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

      setMessages((prev) => [...prev, userMessage, aiMessage]);
      setFetchedMessages((prev) => [...prev, userMessage, aiMessage]);
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to generate response. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !loading) {
      handleGenerate(query);
      setQuery("");
    }
  };

  // Clear chat history
  const handleClearHistory = () => {
    setMessages([]);
    localStorage.removeItem("allMessage");

    mountedRef.current = false;
    setShowModal(false);

    window.location.reload();
  };

  return (
    <>
      <div className="relative min-h-screen bg-gradient-to-br from-zinc-900 via-black to-slate-900 text-gray-50 overflow-hidden">
        {/* Animated Background */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(30,30,30,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(30,30,30,0.1)_1px,transparent_1px)] bg-[size:32px_32px] opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/10 via-transparent to-emerald-900/10 animate-gradient-shift opacity-50" />
        </div>

        {/* Main Container */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 py-4 min-h-screen flex flex-col ">
          {/* Sticky Header */}
          <header className="sticky top-0 z-20 mb-2 bg-zinc-900/60 backdrop-blur-xl py-4 px-6  rounded-xl">
            <div className="flex justify-between items-center">
              <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-500 to-emerald-400 animate-text-shimmer">
                <Link href="/" className="text-4xl font-extrabold">
                  Brain Buddy
                </Link>
              </h1>

              {/* Clear History Button */}
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center justify-center p-2 text-sm bg-red-900 rounded-lg hover:bg-red-700 transition-all disabled:opacity-50"
                disabled={fetchedMessages.length === 0}
              >
                <Trash2 size={18} />
              </button>
            </div>
          </header>

          {/* Conversation Container */}

          <div
            ref={conversationContainerRef}
            className="flex-1 bg-zinc-900/60 backdrop-blur-xl rounded-2xl border border-zinc-800/50 shadow-2xl overflow-y-auto scrollbar scrollbar-thumb-zinc-600 scrollbar-track-zinc-800"
          >
            <div className="p-6 space-y-6 h-80 pb-6">
              <div className="flex flex-col space-y-4  ">
                {fetchedMessages?.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.isUser ? "self-end" : "self-start"
                    } max-w-[75%] w-fit`}
                  >
                    <div
                      className={`
                      ${
                        message.isUser
                          ? "bg-gradient-to-br from-violet-600/70 to-indigo-800/70 text-white rounded-tr-sm h-16"
                          : " bg-zinc-800/80 text-gray-200 rounded-tl-sm"
                      }
                      rounded-3xl p-4 shadow-lg transform transition-all hover:scale-[1.02]
                    `}
                    >
                      <p>{message.text}</p>
                      <span
                        className={`
                        text-xs block mt-1 
                        ${
                          message.isUser
                            ? "text-gray-200 text-right"
                            : "text-gray-500 text-left"
                        }
                      `}
                      >
                        {new Date(message.timestamp)
                          .toLocaleTimeString()
                          .substring(0, 5)}
                      </span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>
          </div>

          {/* Sticky Input Area */}
          <div className="sticky bottom-0 z-20 bg-zinc-800/60 backdrop-blur-xl rounded-full p-2 mt-2 border border-zinc-700/50 shadow-2xl focus-within:ring-2 focus-within:ring-emerald-500/50 transition-all duration-300">
            {error && (
              <p className="text-red-500 mb-2 text-sm text-center">{error}</p>
            )}
            <form
              className="flex items-center space-x-4"
              onSubmit={handleSubmit}
            >
              <input
                ref={inputRef}
                placeholder="Type your message..."
                className="flex-1 bg-transparent text-white placeholder-gray-400 px-8   text-lg focus:outline-none"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !query.trim()}
                className={` px-2 py-2 
              rounded-3xl flex justify-center items-center 
                ${loading || !query.trim() ? " cursor-not-allowed" : ""} 
                transition-opacity
              `}
              >
                {loading ? (
                  <>
                    <LoaderCircle
                      className="  text-indigo-500  animate-spin"
                      size={27}
                    />
                  </>
                ) : (
                  <SendHorizontal
                    className="hover:text-white text-indigo-500"
                    size={27}
                  />
                )}
              </button>
            </form>
          </div>

          {/* Clear History Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
                <h2 className="text-lg font-semibold mb-4">
                  Clear Chat History
                </h2>
                <p className="text-gray-300 mb-6">
                  Are you sure you want to clear all messages?
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-sm rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleClearHistory}
                    className="px-4 py-2 text-sm rounded-lg bg-red-800 hover:bg-red-700 transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Floating Decorative Elements */}
        <div className="fixed pointer-events-none">
          <div className="absolute top-1/4 -left-12 w-64 h-64 bg-purple-900/20 rounded-full blur-3xl animate-blob" />
          <div className="absolute bottom-1/4 -right-12 w-64 h-64 bg-emerald-900/20 rounded-full blur-3xl animate-blob animation-delay-4000" />
        </div>
      </div>
    </>
  );
};

export default MyDay;
