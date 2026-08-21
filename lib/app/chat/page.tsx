// app/chat/page.tsx (Main Chat Workspace)
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import Editor from '@monaco-editor/react';
import toast from 'react-hot-toast';
import {
  Plus,
  Send,
  Paperclip,
  Image,
  Code,
  X,
  Menu,
  Settings,
  File,
  Folder,
  Search,
  Pin,
  Trash,
  Copy,
  Download,
  Expand,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  attachments?: Attachment[];
}

interface Attachment {
  fileName: string;
  fileType: string;
  fileSize: number;
  content?: string;
  url?: string;
}

interface Conversation {
  id: string;
  title: string;
  pinned: boolean;
}

export default function ChatWorkspace() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [contextOpen, setContextOpen] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editorContent, setEditorContent] = useState('');
  const [editorLanguage, setEditorLanguage] = useState('lua');
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      handleFiles(acceptedFiles);
    },
    noClick: true,
  });

  const handleFiles = async (files: File[]) => {
    for (const file of files) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const content = e.target?.result as string;
        const attachment: Attachment = {
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          content: file.type.startsWith('text/') ? content : undefined,
          url: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
        };
        setAttachments(prev => [...prev, attachment]);
      };
      reader.readAsText(file);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() && attachments.length === 0) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      attachments: attachments,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setAttachments([]);
    setIsStreaming(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: currentConversation,
          message: input,
          attachments: attachments,
        }),
      });

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
      };

      setMessages(prev => [...prev, assistantMessage]);
      setCurrentConversation(data.conversationId);
    } catch (error) {
      toast.error("APEX AI couldn't complete this request.");
    } finally {
      setIsStreaming(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="h-screen bg-gray-950 text-white flex overflow-hidden">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-900 border-r border-gray-800 flex flex-col"
          >
            <div className="p-4">
              <button
                onClick={() => setCurrentConversation(null)}
                className="w-full bg-blue-600 hover:bg-blue-700 rounded-xl px-4 py-3 flex items-center gap-2 transition-colors"
              >
                <Plus className="w-5 h-5" />
                New Chat
              </button>
            </div>

            <div className="px-4 py-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="w-full bg-gray-800 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-2">
              <div className="text-xs text-gray-500 px-2 py-2">Today</div>
              {conversations.map(conv => (
                <button
                  key={conv.id}
                  onClick={() => setCurrentConversation(conv.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-colors ${
                    currentConversation === conv.id ? 'bg-gray-800' : ''
                  }`}
                >
                  <span className="flex-1 truncate text-sm">{conv.title}</span>
                  {conv.pinned && <Pin className="w-3 h-3 text-gray-500" />}
                </button>
              ))}
            </div>

            <div className="p-4 border-t border-gray-800 space-y-2">
              <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-white transition-colors">
                <Folder className="w-4 h-4" /> Projects
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-white transition-colors">
                <File className="w-4 h-4" /> Files
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-white transition-colors">
                <Settings className="w-4 h-4" /> Settings
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col" {...getRootProps()}>
        <input {...getInputProps()} />
        
        {/* Header */}
        <div className="bg-gray-900/50 backdrop-blur-lg border-b border-gray-800 p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-semibold">APEX AI Chat</h1>
              <p className="text-xs text-gray-500">Your AI Coding Partner</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowEditor(!showEditor)}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Code className="w-5 h-5" />
            </button>
            <button
              onClick={() => setContextOpen(!contextOpen)}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              {contextOpen ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-3xl rounded-2xl p-4 ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-200'
                  }`}
                >
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mb-3 space-y-2">
                      {message.attachments.map((att, idx) => (
                        <div key={idx} className="bg-black/30 rounded-lg p-2 flex items-center gap-2">
                          <File className="w-4 h-4" />
                          <span className="text-sm">{att.fileName}</span>
                          <span className="text-xs text-gray-400">
                            {(att.fileSize / 1024).toFixed(1)} KB
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="prose prose-invert max-w-none">
                    {message.content}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isStreaming && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-gray-800 rounded-2xl p-4 flex items-center gap-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-200" />
                </div>
                <span className="text-sm text-gray-400">APEX AI is thinking...</span>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Attachments Preview */}
        {attachments.length > 0 && (
          <div className="px-4 pb-2 space-y-2">
            {attachments.map((att, idx) => (
              <div
                key={idx}
                className="bg-gray-800 rounded-lg p-3 flex items-center gap-3"
              >
                {att.url ? (
                  <img src={att.url} alt={att.fileName} className="w-12 h-12 object-cover rounded" />
                ) : (
                  <File className="w-8 h-8 text-gray-400" />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium">{att.fileName}</p>
                  <p className="text-xs text-gray-500">
                    {(att.fileSize / 1024).toFixed(1)} KB
                  </p>
                </div>
                <button
                  onClick={() => removeAttachment(idx)}
                  className="p-1 hover:bg-gray-700 rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Drop Zone Indicator */}
        {isDragActive && (
          <div className="absolute inset-0 bg-blue-500/20 border-4 border-dashed border-blue-500 flex items-center justify-center z-10">
            <div className="text-center">
              <File className="w-16 h-16 text-blue-400 mx-auto mb-4" />
              <p className="text-xl font-semibold">Drop files here</p>
            </div>
          </div>
        )}

        {/* Input Composer */}
        <div className="border-t border-gray-800 p-4">
          <div className="flex items-end gap-2">
            <div className="flex gap-2">
              <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                <Paperclip className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                <Image className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowEditor(!showEditor)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <Code className="w-5 h-5" />
              </button>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Type your message..."
              className="flex-1 bg-gray-800 rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={1}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() && attachments.length === 0}
              className="p-3 bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Context Panel */}
      <AnimatePresence>
        {contextOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 300, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-900 border-l border-gray-800 flex flex-col"
          >
            <div className="p-4 border-b border-gray-800">
              <h2 className="font-semibold">Context</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Files</h3>
                <div className="space-y-2">
                  <div className="bg-gray-800 rounded-lg p-2 flex items-center gap-2">
                    <File className="w-4 h-4 text-blue-400" />
                    <span className="text-sm">main.lua</span>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-2 flex items-center gap-2">
                    <File className="w-4 h-4 text-blue-400" />
                    <span className="text-sm">config.lua</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Images</h3>
                <div className="space-y-2">
                  <div className="bg-gray-800 rounded-lg p-2 flex items-center gap-2">
                    <Image className="w-4 h-4 text-green-400" />
                    <span className="text-sm">error.png</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Project</h3>
                <div className="bg-gray-800 rounded-lg p-2">
                  <span className="text-sm">My Roblox Project</span>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-800">
              <button className="w-full bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg py-2 transition-colors">
                Clear Context
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Code Editor Modal */}
      <AnimatePresence>
        {showEditor && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-gray-900 rounded-2xl w-full max-w-4xl h-[80vh] flex flex-col">
              <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h3 className="font-semibold">Code Editor</h3>
                  <select
                    value={editorLanguage}
                    onChange={(e) => setEditorLanguage(e.target.value)}
                    className="bg-gray-800 rounded-lg px-3 py-1 text-sm"
                  >
                    <option value="lua">Lua</option>
                    <option value="javascript">JavaScript</option>
                    <option value="typescript">TypeScript</option>
                    <option value="json">JSON</option>
                    <option value="html">HTML</option>
                    <option value="css">CSS</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                    <Copy className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setShowEditor(false)}
                    className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="flex-1">
                <Editor
                  height="100%"
                  language={editorLanguage}
                  value={editorContent}
                  onChange={(value) => setEditorContent(value || '')}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: true },
                    fontSize: 14,
                    lineNumbers: 'on',
                    roundedSelection: false,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                  }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
