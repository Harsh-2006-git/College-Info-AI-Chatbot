import React, { useState, useEffect } from 'react';
import { 
  X, Copy, Check, Search, FileText, Send, Sparkles, 
  Layers, Database, ShieldCheck, Loader2 
} from 'lucide-react';
import { knowledgeBaseAPI } from '../services/api';

export default function DomainViewerModal({ 
  domain, 
  isOpen, 
  onClose, 
  onAskInChat,
  theme = 'light' 
}) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState(false);
  const [customQuestion, setCustomQuestion] = useState('');
  
  const isLight = theme === 'light';

  useEffect(() => {
    if (!isOpen || !domain) {
      setContent('');
      setError('');
      setSearchTerm('');
      setCopied(false);
      setCustomQuestion('');
      return;
    }

    setCustomQuestion(domain.query || `Tell me about ${domain.title}`);

    async function fetchContent() {
      setLoading(true);
      setError('');
      try {
        const data = await knowledgeBaseAPI.getDomainContent(domain.id);
        setContent(data.content || '');
      } catch (err) {
        console.error('Failed to load domain content:', err);
        setError(err.response?.data?.detail || 'Failed to load domain raw content.');
      } finally {
        setLoading(false);
      }
    }

    fetchContent();
  }, [isOpen, domain]);

  if (!isOpen || !domain) return null;

  const handleCopy = () => {
    if (!content) return;
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSend = () => {
    const q = customQuestion.trim();
    if (!q) return;
    onAskInChat(q);
    onClose();
  };

  // Filter lines if search term is entered
  const filteredContent = searchTerm.trim()
    ? content.split('\n').filter(line => line.toLowerCase().includes(searchTerm.toLowerCase())).join('\n')
    : content;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 backdrop-blur-md select-none ${
      isLight ? 'bg-slate-900/40' : 'bg-black/85'
    }`}>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-transparent" 
        onClick={onClose} 
      />

      {/* Modal Container: Fullscreen on mobile, rounded card on tablet/desktop */}
      <div className={`w-full h-[100dvh] sm:h-[90vh] sm:max-h-[90vh] sm:max-w-4xl sm:rounded-2xl rounded-none p-3.5 sm:p-5 shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-200 flex flex-col border-0 sm:border transition-colors ${
        isLight ? 'bg-white sm:border-[#E2E8F0] text-[#0F172A]' : 'bg-[#0D0D11] sm:border-[#27272A] text-white'
      }`}>
        
        {/* Header (Compact & Mobile-Optimized) */}
        <div className={`flex items-center justify-between pb-2.5 sm:pb-3 border-b shrink-0 gap-2 ${
          isLight ? 'border-[#E2E8F0]' : 'border-[#1F1F24]'
        }`}>
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className={`p-2 sm:p-2.5 rounded-xl shrink-0 ${
              isLight ? 'bg-[#EFF6FF] text-[#1557D6]' : 'bg-[#181824] text-[#60A5FA]'
            }`}>
              <Database className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="text-sm sm:text-base font-extrabold tracking-tight truncate">
                  {domain.title}
                </h3>
                <span className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 whitespace-nowrap">
                  Ground Truth
                </span>
              </div>
              <p className={`text-[10px] sm:text-[11px] truncate mt-0.5 ${isLight ? 'text-[#64748B]' : 'text-zinc-400'}`}>
                Domain {domain.id} • Exact vectorstore text
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Copy Button */}
            <button
              onClick={handleCopy}
              disabled={!content || loading}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                copied 
                  ? 'bg-emerald-500/15 text-emerald-600 border-emerald-400' 
                  : isLight ? 'bg-[#F8FAFC] border-[#CBD5E1] text-[#334155] hover:bg-[#F1F5F9]' : 'bg-[#18181F] border-[#27272A] text-zinc-300 hover:text-white hover:bg-[#202028]'
              }`}
              title="Copy all raw text"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
                isLight ? 'text-[#64748B] hover:bg-[#F1F5F9]' : 'text-zinc-400 hover:bg-[#18181D] hover:text-white'
              }`}
              title="Close Viewer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Informational Sub-header & Search bar */}
        <div className={`py-2 px-2.5 sm:px-3 my-2 rounded-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 text-xs shrink-0 ${
          isLight ? 'bg-[#F1F5F9] text-[#475569]' : 'bg-[#14141A] text-zinc-400'
        }`}>
          <div className="flex items-center gap-1.5 text-[10.5px] sm:text-[11px] leading-tight">
            <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#1557D6] shrink-0" />
            <span>
              <strong>Zero LLM tokens used</strong> while inspecting raw text.
            </span>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <Search className={`w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 ${
              isLight ? 'text-[#64748B]' : 'text-zinc-500'
            }`} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search in text..."
              className={`w-full pl-8 pr-7 py-1 rounded-lg text-xs outline-none border transition-all ${
                isLight 
                  ? 'bg-white border-[#CBD5E1] text-[#0F172A] focus:border-[#1557D6]' 
                  : 'bg-[#1E1E26] border-[#2A2A35] text-zinc-200 focus:border-[#1557D6]'
              }`}
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')} 
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-700 dark:hover:text-white p-0.5"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Content Box (Scrollable Raw Text Preview) */}
        <div className={`flex-1 overflow-y-auto p-3 sm:p-4 rounded-xl border text-xs leading-relaxed select-text custom-scrollbar break-words ${
          isLight 
            ? 'bg-[#F8FAFC] border-[#CBD5E1] text-[#1E293B]' 
            : 'bg-[#09090C] border-[#1F1F24] text-zinc-300'
        }`}>
          {loading && (
            <div className="h-full flex flex-col items-center justify-center gap-2 text-xs sm:text-sm text-[#1557D6] py-12">
              <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
              <span>Loading raw knowledge base content from disk...</span>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
              {error}
            </div>
          )}

          {!loading && !error && filteredContent && (
            <pre className="whitespace-pre-wrap font-sans text-xs sm:text-xs leading-relaxed break-words overflow-x-hidden">
              {filteredContent}
            </pre>
          )}

          {!loading && !error && !filteredContent && (
            <div className="text-center py-12 text-zinc-500 italic text-xs">
              No matching lines found for "{searchTerm}".
            </div>
          )}
        </div>

        {/* Footer: Ask Question into Chat (Mobile-Friendly Flex Row) */}
        <div className={`pt-2.5 sm:pt-3 border-t mt-2 flex items-center gap-2 shrink-0 ${
          isLight ? 'border-[#E2E8F0]' : 'border-[#1F1F24]'
        }`}>
          <div className="flex-1 flex items-center gap-2 min-w-0">
            <input
              type="text"
              value={customQuestion}
              onChange={(e) => setCustomQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend();
              }}
              placeholder="Ask AI about this domain..."
              className={`w-full px-3 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm border outline-none font-medium transition-all truncate ${
                isLight 
                  ? 'bg-[#F8FAFC] border-[#CBD5E1] focus:border-[#1557D6] text-[#0F172A]' 
                  : 'bg-[#141418] border-[#27272A] focus:border-[#1557D6] text-white'
              }`}
            />
          </div>

          <button
            onClick={handleSend}
            disabled={!customQuestion.trim()}
            className="px-3 sm:px-4 py-2 sm:py-2.5 bg-[#1557D6] hover:bg-[#0F46B3] disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-semibold rounded-xl shadow-[0_4px_14px_rgba(21,87,214,0.3)] transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden xs:inline sm:inline">Ask in Chat</span>
            <span className="xs:hidden sm:hidden">Ask</span>
          </button>
        </div>

      </div>
    </div>
  );
}
