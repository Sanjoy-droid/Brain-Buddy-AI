"use client";

import { useState } from "react";
import Link from "next/link";

import {
  MessageCircle,
  Sparkles,
  Zap,
  Shield,
  ArrowRight,
  MessageSquareIcon,
} from "lucide-react";
import Cards from "./components/Cards";

export default function Home() {
  const chatbotPrompts = [
    {
      prompt: "Can you help me plan my day?",
      description: "Ask the chatbot to create a personalized daily schedule.",
    },
    {
      prompt: "Tell me a fun fact I probably don't know.",
      description:
        "Engage the chatbot to share an intriguing fact from a range of topics.",
    },
    {
      prompt: "Write a quick email.",
      description:
        "Let the chatbot draft a professional email that expresses regret for missing a meeting. ",
    },
  ];

  const [promptValue, setPromptValue] = useState("");

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/5 via-transparent to-emerald-500/5 animate-[gradient_8s_ease-in-out_infinite]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle_400px_at_center,#fbfbfb36,transparent)] animate-[pulse_4s_ease-in-out_infinite]" />
      </div>
      {/* Main Content */}
      <main className="relative">
        {/* Hero Section */}
        <section className="min-h-screen flex flex-col items-start justify-center px-4 pb-40">
          <div className="max-w-6xl mx-auto text-center">
            {/* Floating Badge */}
            <div className="inline-flex animate-[bounce_3s_ease-in-out_infinite]">
              <span className="px-4 py-2 rounded-full border border-gray-800 bg-gray-900/50 backdrop-blur-xl text-sm text-gray-400">
                <span className="text-emerald-500">AI</span> Powered
                Intelligence
              </span>
            </div>
            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight animate-[slideDown_0.5s_ease-out] mt-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-blue-400 to-emerald-400 animate-[gradient_3s_ease-in-out_infinite]">
                Brain-Buddy AI
              </span>
            </h1>
            {/* Subheading */}
            <p className="max-w-2xl mx-auto text-xl text-gray-400 animate-[fadeIn_0.5s_ease-out_0.3s] mt-6">
              Experience the future of conversation with our advanced AI
              chatbot. Powered by cutting-edge technology for human-like
              interactions.
            </p>
            <Cards
              chatbotPrompts={chatbotPrompts}
              setPromptValue={setPromptValue}
            />
            <div className="flex flex-wrap justify-center gap-4 animate-[slideUp_0.5s_ease-out_0.5s] ">
              {/* input */}

              <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-2xl">
                <div className="bg-slate-900 p-4 rounded-xl shadow-lg flex items-center space-x-4">
                  <div className="text-[#63e] text-2xl">
                    <MessageCircle />
                  </div>
                  <input
                    value={promptValue}
                    onChange={(e) => setPromptValue(e.target.value)}
                    type="text"
                    placeholder="Ask me anything..."
                    className="flex-1 bg-transparent text-white placeholder-gray-300 border-b-2 border-[#63e] focus:outline-none focus:ring-0 focus:border-[#63e] p-2 text-lg"
                  />
                  <Link
                    href={{
                      pathname: "/conversation",
                      query: { prompt: promptValue },
                    }}
                    className="bg-[#63e] text-black px-6 py-3 rounded-full hover:scale-105 transform transition-all"
                  >
                    Send
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-1/4 left-10 w-24 h-24 bg-violet-500/10 rounded-full blur-3xl animate-[float_8s_ease-in-out_infinite]" />
          <div className="absolute bottom-1/4 right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl animate-[float_6s_ease-in-out_infinite_reverse]" />
        </section>
      </main>
    </div>
  );
}
