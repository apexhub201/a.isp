// components/Chat/CodeEditor.tsx
import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { X, Copy, Download, Maximize2, Minimize2, Code, Wand2, Bug, Shield, RefreshCw, Zap } from 'lucide-react';

interface CodeEditorProps {
  open: boolean;
  onClose: () => void;
  initialCode?: string;
  language?: string;
  onCodeChange?: (code: string) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  open,
  onClose,
  initialCode = '',
  language = 'lua',
  onCodeChange,
}) => {
  const [code, setCode] = useState(initialCode);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(language);

  if (!open) return null;

  const handleEditorChange = (value: string | undefined) => {
    setCode(value || '');
    onCodeChange?.(value || '');
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code.${currentLanguage}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const aiActions = [
    { icon: <Wand2 className="w-4 h-4" />, label: 'Explain', action: 'explain' },
    { icon: <Bug className="w-4 h-4" />, label: 'Debug', action: 'debug' },
    { icon: <Shield className="w-4 h-4" />, label: 'Security', action: 'security' },
    { icon: <RefreshCw className="w-4 h-4" />, label: 'Refactor', action: 'refactor' },
    { icon: <Zap className="w-4 h-4" />, label: 'Optimize', action: 'optimize' },
  ];

  return (
    <div className={`fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 ${isFullscreen ? 'p-0' : 'p-4'}`}>
      <div className={`bg-gray-900 border border-gray-800 rounded-2xl flex flex-col overflow-hidden ${isFullscreen ? 'w-full h-full' : 'w-full max-w-5xl h-[85vh]'}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Code className="w-5 h-5 text-blue-400" />
              <h3 className="font-semibold">Code Editor</h3>
            </div>
            <select
              value={currentLanguage}
              onChange={(e) => setCurrentLanguage(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="lua">Lua</option>
              <option value="luau">Luau</option>
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="json">JSON</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="python">Python</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            {/* AI Actions */}
            <div className="flex items-center gap-1 mr-2">
              {aiActions.map((action, index) => (
                <button
                  key={index}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors group relative"
                  title={action.label}
                >
                  {action.icon}
                  <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {action.label}
                  </span>
                </button>
              ))}
            </div>

            <button
              onClick={handleCopy}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              title="Copy code"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              title="Download"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              title="Toggle fullscreen"
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 min-h-0">
          <Editor
            height="100%"
            language={currentLanguage}
            value={code}
            onChange={handleEditorChange}
            theme="vs-dark"
            options={{
              minimap: { enabled: true },
              fontSize: 14,
              lineNumbers: 'on',
              roundedSelection: false,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              wordWrap: 'on',
              formatOnPaste: true,
              formatOnType: true,
              suggest: {
                showKeywords: true,
                showSnippets: true,
              },
            }}
          />
        </div>

        {/* Status Bar */}
        <div className="px-4 py-2 border-t border-gray-800 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span>{currentLanguage.toUpperCase()}</span>
            <span>{code.split('\n').length} lines</span>
            <span>{code.length} characters</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span>Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
};
