import { FileText, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export default function SourceCard({ source, index, theme = 'light' }) {
  const [expanded, setExpanded] = useState(false);
  const isLight = theme === 'light';

  return (
    <div className={`text-sm rounded-xl overflow-hidden shrink-0 w-[380px] max-w-[90vw] transition-all border ${
      isLight 
        ? 'bg-white border-[#CBD5E1] shadow-sm hover:border-[#1557D6] hover:shadow-md' 
        : 'bg-[#131317] border-[#27272A] shadow-md hover:border-zinc-500'
    }`}>
      <button 
        onClick={() => setExpanded(!expanded)}
        className={`w-full flex items-center justify-between p-2.5 transition-colors cursor-pointer ${
          isLight ? 'hover:bg-[#F8FAFC]' : 'hover:bg-[#18181E]'
        }`}
      >
        <div className="flex items-center space-x-2.5 overflow-hidden">
          <span className={`flex items-center justify-center w-5 h-5 rounded-lg text-xs font-bold shrink-0 ${
            isLight ? 'bg-[#EFF6FF] text-[#1557D6]' : 'bg-[#1557D6]/30 text-[#60A5FA]'
          }`}>
            {index + 1}
          </span>
          <FileText className={`w-4 h-4 shrink-0 ${isLight ? 'text-[#1557D6]' : 'text-[#60A5FA]'}`} />
          <span className={`truncate text-xs font-bold tracking-tight ${
            isLight ? 'text-[#0F172A]' : 'text-zinc-100'
          }`}>
            {source.filename}
          </span>
          <span className={`text-[11px] font-semibold shrink-0 px-2 py-0.5 rounded-md border ${
            isLight 
              ? 'bg-[#F1F5F9] text-[#334155] border-[#CBD5E1]' 
              : 'bg-[#1C1C22] text-zinc-300 border-[#2E2E35]'
          }`}>
            Pg {source.page || 1}
          </span>
        </div>
        <ChevronRight className={`w-4 h-4 transition-transform shrink-0 ${
          expanded ? 'rotate-90' : ''
        } ${isLight ? 'text-[#64748B]' : 'text-zinc-400'}`} />
      </button>
      
      {expanded && (
        <div className={`p-3.5 border-t text-xs font-mono leading-relaxed break-words ${
          isLight 
            ? 'bg-[#F8FAFC] border-[#E2E8F0] text-[#334155]' 
            : 'bg-[#0C0C0F] border-[#222228] text-zinc-300'
        }`}>
          <p className="italic">
            "{source.content}"
          </p>
          {source.score !== undefined && (
            <div className={`mt-2.5 text-[11px] font-sans font-semibold flex items-center ${
              isLight ? 'text-emerald-700' : 'text-emerald-400'
            }`}>
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 inline-block" />
              Relevance: {((1 - source.score) * 100).toFixed(1)}%
            </div>
          )}
        </div>
      )}
    </div>
  );
}
