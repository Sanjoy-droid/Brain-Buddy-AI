import React, { useRef } from "react";
import { MessageSquare } from "lucide-react";
import ChatSection from "./ChatSection";

type ChatProps = {
  role: string;
};
const page = ({ role }: ChatProps) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  return (
    <>
      <div className=" bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] ">
        <div className="flex max-h-screen pb-48 flex-1 flex-col overflow-y-auto">
          <div
            className="flex-1 flex flex-col items-center justify-center gap-2
bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] min-h-[24rem] text-center px-6"
          >
            {/* Animated Logo Section */}
            <div className="flex items-center justify-center bg-blue-100 dark:bg-indigo-800 rounded-full w-20 h-20 shadow-lg animate-bounce">
              <MessageSquare className="w-10 h-10 text-blue-600 dark:text-indigo-300" />
              <h3>{role}</h3>
            </div>

            {/* Title Section */}
            <h1 className="text-5xl font-extrabold text-indigo-800 dark:text-indigo-300 tracking-tight">
              Welcome to Brain Buddy
            </h1>

            {/* Subtitle Section */}
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
              Harness the power of AI and{" "}
              <a
                className=" hover:border-b text-blue-600"
                href="https://github.com/upstash/rag-chat"
              >
                {" "}
                RAG-Chat
              </a>{" "}
              to explore knowledge, solve problems, and gain insights. Let Web
              Wisdom be your guide to smarter conversations.
            </p>

            {/* Call-to-Action Button */}
            <div className="flex flex-col sm:flex-row gap-4 items-center"></div>

            {/* Footer Section */}
            <footer className="absolute bottom-6 text-sm text-gray-500 dark:text-gray-400">
              <p>
                Made with{" "}
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                  Google Gemini API
                </span>
              </p>
            </footer>
          </div>

          <div ref={messagesEndRef} />
        </div>
      </div>
    </>
  );
};

export default page;
