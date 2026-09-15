import { useState, useRef, useEffect } from 'react';
import { Send, Volume2, VolumeX } from 'lucide-react';

export default function ChatInput({ onSendMessage, isTyping, ttsEnabled, onToggleTts, hasDocuments, onUploadClick, theme = 'light' }) {
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const textareaRef = useRef(null);
  const isLight = theme === 'light';

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  // Hide warning automatically if documents are uploaded
  useEffect(() => {
    if (hasDocuments) {
      setShowWarning(false);
    }
  }, [hasDocuments]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (!input.trim() || isTyping) return;

    if (!hasDocuments) {
      setShowWarning(true);
      return;
    }

    onSendMessage(input.trim());
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  return (
    <div className={`p-3.5 sm:p-4 shrink-0 z-10 transition-colors ${
      isLight ? 'bg-white border-t border-[#E2E8F0]' : 'bg-[#0D0D10] border-t border-[#1F1F24]'
    }`}>
      {showWarning && !hasDocuments && (
        <div className={`max-w-4xl w-full mx-auto md:mx-0 md:ml-12 mb-3 flex items-center justify-between gap-3 p-3 rounded-xl text-xs sm:text-sm shadow-md animate-pulse border ${
          isLight ? 'bg-amber-50 border-amber-300 text-amber-900' : 'bg-[#1C1917] border-amber-500/30 text-amber-200'
        }`}>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
            <span className="font-semibold">
              Please upload an academic PDF document to begin asking questions.
            </span>
          </div>
          <button
            type="button"
            onClick={onUploadClick}
            className="text-[#1557D6] hover:underline font-bold text-xs shrink-0 cursor-pointer"
          >
            Upload PDF
          </button>
        </div>
      )}

      <div className={`max-w-4xl w-full mx-auto md:mx-0 md:ml-12 flex items-center gap-2 backdrop-blur-md border rounded-2xl pl-4 pr-2.5 py-2.5 shadow-sm transition-all ${
        isLight 
          ? (isFocused ? 'bg-white border-[#1557D6] ring-2 ring-[#1557D6]/20 shadow-md' : 'bg-[#F8FAFC] border-[#CBD5E1] hover:border-[#1557D6]/60')
          : (isFocused ? 'bg-[#141418] border-[#1557D6] ring-2 ring-[#1557D6]/30 shadow-[0_0_24px_rgba(21,87,214,0.2)]' : 'bg-[#141418] border-[#27272A] hover:border-zinc-500')
      }`}>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            if (showWarning) setShowWarning(false);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Ask a question about your documents or campus info..."
          className={`flex-1 bg-transparent text-sm sm:text-base focus:outline-none resize-none overflow-hidden max-h-[160px] py-1 leading-relaxed align-middle font-normal ${
            isLight ? 'text-[#0F172A] placeholder:text-[#64748B]' : 'text-zinc-100 placeholder:text-zinc-500'
          }`}
          rows={1}
          disabled={isTyping}
        />
        
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Global TTS Toggle */}
          <button
            type="button"
            onClick={onToggleTts}
            className={`p-2 rounded-xl transition-all flex items-center justify-center cursor-pointer border ${
              ttsEnabled
                ? 'bg-[#1557D6] text-white border-[#1557D6] shadow-sm'
                : isLight ? 'bg-[#F1F5F9] text-[#64748B] border-[#CBD5E1] hover:text-[#0F172A]' : 'bg-[#18181D] text-zinc-400 border-[#27272A] hover:text-white'
            }`}
            title={ttsEnabled ? 'Disable Text-to-Speech (Auto-Speak)' : 'Enable Text-to-Speech (Auto-Speak)'}
          >
            {ttsEnabled ? <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>

          {/* Send / Stop Buttons */}
          {isTyping ? (
            <button className={`p-2.5 rounded-xl cursor-not-allowed flex items-center justify-center border ${
              isLight ? 'bg-[#F1F5F9] text-[#94A3B8] border-[#CBD5E1]' : 'bg-[#18181D] text-zinc-500 border-[#27272A]'
            }`} disabled>
              <div className="w-5 h-5 flex items-center justify-center">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1557D6] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1557D6]"></span>
                </span>
              </div>
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!input.trim()}
              className="p-2.5 bg-[#1557D6] hover:bg-[#0F46B3] text-white rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center justify-center shadow-[0_4px_14px_rgba(21,87,214,0.3)] hover:scale-105 active:scale-95"
            >
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}
        </div>
      </div>

      <div className="max-w-4xl w-full mx-auto md:mx-0 md:ml-12 text-left pl-4 mt-2 hidden md:block">
        <p className={`text-[11px] font-normal ${isLight ? 'text-[#64748B]' : 'text-zinc-500'}`}>
          College InfoBot AI may make mistakes. Verify important academic notices. Shift + Enter for new line.
        </p>
      </div>
    </div>
  );
}
