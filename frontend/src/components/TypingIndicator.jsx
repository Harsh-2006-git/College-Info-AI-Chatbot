import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function TypingIndicator({ theme = 'light' }) {
  const isLight = theme === 'light';

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2 mb-0.5">
        <span className={`font-extrabold text-sm ${isLight ? 'text-[#0F172A]' : 'text-white'}`}>
          College InfoBot AI
        </span>
        <span className={`text-[11px] font-medium ${isLight ? 'text-[#64748B]' : 'text-zinc-500'}`}>
          Just now
        </span>
      </div>

      <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl max-w-fit border transition-all ${
        isLight 
          ? 'bg-[#F8FAFC] border-[#CBD5E1] shadow-xs text-[#0F172A]' 
          : 'bg-[#141418] border-[#27272A] shadow-md text-zinc-100'
      }`}>
        {/* Animated Bouncing Dots */}
        <div className="flex items-center space-x-1.5 py-0.5">
          <motion.div
            className={`w-2.5 h-2.5 rounded-full ${isLight ? 'bg-[#1557D6]' : 'bg-[#60A5FA]'}`}
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className={`w-2.5 h-2.5 rounded-full ${isLight ? 'bg-[#1557D6]' : 'bg-[#60A5FA]'}`}
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
          />
          <motion.div
            className={`w-2.5 h-2.5 rounded-full ${isLight ? 'bg-[#1557D6]' : 'bg-[#60A5FA]'}`}
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
          />
        </div>

        <div className="flex items-center gap-1.5 pl-1">
          <Sparkles className={`w-3.5 h-3.5 animate-pulse ${isLight ? 'text-[#1557D6]' : 'text-[#60A5FA]'}`} />
          <span className={`text-xs sm:text-sm font-semibold tracking-tight ${
            isLight ? 'text-[#334155]' : 'text-zinc-300'
          }`}>
            AI is thinking...
          </span>
        </div>
      </div>
    </div>
  );
}
