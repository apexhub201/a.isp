// types/index.ts
export interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Conversation {
  id: string;
  title: string;
  userId: string;
  pinned: boolean;
  createdAt: Date;
  updatedAt: Date;
  messages: Message[];
}

export interface Message {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  attachments: Attachment[];
  createdAt: Date;
}

export interface Attachment {
  id: string;
  messageId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
  content?: string;
  createdAt: Date;
}

export interface Project {
  id: string;
  name: string;
  userId: string;
  files: ProjectFile[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectFile {
  id: string;
  name: string;
  content: string;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Settings {
  id: string;
  userId: string;
  theme: 'dark' | 'light';
  language: string;
  aiModel: string;
  responseStyle: string;
  contextMemory: boolean;
}

export interface ChatRequest {
  conversationId?: string;
  message: string;
  attachments?: Attachment[];
  projectId?: string;
}

export interface ChatResponse {
  conversationId: string;
  response: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface AIAnalysisResult {
  summary: string;
  issues: AIIssue[];
  suggestions: AISuggestion[];
  improvedCode?: string;
}

export interface AIIssue {
  type: 'error' | 'warning' | 'info';
  line: number;
  message: string;
  severity: 'high' | 'medium' | 'low';
}

export interface AISuggestion {
  type: string;
  description: string;
  code?: string;
}
