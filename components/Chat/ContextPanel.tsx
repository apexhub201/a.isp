// components/Chat/ContextPanel.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { File, Image as ImageIcon, Folder, X, Trash2, Sparkles } from 'lucide-react';
import { formatFileSize } from '@/lib/utils';

interface ContextPanelProps {
  files: Array<{ id: string; name: string; size: number }>;
  images: Array<{ id: string; name: string; url: string }>;
  project?: { id: string; name: string; fileCount: number };
  onRemoveFile: (id: string) => void;
  onRemoveImage: (id: string) => void;
  onClearContext: () => void;
}

export const ContextPanel: React.FC<ContextPanelProps> = ({
  files,
  images,
  project,
  onRemoveFile,
  onRemoveImage,
  onClearContext,
}) => {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-800">
        <h2 className="font-semibold flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-400" />
          Context
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-6">
        {/* Files */}
        <div>
          <h3 className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
            <File className="w-3 h-3" /> Files
          </h3>
          <div className="space-y-2">
            {files.length === 0 ? (
              <p className="text-sm text-gray-600">No files in context</p>
            ) : (
              files.map((file) => (
                <div
                  key={file.id}
                  className="bg-gray-800/50 border border-gray-700 rounded-lg p-2.5 flex items-center gap-2 hover:border-gray-600 transition-colors group"
                >
                  <File className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                  <button
                    onClick={() => onRemoveFile(file.id)}
                    className="p-1 hover:bg-gray-700 rounded transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Images */}
        <div>
          <h3 className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
            <ImageIcon className="w-3 h-3" /> Images
          </h3>
          <div className="space-y-2">
            {images.length === 0 ? (
              <p className="text-sm text-gray-600">No images in context</p>
            ) : (
              images.map((image) => (
                <div
                  key={image.id}
                  className="bg-gray-800/50 border border-gray-700 rounded-lg p-2.5 flex items-center gap-2 hover:border-gray-600 transition-colors group"
                >
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-10 h-10 object-cover rounded flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{image.name}</p>
                  </div>
                  <button
                    onClick={() => onRemoveImage(image.id)}
                    className="p-1 hover:bg-gray-700 rounded transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Project */}
        {project && (
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
              <Folder className="w-3 h-3" /> Project
            </h3>
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3">
              <p className="text-sm font-medium">{project.name}</p>
              <p className="text-xs text-gray-500 mt-1">{project.fileCount} files</p>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-800">
        <button
          onClick={onClearContext}
          className="w-full bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg py-2.5 transition-colors flex items-center justify-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Clear Context
        </button>
      </div>
    </div>
  );
};
