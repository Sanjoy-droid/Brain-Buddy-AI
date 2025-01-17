import React, { useState } from "react";

import { MessageSquare, Sparkles, Zap, Shield, ArrowRight } from "lucide-react";

type CardProps = {
  prompt: string;
  description: string;
};
const page = () => {
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
  // console.log(promptValue);
  return (
    <>
      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 max-w-5xl mx-auto mt-8 px-4 animate-[fadeIn_0.5s_ease-out_0.7s]">
        {chatbotPrompts.map((card: CardProps, index: number) => (
          <div
            key={index}
            onClick={() => {
              setPromptValue(card.prompt);
            }}
            className="group relative p-4 rounded-2xl border border-gray-800 bg-gray-900/50 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:bg-gray-900/80 h-52 cursor-pointer"
          >
            <div
              className="absolute -inset-0.5 bg-gradient-to-r from-indigo-900 to-blue-500 rounded-2xl opacity-0 blur transition-all duration-300 
group-hover:opacity-10"
            />
            <div className="relative flex flex-col gap-2">
              <span className="p-2 w-fit rounded-xl bg-violet-500/10 text-violet-500">
                <MessageSquare className="w-4 h-4" />
              </span>
              <h3 className="text-xl font-semibold text-white">
                {card.prompt}
              </h3>
              <p className="text-gray-400">{card.description}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default page;
