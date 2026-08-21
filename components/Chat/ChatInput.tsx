// components/Chat/ChatInput.tsx
import React, { useRef, useEffect, useState } from 'react';
import { Send, Paperclip, Image as ImageIcon, Code, X, Loader } from 'lucide-react';
import { Attachment } from '@/types';
import { formatFileSize } from '@/lib/utils';

interface ChatInputProps {
  onSend: (message: string, attachments: Attachment[]) => void;
  onFileUpload: (files: File[]) => void;
  onPasteImage?: (file: File) => void;
  disabled?: boolean;
  streaming?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  onFileUpload,
  onPasteImage,
  disabled = false,
  streaming = false,
}) => {
  const [input, setInput] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  }, [input]);

  const handleSend = () => {
    if ((!input.trim() && attachments.length === 0) || disabled || streaming) return;
    onSend(input, attachments);
    setInput('');
    setAttachments([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;
    onFileUpload(Array.from(files));
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (const item of items) {
      if (item.type.startsWith('image/') && onPasteImage) {
        const file = item.getAsFile();
        if (file) onPasteImage(file);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files) onFileUpload(Array.from(files));
  };

  return (
    <div className="relative">
      {/* Drag overlay */}
      {isDragging && (
        <div className="absolute inset-0 bg-blue-500/20 border-4 border-dashed border-blue-500 rounded-2xl flex items-center justify-center z-10 pointer-events-none">
          <div className="text-center">
            <Paperclip className="w-12 h-12 text-blue-400 mx-auto mb-2" />
            <p className="font-semibold text-blue-400">Drop files here</p>
          </div>
        </div>
      )}

      {/* Attachments preview */}
      {attachments.length > 0 && (
        <div className="mb-2 space-y-2">
          {attachments.map((attachment, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-lg p-2.5 flex items-center gap-3"
            >
              {attachment.fileType.startsWith('image/') ? (
                <img
                  src={attachment.fileUrl}
                  alt={attachment.fileName}
                  className="w-12 h-12 object-cover rounded"
                />
              ) : (
                <File className="w-6 h-6 text-gray-400" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">{attachment.fileName}</p>
                <p className="text-xs text-gray-500">{formatFileSize(attachment.fileSize)}</p>
              </div>
              <button
                onClick={() => setAttachments(prev => prev.filter((_, i) => i !== index))}
                className="p-1 hover:bg-gray-700 rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input area */}
      <div
        className={`flex items-end gap-2 bg-gray-800/50 border rounded-2xl p-2 transition-all ${
          isDragging ? 'border-blue-500' : 'border-gray-700 focus-within:border-blue-500'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Action buttons */}
        <div className="flex gap-1">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files)}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            title="Attach file"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files)}
          />
          <button
            onClick={() => imageInputRef.current?.click()}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            title="Upload image"
          >
            <ImageIcon className="w-5 h-5" />
          </button>

          <button
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            title="Insert code"
          >
            <Code className="w-5 h-5" />
          </button>
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder="Message APEX AI..."
          className="flex-1 bg-transparent resize-none py-2 px-2 focus:outline-none max-h-48"
          rows={1}
          disabled={disabled}
        />

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={(!input.trim() && attachments.length === 0) || disabled || streaming}
          className="p-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
        >
          {streaming ? (
            <Loader className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>

      <p className="text-xs text-gray-500 mt-2 text-center">
        Press Enter to send, Shift + Enter for new line
      </p>
    </div>
  );
};
