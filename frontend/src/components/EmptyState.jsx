import { BookOpen, UserCheck, Calendar, Building2, GraduationCap, ShieldCheck, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EmptyState({ theme = 'light', onSendMessage }) {
  const isLight = theme === 'light';

  const suggestionChips = [
    { label: 'B.Tech & Hostel Fees', query: 'What is the annual tuition fee for B.Tech and hostel mess charges?', icon: GraduationCap },
    { label: 'Admissions & Eligibility', query: 'What are the admission eligibility requirements and counseling process?', icon: UserCheck },
    { label: 'Faculty Directory & HoDs', query: 'Who is Dr. Sanjay Tiwari and what is his designation and department?', icon: BookOpen },
    { label: 'IT Department Labs', query: 'What specialized laboratories and research areas exist in the IT department?', icon: Building2 },
    { label: 'Hostel Rules & Curfew', query: 'What are the hostel room options, curfew timings, and safety rules?', icon: ShieldCheck },
    { label: 'Prominent Alumni & Placements', query: 'Name some prominent alumni of MITS Gwalior and top placement recruiters.', icon: Sparkles },
  ];

  return (
    <div className="h-full flex flex-col items-center justify-center p-4 sm:p-6 text-center select-none">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.35 }}
        className="max-w-2xl w-full"
      >
        {/* Academic Shield Logo */}
        <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-4 drop-shadow-[0_8px_20px_rgba(21,87,214,0.3)]">
          <svg className="w-14 h-14 sm:w-16 sm:h-16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 8 L24 4 L38 8 V24 C38 34 24 43 24 43 C24 43 10 34 10 24 V8 Z" fill="#1557D6" />
            <path d="M24 4 L38 8 V24 C38 34 24 43 24 43 V4 Z" fill="#0F49B8" />
            <path d="M13.5 17.5 L15.5 17 V30 L13.5 29 V17.5 Z" fill="white" opacity="0.8" />
            <path d="M34.5 17.5 L32.5 17 V30 L34.5 29 V17.5 Z" fill="white" opacity="0.8" />
            <path d="M16 15 C19 14.2 22 14.5 24 16.5 C26 14.5 29 14.2 32 15 V28.5 C29 27.5 26 27.5 24 29.5 C22 27.5 19 27.5 16 28.5 V15 Z" fill="white" />
            <path d="M24 16.5 V29.5" stroke="#1557D6" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M21.5 30.5 C22.5 31.8 25.5 31.8 26.5 30.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold mb-3 border bg-[#1557D6]/10 border-[#1557D6]/20 text-[#1557D6]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Official Campus Knowledge Base Connected</span>
        </div>

        <h2 className={`text-2xl sm:text-3xl font-extrabold mb-2 tracking-tight ${
          isLight ? 'text-[#0F172A]' : 'text-white'
        }`}>
          How can I assist you today?
        </h2>

        <p className={`text-xs sm:text-sm max-w-lg mx-auto mb-6 leading-relaxed ${
          isLight ? 'text-[#475569]' : 'text-zinc-400'
        }`}>
          Ask me anything about admissions, courses, fees, scholarships, hostels, faculty, laboratories, exam regulations, and campus life at MITS Gwalior.
        </p>

        {/* Suggestion Chips */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left max-w-xl mx-auto">
          {suggestionChips.map((chip, idx) => {
            const Icon = chip.icon;
            return (
              <button
                key={idx}
                onClick={() => onSendMessage && onSendMessage(chip.query)}
                className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs font-semibold transition-all cursor-pointer group ${
                  isLight 
                    ? 'bg-white border-[#E2E8F0] hover:border-[#1557D6] hover:bg-[#F8FAFC] text-[#1E293B] shadow-sm' 
                    : 'bg-[#131317] border-[#27272A] hover:border-zinc-500 hover:bg-[#18181E] text-zinc-200 shadow-md'
                }`}
              >
                <div className={`p-1.5 rounded-lg shrink-0 transition-colors ${
                  isLight ? 'bg-[#EFF6FF] text-[#1557D6] group-hover:bg-[#1557D6] group-hover:text-white' : 'bg-zinc-800 text-zinc-300 group-hover:bg-[#1557D6] group-hover:text-white'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="truncate">{chip.label}</span>
              </button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

