// app/chat/page.tsx - Full Chat Interface with Conversation Management
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import toast, { Toaster } from 'react-hot-toast';
import {
  Plus,
  Send,
  Paperclip,
  Image as ImageIcon,
  Code,
  X,
  Menu,
  Settings,
  File,
  Folder,
  Search,
  Pin,
  Trash2,
  Copy,
  Download,
  Expand,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Check,
  MoreVertical,
  Clock,
  MessageSquare,
  Loader,
  User,
  Bot,
  Zap,
  FileCode,
  ImagePlus,
  Sparkles,
  History,
  Star,
  Archive,
  AlertCircle,
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  attachments?: Attachment[];
  timestamp: Date;
}

interface Attachment {
  id: string;
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
  createdAt: Date;
  updatedAt: Date;
  messages: Message[];
}

export default function ChatWorkspace() {
  // State management
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [contextOpen, setContextOpen] = useState(true);
  const [isStreaming, setIsStreaming] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingConversationId, setEditingConversationId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Load conversations from API
  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      setIsLoadingConversations(true);
      const response = await fetch('/api/conversations');
      const data = await response.json();
      setConversations(data.conversations);
      
      // If there's a conversation, load the first one
      if (data.conversations.length > 0 && !currentConversationId) {
        loadConversation(data.conversations[0].id);
      }
    } catch (error) {
      toast.error('Failed to load conversations');
    } finally {
      setIsLoadingConversations(false);
    }
  };

  const loadConversation = async (conversationId: string) => {
    try {
      const response = await fetch(`/api/conversations/${conversationId}`);
      const data = await response.json();
      setCurrentConversationId(conversationId);
      setMessages(data.messages);
    } catch (error) {
      toast.error('Failed to load conversation');
    }
  };

  // Create new conversation
  const createNewConversation = () => {
    const newConversation: Conversation = {
      id: `temp-${Date.now()}`,
      title: 'New Conversation',
      pinned: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: [],
    };
    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversationId(newConversation.id);
    setMessages([]);
    setAttachments([]);
    setInput('');
  };

  // Delete conversation
  const deleteConversation = async (conversationId: string) => {
    try {
      await fetch(`/api/conversations/${conversationId}`, {
        method: 'DELETE',
      });
      
      setConversations(prev => prev.filter(c => c.id !== conversationId));
      
      if (currentConversationId === conversationId) {
        setCurrentConversationId(null);
        setMessages([]);
      }
      
      toast.success('Conversation deleted');
    } catch (error) {
      toast.error('Failed to delete conversation');
    }
  };

  // Rename conversation
  const renameConversation = async (conversationId: string, newTitle: string) => {
    try {
      await fetch(`/api/conversations/${conversationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle }),
      });
      
      setConversations(prev =>
        prev.map(c =>
          c.id === conversationId ? { ...c, title: newTitle } : c
        )
      );
      
      setEditingConversationId(null);
      toast.success('Conversation renamed');
    } catch (error) {
      toast.error('Failed to rename conversation');
    }
  };

  // Toggle pin
  const togglePin = async (conversationId: string) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (!conversation) return;

    try {
      await fetch(`/api/conversations/${conversationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pinned: !conversation.pinned }),
      });
      
      setConversations(prev =>
        prev.map(c =>
          c.id === conversationId ? { ...c, pinned: !c.pinned } : c
        )
      );
    } catch (error) {
      toast.error('Failed to update conversation');
    }
  };

  // Send message
  const sendMessage = async () => {
    if (!input.trim() && attachments.length === 0) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input,
      attachments: attachments,
      timestamp: new Date(),
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
          conversationId: currentConversationId,
          message: input,
          attachments: attachments,
        }),
      });

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Update conversation title if it's "New Conversation"
      if (currentConversationId) {
        const conversation = conversations.find(c => c.id === currentConversationId);
        if (conversation && conversation.title === 'New Conversation') {
          const newTitle = input.slice(0, 50);
          renameConversation(currentConversationId, newTitle);
        }
      }
    } catch (error) {
      toast.error("APEX AI couldn't complete this request.");
    } finally {
      setIsStreaming(false);
    }
  };

  // Filter conversations based on search
  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group conversations by date
  const groupConversationsByDate = (conversations: Conversation[]) => {
    const groups: { [key: string]: Conversation[] } = {
      'Today': [],
      'Yesterday': [],
      'Previous 7 Days': [],
      'Older': [],
    };

    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    conversations.forEach(conv => {
      const convDate = new Date(conv.updatedAt);
      if (convDate.toDateString() === now.toDateString()) {
        groups['Today'].push(conv);
      } else if (convDate.toDateString() === yesterday.toDateString()) {
        groups['Yesterday'].push(conv);
      } else if (convDate > weekAgo) {
        groups['Previous 7 Days'].push(conv);
      } else {
        groups['Older'].push(conv);
      }
    });

    return groups;
  };

  const groupedConversations = groupConversationsByDate(filteredConversations);

  // Handle file uploads
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
          id: `att-${Date.now()}`,
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

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Format timestamp
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white flex overflow-hidden">
      <Toaster position="top-right" />
      
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-900/80 backdrop-blur-xl border-r border-gray-800 flex flex-col"
          >
            {/* Sidebar Header */}
            <div className="p-4 border-b border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    APEX AI
                  </span>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <button
                onClick={createNewConversation}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl px-4 py-3 flex items-center gap-2 transition-all hover:scale-105 shadow-lg"
              >
                <Plus className="w-5 h-5" />
                <span className="font-medium">New Chat</span>
              </button>
            </div>

            {/* Search Bar */}
            <div className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto scrollbar-thin">
              {isLoadingConversations ? (
                <div className="flex items-center justify-center py-8">
                  <Loader className="w-6 h-6 animate-spin text-blue-500" />
                </div>
              ) : (
                Object.entries(groupedConversations).map(([group, convs]) => (
                  convs.length > 0 && (
                    <div key={group} className="mb-4">
                      <div className="px-4 py-2">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          {group}
                        </span>
                      </div>
                      {convs.map(conv => (
                        <div
                          key={conv.id}
                          className={`group relative mx-2 mb-1 rounded-lg transition-all ${
                            currentConversationId === conv.id
                              ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30'
                              : 'hover:bg-gray-800/50 border border-transparent'
                          }`}
                        >
                          {editingConversationId === conv.id ? (
                            <div className="flex items-center gap-2 p-2">
                              <input
                                type="text"
                                value={editingTitle}
                                onChange={(e) => setEditingTitle(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    renameConversation(conv.id, editingTitle);
                                  }
                                  if (e.key === 'Escape') {
                                    setEditingConversationId(null);
                                  }
                                }}
                                className="flex-1 bg-gray-700 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                autoFocus
                              />
                              <button
                                onClick={() => renameConversation(conv.id, editingTitle)}
                                className="p-1 hover:bg-gray-600 rounded transition-colors"
                              >
                                <Check className="w-4 h-4 text-green-400" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => loadConversation(conv.id)}
                              className="w-full text-left p-3 flex items-center gap-3"
                            >
                              {conv.pinned && (
                                <Pin className="w-3 h-3 text-blue-400 flex-shrink-0" />
                              )}
                              <MessageSquare className="w-4 h-4 text-gray-500 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">
                                  {conv.title}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {formatTime(conv.updatedAt)}
                                </p>
                              </div>
                            </button>
                          )}

                          {/* Dropdown Menu */}
                          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowDropdown(showDropdown === conv.id ? null : conv.id);
                              }}
                              className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                            
                            {showDropdown === conv.id && (
                              <div className="absolute right-0 top-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 min-w-[160px]">
                                <button
                                  onClick={() => {
                                    setEditingConversationId(conv.id);
                                    setEditingTitle(conv.title);
                                    setShowDropdown(null);
                                  }}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-700 transition-colors"
                                >
                                  <Edit3 className="w-4 h-4" /> Rename
                                </button>
                                <button
                                  onClick={() => {
                                    togglePin(conv.id);
                                    setShowDropdown(null);
                                  }}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-700 transition-colors"
                                >
                                  <Pin className="w-4 h-4" /> {conv.pinned ? 'Unpin' : 'Pin'}
                                </button>
                                <button
                                  onClick={() => {
                                    deleteConversation(conv.id);
                                    setShowDropdown(null);
                                  }}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" /> Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                ))
              )}
              
              {!isLoadingConversations && filteredConversations.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Search className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">No conversations found</p>
                </div>
              )}
            </div>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-gray-800 space-y-2">
              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                <Folder className="w-4 h-4" /> Projects
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                <File className="w-4 h-4" /> Files
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                <Settings className="w-4 h-4" /> Settings
              </button>
              <div className="flex items-center gap-3 px-3 py-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">User</p>
                  <p className="text-xs text-gray-500">Free Plan</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col" {...getRootProps()}>
        <input {...getInputProps()} />
        
        {/* Chat Header */}
        <div className="bg-gray-900/80 backdrop-blur-xl border-b border-gray-800 p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-semibold">
                {conversations.find(c => c.id === currentConversationId)?.title || 'New Chat'}
              </h1>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <Bot className="w-3 h-3" /> APEX AI Assistant
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
              <History className="w-5 h-5" />
            </button>
            <button
              onClick={() => setContextOpen(!contextOpen)}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              {contextOpen ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto scrollbar-thin px-4 py-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.length === 0 && !isStreaming && (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Start a conversation</h2>
                <p className="text-gray-400">
                  Ask me anything about coding, upload files, or share screenshots
                </p>
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
                  {[
                    { icon: <Code className="w-5 h-5" />, text: 'Write code' },
                    { icon: <FileCode className="w-5 h-5" />, text: 'Analyze files' },
                    { icon: <ImagePlus className="w-5 h-5" />, text: 'Share images' },
                  ].map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => setInput(item.text + ' ')}
                      className="bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-xl p-4 flex flex-col items-center gap-2 transition-all hover:scale-105"
                    >
                      {item.icon}
                      <span className="text-sm">{item.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start gap-3 max-w-3xl ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      message.role === 'user'
                        ? 'bg-gradient-to-br from-blue-500 to-purple-600'
                        : 'bg-gray-700'
                    }`}>
                      {message.role === 'user' ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <Bot className="w-4 h-4" />
                      )}
                    </div>

                    {/* Message Content */}
                    <div className={`rounded-2xl p-4 ${
                      message.role === 'user'
                        ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white'
                        : 'bg-gray-800/80 backdrop-blur border border-gray-700'
                    }`}>
                      {/* Attachments */}
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="mb-3 space-y-2">
                          {message.attachments.map((att) => (
                            <div
                              key={att.id}
                              className="bg-black/20 rounded-lg p-2 flex items-center gap-2"
                            >
                              {att.url ? (
                                <img
                                  src={att.url}
                                  alt={att.fileName}
                                  className="w-16 h-16 object-cover rounded"
                                />
                              ) : (
                                <File className="w-6 h-6 text-gray-300" />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{att.fileName}</p>
                                <p className="text-xs opacity-70">
                                  {(att.fileSize / 1024).toFixed(1)} KB
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Message Text */}
                      <div className="prose prose-invert max-w-none">
                        {message.content}
                      </div>

                      {/* Timestamp */}
                      <p className={`text-xs mt-2 ${message.role === 'user' ? 'text-white/60' : 'text-gray-500'}`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Streaming Indicator */}
            {isStreaming && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-start gap-3"
              >
                <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-gray-800/80 border border-gray-700 rounded-2xl p-4">
                  <div className="flex items-center gap-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-200" />
                    </div>
                    <span className="text-sm text-gray-400">APEX AI is thinking...</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </div>

        {/* Attachments Preview */}
        {attachments.length > 0 && (
          <div className="px-4 pb-2">
            <div className="max-w-4xl mx-auto space-y-2">
              {attachments.map((att) => (
                <motion.div
                  key={att.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gray-800/80 backdrop-blur border border-gray-700 rounded-lg p-3 flex items-center gap-3"
                >
                  {att.url ? (
                    <img
                      src={att.url}
                      alt={att.fileName}
                      className="w-16 h-16 object-cover rounded"
                    />
                  ) : (
                    <File className="w-8 h-8 text-gray-400" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{att.fileName}</p>
                    <p className="text-xs text-gray-500">
                      {(att.fileSize / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <button
                    onClick={() => removeAttachment(att.id)}
                    className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Drop Zone Overlay */}
        {isDragActive && (
          <div className="absolute inset-0 bg-blue-500/20 border-4 border-dashed border-blue-500 flex items-center justify-center z-10 pointer-events-none">
            <div className="text-center">
              <File className="w-16 h-16 text-blue-400 mx-auto mb-4" />
              <p className="text-2xl font-bold">Drop files here</p>
              <p className="text-gray-300 mt-2">Upload code, images, or documents</p>
            </div>
          </div>
        )}

        {/* Input Composer */}
        <div className="border-t border-gray-800 bg-gray-900/80 backdrop-blur-xl p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end gap-2 bg-gray-800/50 border border-gray-700 rounded-2xl p-2 focus-within:border-blue-500 transition-colors">
              {/* Action Buttons */}
              <div className="flex gap-1">
                <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors group relative">
                  <Paperclip className="w-5 h-5" />
                  <span className="absolute bottom-full left-0 mb-2 px-2 py-1 bg-gray-700 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Attach file
                  </span>
                </button>
                <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors group relative">
                  <ImageIcon className="w-5 h-5" />
                  <span className="absolute bottom-full left-0 mb-2 px-2 py-1 bg-gray-700 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Upload image
                  </span>
                </button>
                <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors group relative">
                  <Code className="w-5 h-5" />
                  <span className="absolute bottom-full left-0 mb-2 px-2 py-1 bg-gray-700 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Insert code
                  </span>
                </button>
              </div>

              {/* Text Input */}
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Message APEX AI..."
                className="flex-1 bg-transparent resize-none py-2 px-2 focus:outline-none max-h-32"
                rows={1}
                style={{
                  height: 'auto',
                  minHeight: '40px',
                }}
              />

              {/* Send Button */}
              <button
                onClick={sendMessage}
                disabled={!input.trim() && attachments.length === 0}
                className="p-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Press Enter to send, Shift + Enter for new line
            </p>
          </div>
        </div>
      </div>

      {/* Context Panel */}
      <AnimatePresence>
        {contextOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-900/80 backdrop-blur-xl border-l border-gray-800 flex flex-col"
          >
            <div className="p-4 border-b border-gray-800">
              <h2 className="font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                Context
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-6">
              {/* Files Context */}
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Files</h3>
                <div className="space-y-2">
                  <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-2.5 flex items-center gap-2 hover:border-gray-600 transition-colors">
                    <FileCode className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    <span className="text-sm truncate">main.lua</span>
                    <button className="ml-auto p-1 hover:bg-gray-700 rounded transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-2.5 flex items-center gap-2 hover:border-gray-600 transition-colors">
                    <FileCode className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    <span className="text-sm truncate">config.lua</span>
                    <button className="ml-auto p-1 hover:bg-gray-700 rounded transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Images Context */}
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Images</h3>
                <div className="space-y-2">
                  <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-2.5 flex items-center gap-2 hover:border-gray-600 transition-colors">
                    <ImageIcon className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span className="text-sm truncate">error.png</span>
                    <button className="ml-auto p-1 hover:bg-gray-700 rounded transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Project Context */}
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Project</h3>
                <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3">
                  <p className="text-sm font-medium">My Roblox Project</p>
                  <p className="text-xs text-gray-500 mt-1">4 files, 2 images</p>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-800">
              <button className="w-full bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg py-2.5 transition-colors flex items-center justify-center gap-2">
                <Trash2 className="w-4 h-4" />
                Clear Context
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
