import React from 'react';
import Link from 'next/link';
import { Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="container px-4 py-4  md:mx-24   opacity-100">

      <div className="flex justify-center space-x-12">
        <Link
          href="https://github.com/Sanjoy-droid/Brain-Buddy-AI"
          target="_blank"
          className="transform text-gray-400 transition duration-300 hover:scale-110 hover:text-indigo-500"
        >
          <Github size={32} />
        </Link>
        <Link
          href="https://twitter.com/sanjoy_droid"
          target="_blank"
          className="transform text-gray-400 transition duration-300 hover:scale-110 hover:text-indigo-500"
        >
          <Twitter size={32} />
        </Link>
        <Link
          href="https://linkedin.com/in/sanjoy-guin-bb3153343"
          target="_blank"
          className="transform text-gray-400 transition duration-300 hover:scale-110 hover:text-indigo-500"
        >
          <Linkedin size={32} />
        </Link>

      </div>
      <div className="mt-8">
        <p className="text-center text-sm leading-5 text-muted-foreground">
          &copy; {new Date().getFullYear()} Sanjoy Guin. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
