// app/settings/page.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Palette,
  Globe,
  Cpu,
  MessageSquare,
  Shield,
  Database,
  Bell,
  Key,
  Trash2,
  Save,
  Check,
} from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [saved, setSaved] = useState(false);

  const tabs = [
    { id: 'general', label: 'General', icon: <User className="w-4 h-4" /> },
    { id: 'appearance', label: 'Appearance', icon: <Palette className="w-4 h-4" /> },
    { id: 'language', label: 'Language', icon: <Globe className="w-4 h-4" /> },
    { id: 'ai', label: 'AI Settings', icon: <Cpu className="w-4 h-4" /> },
    { id: 'privacy', label: 'Privacy', icon: <Shield className="w-4 h-4" /> },
    { id: 'data', label: 'Data', icon: <Database className="w-4 h-4" /> },
  ];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="md:w-64 space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600/20 border border-blue-500/30 text-blue-400'
                    : 'hover:bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                {tab.icon}
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-2xl p-6"
            >
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">General Settings</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Display Name</label>
                      <input
                        type="text"
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <input
                        type="email"
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'appearance' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">Appearance</h2>
                  <div>
                    <label className="block text-sm font-medium mb-2">Theme</label>
                    <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2">
                      <option value="dark">Dark</option>
                      <option value="light">Light</option>
                      <option value="system">System</option>
                    </select>
                  </div>
                </div>
              )}

              {activeTab === 'ai' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">AI Settings</h2>
                  <div>
                    <label className="block text-sm font-medium mb-2">AI Model</label>
                    <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2">
                      <option value="gpt-4">GPT-4</option>
                      <option value="gpt-4-vision">GPT-4 Vision</option>
                      <option value="custom">Custom Model</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Response Style</label>
                    <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2">
                      <option value="detailed">Detailed</option>
                      <option value="concise">Concise</option>
                      <option value="balanced">Balanced</option>
                    </select>
                  </div>
                </div>
              )}

              {activeTab === 'privacy' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">Privacy</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Context Memory</p>
                        <p className="text-sm text-gray-500">Remember conversation context</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleSave}
                  className="bg-blue-600 hover:bg-blue-700 px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors"
                >
                  {saved ? (
                    <>
                      <Check className="w-4 h-4" />
                      Saved!
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
