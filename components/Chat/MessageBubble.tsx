// components/Chat/MessageBubble.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { User, Bot, File, Image as ImageIcon, Copy, Check, Download } from 'lucide-react';
import { Message, Attachment } from '@/types';
import { formatFileSize, formatTime } from '@/lib/utils';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

interface MessageBubbleProps {
  message: Message;
  onCopy?: (content: string) => void;
  onDownload?: (attachment: Attachment) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  onCopy,
  onDownload,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onCopy?.(message.content);
  };

  return (
    <motion.div
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

        {/* Content */}
        <div className={`rounded-2xl p-4 ${
          message.role === 'user'
            ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white'
            : 'bg-gray-800/80 backdrop-blur border border-gray-700'
        }`}>
          {/* Attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mb-3 space-y-2">
              {message.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="bg-black/20 rounded-lg p-2.5 flex items-center gap-3"
                >
                  {attachment.fileType.startsWith('image/') ? (
                    <img
                      src={attachment.fileUrl}
                      alt={attachment.fileName}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  ) : (
                    <File className="w-8 h-8 text-gray-300 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{attachment.fileName}</p>
                    <p className="text-xs opacity-70">{formatFileSize(attachment.fileSize)}</p>
                  </div>
                  {onDownload && (
                    <button
                      onClick={() => onDownload(attachment)}
                      className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Message Content */}
          <div className="prose prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  return (
                    <code
                      className={`${className} ${inline ? 'bg-black/20 rounded px-1' : 'block bg-black/30 rounded-lg p-3 overflow-x-auto'}`}
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>

          {/* Footer */}
          <div className={`flex items-center gap-2 mt-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <span className={`text-xs ${message.role === 'user' ? 'text-white/60' : 'text-gray-500'}`}>
              {formatTime(message.createdAt)}
            </span>
            {message.role === 'assistant' && (
              <button
                onClick={handleCopy}
                className={`p-1 rounded transition-colors ${
                  message.role === 'user'
                    ? 'hover:bg-white/10'
                    : 'hover:bg-gray-700'
                }`}
              >
                {copied ? (
                  <Check className="w-3 h-3 text-green-400" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
