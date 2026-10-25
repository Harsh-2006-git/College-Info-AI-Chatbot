import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  Copy, 
  Check, 
  User, 
  Bot, 
  BarChart3, 
  ChevronDown, 
  ChevronUp, 
  Cpu, 
  Layers, 
  Compass, 
  Brain, 
  Code2, 
  Search, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  ExternalLink, 
  FileText 
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { formatRelativeTime } from '../utils/helpers';
import SourceCard from './SourceCard';
import { speakText } from '../utils/speech';
import { cleanMessageContent } from '../hooks/useChat';

export default function MessageBubble({ message, theme = 'light', onSendMessage }) {
  const isUser = message.role === 'user';
  const isError = message.role === 'error';
  const isLight = theme === 'light';
  const [copied, setCopied] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  // Ensure content is cleaned of any leaked JSON envelopes or unescaped characters
  const displayContent = useMemo(() => {
    return cleanMessageContent(message.content);
  }, [message.content]);

  const handleCopy = () => {
    navigator.clipboard.writeText(displayContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      speakText(
        displayContent,
        () => setIsSpeaking(false),
        () => setIsSpeaking(false)
      );
      setIsSpeaking(true);
    }
  };

  // Custom rich markdown renderers
  const markdownComponents = useMemo(() => ({
    // Responsive, beautifully styled tables with scrollbar and distinct row banding
    table: ({ node, ...props }) => (
      <div className={`my-4 overflow-x-auto rounded-xl border shadow-xs ${
        isLight ? 'border-slate-200 bg-white' : 'border-[#27272A] bg-[#121217]'
      }`}>
        <table className="w-full text-left border-collapse text-xs sm:text-sm min-w-full" {...props} />
      </div>
    ),
    thead: ({ node, ...props }) => (
      <thead className={`font-bold border-b ${
        isLight ? 'bg-slate-100 text-slate-900 border-slate-200' : 'bg-[#181822] text-zinc-100 border-[#27272A]'
      }`} {...props} />
    ),
    th: ({ node, ...props }) => (
      <th className={`px-3.5 py-2.5 font-bold uppercase tracking-wider text-[11px] sm:text-xs whitespace-nowrap ${
        isLight ? 'text-slate-900' : 'text-zinc-100'
      }`} {...props} />
    ),
    tbody: ({ node, ...props }) => (
      <tbody className={`divide-y ${
        isLight ? 'divide-slate-100' : 'divide-[#1F1F26]'
      }`} {...props} />
    ),
    tr: ({ node, ...props }) => (
      <tr className={`transition-colors ${
        isLight ? 'hover:bg-blue-50/50 even:bg-slate-50/70' : 'hover:bg-blue-950/20 even:bg-[#16161D]'
      }`} {...props} />
    ),
    td: ({ node, ...props }) => (
      <td className={`px-3.5 py-2.5 align-top leading-relaxed ${
        isLight ? 'text-slate-800' : 'text-zinc-200'
      }`} {...props} />
    ),
    // Distinct Headings
    h1: ({ node, ...props }) => (
      <h1 className={`text-xl sm:text-2xl font-black mt-6 mb-3 pb-1.5 border-b ${
        isLight ? 'text-slate-900 border-slate-200' : 'text-white border-[#27272A]'
      }`} {...props} />
    ),
    h2: ({ node, ...props }) => (
      <h2 className={`text-lg sm:text-xl font-extrabold mt-5 mb-2.5 pb-1 border-b ${
        isLight ? 'text-slate-900 border-slate-200' : 'text-white border-[#27272A]'
      }`} {...props} />
    ),
    h3: ({ node, ...props }) => (
      <h3 className={`text-base sm:text-lg font-bold mt-5 mb-2 pb-1 border-b ${
        isLight ? 'text-slate-900 border-slate-200' : 'text-white border-[#27272A]'
      }`} {...props} />
    ),
    h4: ({ node, ...props }) => (
      <h4 className={`text-sm sm:text-base font-bold mt-4 mb-2 ${
        isLight ? 'text-slate-900' : 'text-white'
      }`} {...props} />
    ),
    p: ({ node, ...props }) => (
      <p className={`mb-3.5 leading-relaxed ${
        isLight ? 'text-slate-800' : 'text-zinc-200'
      }`} {...props} />
    ),
    strong: ({ node, ...props }) => (
      <strong className={`font-bold ${
        isLight ? 'text-slate-900' : 'text-white'
      }`} {...props} />
    ),
    // Interactive Link / PDF Download Badges
    a: ({ node, href, children, ...props }) => {
      const textContent = String(children || '');
      const isPdf = href?.toLowerCase().endsWith('.pdf') || 
                    textContent.toLowerCase().includes('.pdf') || 
                    textContent.toLowerCase().includes('download');
      
      if (isPdf) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1.5 px-3 py-1 my-1 rounded-lg text-xs font-semibold border transition-all shadow-xs group ${
              isLight
                ? 'bg-blue-50 hover:bg-blue-100 text-[#1557D6] border-blue-200'
                : 'bg-[#152e65] hover:bg-[#1a3a7f] text-[#93C5FD] border-[#294c96]'
            }`}
            {...props}
          >
            <FileText className={`w-3.5 h-3.5 shrink-0 ${isLight ? 'text-[#1557D6]' : 'text-[#93C5FD]'}`} />
            <span className="font-medium underline-offset-2">{children}</span>
            <span className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded ${
              isLight ? 'bg-blue-200/60 text-[#1557D6]' : 'bg-blue-900/60 text-[#93C5FD]'
            }`}>PDF</span>
            <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity ml-0.5" />
          </a>
        );
      }

      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`font-semibold underline underline-offset-2 transition-colors inline-flex items-center gap-0.5 ${
            isLight ? 'text-[#1557D6] hover:text-[#0F3FA0]' : 'text-[#60A5FA] hover:text-[#93C5FD]'
          }`}
          {...props}
        >
          <span>{children}</span>
          <ExternalLink className="w-3 h-3 inline ml-0.5 opacity-70" />
        </a>
      );
    },
    // Lists and bullets
    ul: ({ node, ...props }) => (
      <ul className={`list-disc pl-5 my-2.5 space-y-1.5 ${
        isLight ? 'text-slate-800' : 'text-zinc-200'
      }`} {...props} />
    ),
    ol: ({ node, ...props }) => (
      <ol className={`list-decimal pl-5 my-2.5 space-y-1.5 ${
        isLight ? 'text-slate-800' : 'text-zinc-200'
      }`} {...props} />
    ),
    li: ({ node, ...props }) => (
      <li className={`leading-relaxed pl-0.5 ${
        isLight ? 'text-slate-800' : 'text-zinc-200'
      }`} {...props} />
    ),
    // Dividers
    hr: ({ node, ...props }) => (
      <hr className={`my-5 border ${
        isLight ? 'border-slate-200' : 'border-[#27272A]'
      }`} {...props} />
    ),
    // Code blocks
    code: ({ node, inline, className, children, ...props }) => {
      if (inline) {
        return (
          <code className={`px-1.5 py-0.5 rounded font-mono text-xs font-semibold ${
            isLight ? 'bg-slate-100 text-[#1557D6]' : 'bg-zinc-800 text-[#93C5FD]'
          }`} {...props}>
            {children}
          </code>
        );
      }
      return (
        <div className={`my-3 overflow-x-auto rounded-xl border p-3 text-xs font-mono ${
          isLight ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-[#0F172A] border-[#27272A] text-slate-100'
        }`}>
          <code {...props}>{children}</code>
        </div>
      );
    },
    blockquote: ({ node, ...props }) => (
      <blockquote className={`border-l-4 border-[#1557D6] pl-3.5 my-3 italic py-2 pr-3 rounded-r-lg ${
        isLight ? 'bg-slate-50 text-slate-700' : 'bg-zinc-800/40 text-zinc-300'
      }`} {...props} />
    )
  }), [isLight]);

  return (
    <div className={`py-4 md:py-5 flex w-full transition-colors ${
      isUser 
        ? (isLight ? 'bg-[#F1F5F9]/70 border-y border-[#E2E8F0]' : 'bg-[#131317] border-y border-[#202026]') 
        : (isLight ? 'bg-white border-y border-[#E2E8F0] shadow-xs' : 'bg-[#0B0B0E] border-y border-[#1A1A20] shadow-xs')
    }`}>
      <div className="max-w-4xl w-full mx-auto md:mx-0 md:ml-12 flex px-4 gap-3 md:gap-5">
        
        {/* Avatar Container */}
        <div className="shrink-0 mt-0.5">
          {isUser ? (
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden border-2 border-[#1557D6] shadow-sm flex items-center justify-center bg-[#1557D6]">
              {!avatarError ? (
                <img 
                  src="/assets/student.jpg" 
                  alt="User" 
                  className="w-full h-full object-cover" 
                  onError={() => setAvatarError(true)}
                />
              ) : (
                <User className="w-6 h-6 text-white" />
              )}
            </div>
          ) : (
            <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden border-2 flex items-center justify-center shadow-md ${
              isError 
                ? 'bg-red-600 border-red-500' 
                : 'bg-white border-[#1557D6] shadow-[0_2px_12px_rgba(21,87,214,0.35)]'
            }`}>
              {!isError && !avatarError ? (
                <img 
                  src="/assets/robot.png" 
                  alt="AI Assistant" 
                  className="w-full h-full object-cover p-0.5" 
                  onError={() => setAvatarError(true)}
                />
              ) : (
                <Bot className="w-6 h-6 text-[#1557D6]" />
              )}
            </div>
          )}
        </div>

        {/* Message Body */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <span className={`font-extrabold text-sm ${
                isLight ? 'text-[#0F172A]' : 'text-white'
              }`}>
                {isUser ? 'You' : isError ? 'Error' : 'College InfoBot AI'}
              </span>
              {message.confidence && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${
                  message.confidence >= 0.85
                    ? (isLight ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-emerald-950/40 text-emerald-300 border-emerald-800/60')
                    : (isLight ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-amber-950/40 text-amber-300 border-amber-800/60')
                }`}>
                  {(message.confidence * 100).toFixed(0)}% Match
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs ${isLight ? 'text-[#64748B]' : 'text-zinc-400'}`}>
                {formatRelativeTime(message.timestamp)}
              </span>
              {!isUser && !isError && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSpeak}
                    className={`transition-colors cursor-pointer p-1 rounded-md hover:bg-slate-100 dark:hover:bg-zinc-800 ${
                      isSpeaking ? 'text-emerald-500 hover:text-emerald-600' : (isLight ? 'text-[#64748B] hover:text-[#0F172A]' : 'text-zinc-400 hover:text-white')
                    }`}
                    title={isSpeaking ? "Stop reading" : "Read aloud"}
                  >
                    {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <button 
                    onClick={handleCopy}
                    className={`transition-colors cursor-pointer p-1 rounded-md hover:bg-slate-100 dark:hover:bg-zinc-800 ${
                      isLight ? 'text-[#64748B] hover:text-[#0F172A]' : 'text-zinc-400 hover:text-white'
                    }`}
                    title="Copy message"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Formatted Content with ReactMarkdown */}
          <div className={`prose max-w-none text-sm sm:text-base leading-relaxed ${
            isError ? 'text-rose-500' : (isLight ? 'text-[#0F172A] prose-slate' : 'text-zinc-200 prose-invert')
          }`}>
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
              {displayContent}
            </ReactMarkdown>
          </div>

          {/* Suggested Follow-up Questions */}
          {message.suggestedFollowups && message.suggestedFollowups.length > 0 && (
            <div className={`mt-4 pt-3.5 border-t ${isLight ? 'border-[#E2E8F0]' : 'border-[#222228]'}`}>
              <div className="flex items-center gap-1.5 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span className={`text-[11px] font-bold uppercase tracking-wider ${
                  isLight ? 'text-[#64748B]' : 'text-zinc-400'
                }`}>
                  Suggested Follow-up Questions
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {message.suggestedFollowups.map((followup, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSendMessage && onSendMessage(followup)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all text-left font-medium cursor-pointer flex items-center gap-1.5 ${
                      isLight
                        ? 'bg-white hover:bg-blue-50 text-[#1557D6] border-blue-200 hover:border-blue-400 shadow-xs'
                        : 'bg-[#141418] hover:bg-[#1c1c24] text-[#93C5FD] border-[#27272A] hover:border-blue-500/50 shadow-xs'
                    }`}
                  >
                    <span className="text-blue-500 dark:text-blue-400">💬</span>
                    <span>{followup}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Retrieved Sources */}
          {message.sources && message.sources.length > 0 && (
            <div className={`mt-5 pt-4 border-t ${isLight ? 'border-[#E2E8F0]' : 'border-[#222228]'}`}>
              <div className="flex items-center gap-1.5 mb-2.5">
                <span className={`text-xs font-bold uppercase tracking-wider ${
                  isLight ? 'text-[#1557D6]' : 'text-[#60A5FA]'
                }`}>
                  Sources
                </span>
                <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-semibold ${
                  isLight ? 'bg-[#EFF6FF] text-[#1557D6]' : 'bg-[#1557D6]/20 text-[#93C5FD]'
                }`}>
                  {message.sources.length}
                </span>
              </div>
              <div className="flex gap-2.5 overflow-x-auto pb-2 items-start scrollbar-thin">
                {message.sources.map((source, idx) => (
                  <SourceCard key={`${source.id || source.filename}-${idx}`} source={source} index={idx} theme={theme} />
                ))}
              </div>
            </div>
          )}
          
          {message.processingTime && (
            <div className={`mt-2 text-xs font-medium ${isLight ? 'text-[#64748B]' : 'text-zinc-500'}`}>
              Generated in {(message.processingTime / 1000).toFixed(2)}s
            </div>
          )}

          {/* RAG Analytics Drawer */}
          {message.analytics && (
            <div className={`mt-4 pt-4 border-t ${isLight ? 'border-[#E2E8F0]' : 'border-[#222228]'}`}>
              <button
                onClick={() => setShowAnalytics(!showAnalytics)}
                className={`flex items-center gap-2 text-xs font-bold transition-all uppercase tracking-wider px-3.5 py-2 rounded-xl border cursor-pointer ${
                  isLight 
                    ? 'bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#1E293B] border-[#CBD5E1] shadow-sm' 
                    : 'bg-[#141418] hover:bg-[#1C1C22] text-zinc-200 border-[#27272A] shadow-sm'
                }`}
              >
                <BarChart3 className={`w-3.5 h-3.5 ${isLight ? 'text-[#1557D6]' : 'text-[#60A5FA]'}`} />
                {showAnalytics ? 'Hide RAG Analytics' : 'Show RAG Analytics'}
                {showAnalytics ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />}
              </button>

              {showAnalytics && (
                <div className={`mt-4 p-4 rounded-xl border space-y-4 animate-in fade-in duration-200 ${
                  isLight 
                    ? 'bg-[#F8FAFC] border-[#E2E8F0] shadow-sm' 
                    : 'bg-[#111115] border-[#27272A] shadow-md'
                }`}>
                  {/* Grid of Key Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {/* Model */}
                    <div className={`p-3 rounded-xl border flex flex-col justify-between ${
                      isLight ? 'bg-white border-[#E2E8F0] shadow-xs' : 'bg-[#16161B] border-[#27272A]'
                    }`}>
                      <div className="flex items-center justify-between text-[10px] uppercase font-bold text-[#64748B]">
                        <span>Model</span>
                        <Cpu className="w-3.5 h-3.5 text-[#1557D6]" />
                      </div>
                      <span className={`text-sm font-bold mt-1 truncate ${isLight ? 'text-[#0F172A]' : 'text-white'}`} title={message.analytics.model}>
                        {message.analytics.model}
                      </span>
                    </div>

                    {/* Retrieval Strategy */}
                    <div className={`p-3 rounded-xl border flex flex-col justify-between ${
                      isLight ? 'bg-white border-[#E2E8F0] shadow-xs' : 'bg-[#16161B] border-[#27272A]'
                    }`}>
                      <div className="flex items-center justify-between text-[10px] uppercase font-bold text-[#64748B]">
                        <span>Strategy</span>
                        <Layers className="w-3.5 h-3.5 text-indigo-500" />
                      </div>
                      <span className={`text-sm font-bold mt-1 capitalize ${isLight ? 'text-[#0F172A]' : 'text-white'}`}>
                        {message.analytics.retrieval_mode?.replace('_', ' ') || 'Simple'}
                      </span>
                    </div>

                    {/* Avg Similarity / Distance */}
                    <div className={`p-3 rounded-xl border flex flex-col justify-between ${
                      isLight ? 'bg-white border-[#E2E8F0] shadow-xs' : 'bg-[#16161B] border-[#27272A]'
                    }`}>
                      <div className="flex items-center justify-between text-[10px] uppercase font-bold text-[#64748B]">
                        <span>Similarity</span>
                        <Compass className="w-3.5 h-3.5 text-emerald-500" />
                      </div>
                      <div className="mt-1 flex flex-col">
                        <span className="text-sm font-bold text-emerald-600">
                          {(message.analytics.avg_similarity * 100).toFixed(1)}%
                        </span>
                        <span className={`text-[9px] italic mt-0.5 ${isLight ? 'text-[#94A3B8]' : 'text-zinc-500'}`}>
                          {message.analytics.distance_metric} distance
                        </span>
                      </div>
                    </div>

                    {/* Precision & Accuracy */}
                    <div className={`p-3 rounded-xl border flex flex-col justify-between ${
                      isLight ? 'bg-white border-[#E2E8F0] shadow-xs' : 'bg-[#16161B] border-[#27272A]'
                    }`}>
                      <div className="flex items-center justify-between text-[10px] uppercase font-bold text-[#64748B]">
                        <span>Precision / Acc</span>
                        <Brain className="w-3.5 h-3.5 text-pink-500" />
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <div className="flex flex-col">
                          <span className={`text-[10px] ${isLight ? 'text-[#64748B]' : 'text-zinc-400'}`}>Precision</span>
                          <span className={`text-xs font-bold ${isLight ? 'text-[#0F172A]' : 'text-white'}`}>
                            {(message.analytics.precision * 100).toFixed(0)}%
                          </span>
                        </div>
                        <div className={`h-6 w-[1px] ${isLight ? 'bg-[#CBD5E1]' : 'bg-[#27272A]'}`} />
                        <div className="flex flex-col">
                          <span className={`text-[10px] ${isLight ? 'text-[#64748B]' : 'text-zinc-400'}`}>Accuracy</span>
                          <span className={`text-xs font-bold ${isLight ? 'text-[#0F172A]' : 'text-white'}`}>
                            {(message.analytics.accuracy * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Executed Queries */}
                  {message.analytics.retrieved_queries && message.analytics.retrieved_queries.length > 0 && (
                    <div className="space-y-1.5">
                      <h4 className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                        isLight ? 'text-[#475569]' : 'text-zinc-300'
                      }`}>
                        <Search className="w-3.5 h-3.5" /> DB Search Queries
                      </h4>
                      <div className="flex flex-col gap-1.5">
                        {message.analytics.retrieved_queries.map((query, idx) => (
                          <div
                            key={idx}
                            className={`text-xs font-mono px-3 py-2 rounded-lg border flex items-start gap-2 ${
                              isLight 
                                ? 'bg-white border-[#E2E8F0] text-[#0F172A]' 
                                : 'bg-[#16161B] border-[#27272A] text-zinc-200'
                            }`}
                          >
                            <span className={`shrink-0 font-bold ${isLight ? 'text-[#1557D6]' : 'text-[#60A5FA]'}`}>
                              Q{idx + 1}:
                            </span>
                            <span className="break-all">{query}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sanitized System Prompt Template */}
                  {message.analytics.prompt_template && (
                    <div className="space-y-1.5">
                      <h4 className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                        isLight ? 'text-[#475569]' : 'text-zinc-300'
                      }`}>
                        <Code2 className="w-3.5 h-3.5" /> System Prompt Template
                      </h4>
                      <pre className={`text-xs font-mono p-3 rounded-xl border max-h-48 overflow-y-auto whitespace-pre-wrap select-text leading-relaxed ${
                        isLight 
                          ? 'bg-white border-[#E2E8F0] text-[#334155]' 
                          : 'bg-[#0A0A0D] border-[#27272A] text-zinc-300'
                      }`}>
                        {message.analytics.prompt_template}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
