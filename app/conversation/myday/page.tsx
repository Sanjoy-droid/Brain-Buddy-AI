"use client";
import React, { useEffect, useState, useRef } from "react";
import { MessageCircle, Trash2 } from "lucide-react";
import axios from "axios";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: number;
}

const STORAGE_KEY = "chat_conversations";
const MOUNT_KEY = "has_mounted";

const MyDay = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const mountedRef = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  //always focus on input
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [loading]);

  const [fetchedMessages, setFetchedMessages] = useState<Message[]>([]);

  //always scroll to bottom
  useEffect(() => {
    const timer = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
    return () => clearTimeout(timer);
  }, [messages, messagesEndRef]);

  //update local storage
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

  //update fetchedMessages
  useEffect(() => {
    setFetchedMessages(JSON.parse(localStorage.getItem("allMessage") || "[]"));
  }, []);

  //generate chat
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !loading) {
      handleGenerate(query);
      setQuery("");
    }
  };

  const [showModal, setShowModal] = useState(false);

  const handleClearHistory = () => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(MOUNT_KEY);
    localStorage.removeItem("allMessage");

    mountedRef.current = false;
    setShowModal(false);

    window.location.reload();
  };

  useEffect(() => {
    const initialPrompt = localStorage.getItem("initialPrompt");

    if (initialPrompt && !mountedRef.current) {
      mountedRef.current = true;

      localStorage.removeItem("initialPrompt");

      handleGenerate(initialPrompt);
    }
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-800 text-white p-4">
      <h1 className="text-3xl font-bold text-center mb-8">My Day</h1>
      <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center px-4 py-2 text-sm bg-red-900 rounded-lg hover:bg-red-700 transition-all disabled:opacity-50"
            disabled={fetchedMessages.length === 0}
          >
            <Trash2 className="mr-2" size={18} /> Clear History
          </button>
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
                    className="px-4 py-2 text-sm rounded-lg bg-red-600 hover:bg-red-700 transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto space-y-4">
          {fetchedMessages?.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.isUser ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`relative max-w-[80%] p-4 rounded-lg shadow-lg ${
                  message.isUser
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-200"
                }`}
              >
                <p>{message.text}</p>
                <span className="absolute bottom-0 right-2 text-xs text-gray-400">
                  {new Date(message.timestamp)
                    .toLocaleTimeString()
                    .substring(0, 5)}
                </span>
              </div>
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>

        <div className="sticky bottom-0 bg-black/80 backdrop-blur-lg p-4 rounded-xl">
          {error && <p className="text-red-500 mb-2 text-sm">{error}</p>}
          <form className="flex gap-4" onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              className="flex-1 bg-gray-800 text-white rounded-lg p-3"
              placeholder="Enter your message..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className={`px-6 py-2 rounded-lg text-sm ${
                loading || !query.trim()
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 transition-all"
              }`}
            >
              {loading ? "Generating..." : "Send"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MyDay;
