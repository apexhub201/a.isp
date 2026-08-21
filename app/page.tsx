// app/page.tsx - Landing Page
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowRight,
  Code,
  FileCode,
  Image as ImageIcon,
  Terminal,
  Zap,
  Sparkles,
  Shield,
  Clock,
  Workflow,
  GitBranch,
  Cpu,
  Globe,
  Lock,
  Cloud,
  Database,
  Bot,
  Wand2,
  Braces,
  Smartphone,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="font-bold text-lg text-white">A</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                APEX AI
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-6">
              <Link href="#features" className="text-gray-300 hover:text-white transition-colors">
                Features
              </Link>
              <Link href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">
                How it Works
              </Link>
              <Link href="#pricing" className="text-gray-300 hover:text-white transition-colors">
                Pricing
              </Link>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-gray-300 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link
                href="/register"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-4 py-2 rounded-lg transition-all hover:scale-105"
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
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-2 mb-8"
            >
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-400">AI Coding Assistant</span>
            </motion.div>

            {/* Main Heading */}
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent">
              Build smarter.
              <br />
              Code faster.
            </h1>

            {/* Description */}
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              APEX AI understands your code, files and images to help you build, debug and create faster.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link
                href="/chat"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all hover:scale-105 shadow-lg shadow-blue-500/25"
              >
                Start Chatting
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="#features"
                className="bg-gray-800/80 hover:bg-gray-700 px-8 py-4 rounded-xl font-semibold transition-all hover:scale-105"
              >
                Explore APEX AI
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              {[
                { value: '10x', label: 'Faster Development' },
                { value: '50+', label: 'Languages Supported' },
                { value: '24/7', label: 'AI Assistance' },
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + idx * 0.1 }}
                >
                  <p className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Features Section */}
        <div id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-3xl lg:text-4xl font-bold text-center mb-12"
          >
            Powerful Features for Developers
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Code className="w-8 h-8" />,
                title: 'Code Understanding',
                description: 'Deep analysis of your code with intelligent suggestions and fixes.',
                color: 'text-blue-400',
              },
              {
                icon: <FileCode className="w-8 h-8" />,
                title: 'File Analysis',
                description: 'Upload multiple files and get comprehensive project-level insights.',
                color: 'text-purple-400',
              },
              {
                icon: <ImageIcon className="w-8 h-8" />,
                title: 'Image Recognition',
                description: 'Analyze screenshots, errors, and UI designs with visual AI.',
                color: 'text-green-400',
              },
              {
                icon: <Terminal className="w-8 h-8" />,
                title: 'Built-in Editor',
                description: 'Monaco-powered editor with AI-assisted coding features.',
                color: 'text-yellow-400',
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: 'Instant Responses',
                description: 'Streaming responses with real-time AI interaction.',
                color: 'text-orange-400',
              },
              {
                icon: <Workflow className="w-8 h-8" />,
                title: 'Multi-Language',
                description: 'Support for Lua, Luau, JavaScript, TypeScript, and more.',
                color: 'text-pink-400',
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: 'Secure & Private',
                description: 'Enterprise-grade security with end-to-end encryption.',
                color: 'text-red-400',
              },
              {
                icon: <Cloud className="w-8 h-8" />,
                title: 'Cloud Storage',
                description: 'Save your projects and conversations securely in the cloud.',
                color: 'text-cyan-400',
              },
              {
                icon: <Smartphone className="w-8 h-8" />,
                title: 'Mobile Ready',
                description: 'Fully responsive design optimized for mobile development.',
                color: 'text-indigo-400',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-900/50 backdrop-blur-lg border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-all hover:scale-105 cursor-pointer"
              >
                <div className={`${feature.color} mb-4`}>{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* How it Works */}
        <div id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-3xl lg:text-4xl font-bold text-center mb-12"
          >
            How APEX AI Works
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: <Bot className="w-6 h-6" />,
                title: 'Describe Your Problem',
                description: 'Share your code, upload files, or paste screenshots of errors.',
              },
              {
                step: '02',
                icon: <Cpu className="w-6 h-6" />,
                title: 'AI Analysis',
                description: 'APEX AI analyzes your context with advanced machine learning.',
              },
              {
                step: '03',
                icon: <Wand2 className="w-6 h-6" />,
                title: 'Get Solutions',
                description: 'Receive optimized code, fixes, and explanations instantly.',
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.2 }}
                className="relative"
              >
                <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                      {item.icon}
                    </div>
                    <span className="text-4xl font-bold text-gray-700">{item.step}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-400">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Ready to accelerate your development?
            </h2>
            <p className="text-lg mb-8 text-white/90">
              Join thousands of developers using APEX AI to build faster.
            </p>
            <Link
              href="/register"
              className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold transition-all hover:scale-105 inline-block"
            >
              Get Started Free
            </Link>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center">
                <span className="font-bold text-sm">A</span>
              </div>
              <span className="font-bold">APEX AI</span>
            </div>
            <p className="text-sm text-gray-500">
              © 2024 APEX AI. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-sm text-gray-400 hover:text-white transition-colors">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
