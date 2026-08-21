// app/page.tsx (Landing Page)
'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Code, FileCode, Image, Terminal, Zap } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-gray-950/80 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="font-bold text-lg">A</span>
              </div>
              <span className="ml-2 text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                APEX AI
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-gray-300 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link
                href="/register"
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <p className="text-blue-400 font-semibold mb-4">Your AI Coding Partner</p>
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent">
              Build smarter.
              <br />
              Code faster.
            </h1>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              APEX AI understands your code, files and images to help you build, debug and create faster.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/chat"
                className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all hover:scale-105"
              >
                Start Chatting
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="#features"
                className="bg-gray-800 hover:bg-gray-700 px-8 py-4 rounded-xl font-semibold transition-all hover:scale-105"
              >
                Explore APEX AI
              </Link>
            </div>
          </motion.div>

          {/* Features Grid */}
          <div id="features" className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Code className="w-8 h-8" />,
                title: 'Code Understanding',
                description: 'Deep analysis of your code with intelligent suggestions and fixes.',
              },
              {
                icon: <FileCode className="w-8 h-8" />,
                title: 'File Analysis',
                description: 'Upload multiple files and get comprehensive project-level insights.',
              },
              {
                icon: <Image className="w-8 h-8" />,
                title: 'Image Recognition',
                description: 'Analyze screenshots, errors, and UI designs with visual AI.',
              },
              {
                icon: <Terminal className="w-8 h-8" />,
                title: 'Built-in Editor',
                description: 'Monaco-powered editor with AI-assisted coding features.',
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: 'Instant Responses',
                description: 'Streaming responses with real-time AI interaction.',
              },
              {
                icon: <Code className="w-8 h-8" />,
                title: 'Multi-Language',
                description: 'Support for Lua, Luau, JavaScript, TypeScript, and more.',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-900/50 backdrop-blur-lg border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-all hover:scale-105"
              >
                <div className="text-blue-400 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
