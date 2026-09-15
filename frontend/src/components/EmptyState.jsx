import { Upload, BookOpen, UserCheck, Calendar, Building2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EmptyState({ onUploadClick, hasDocuments, theme = 'light', onSendMessage }) {
  const isLight = theme === 'light';

  const suggestionChips = [
    { label: 'Course & Syllabus Info', query: 'What course information and syllabus details are available?', icon: BookOpen },
    { label: 'Admission Guidelines', query: 'Tell me about the admission process and eligibility requirements.', icon: UserCheck },
    { label: 'Exam Schedule & Grades', query: 'What are the upcoming exam schedules and grading criteria?', icon: Calendar },
    { label: 'Campus Facilities', query: 'What facilities and campus resources are available?', icon: Building2 },
  ];

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 text-center select-none">
      <motion.div 
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-xl w-full"
      >
        {/* Exact Logo from Landing Page: Blue Academic Shield with Layered Open Book */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-5 drop-shadow-[0_8px_24px_rgba(21,87,214,0.35)]">
          <svg className="w-16 h-16 sm:w-20 sm:h-20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Shield Base */}
            <path
              d="M10 8 L24 4 L38 8 V24 C38 34 24 43 24 43 C24 43 10 34 10 24 V8 Z"
              fill="#1557D6"
            />
            <path
              d="M24 4 L38 8 V24 C38 34 24 43 24 43 V4 Z"
              fill="#0F49B8"
            />

            {/* Layered Outer Pages */}
            <path
              d="M13.5 17.5 L15.5 17 V30 L13.5 29 V17.5 Z"
              fill="white"
              opacity="0.8"
            />
            <path
              d="M34.5 17.5 L32.5 17 V30 L34.5 29 V17.5 Z"
              fill="white"
              opacity="0.8"
            />

            {/* Main Open Book Pages */}
            <path
              d="M16 15 C19 14.2 22 14.5 24 16.5 C26 14.5 29 14.2 32 15 V28.5 C29 27.5 26 27.5 24 29.5 C22 27.5 19 27.5 16 28.5 V15 Z"
              fill="white"
            />

            {/* Inner Spine Line & Page Arc */}
            <path
              d="M24 16.5 V29.5"
              stroke="#1557D6"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path
              d="M21.5 30.5 C22.5 31.8 25.5 31.8 26.5 30.5"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <h2 className={`text-2xl sm:text-3xl font-extrabold mb-2.5 tracking-tight ${
          isLight ? 'text-[#0F172A]' : 'text-white'
        }`}>
          How can I help you today?
        </h2>

        <p className={`text-xs sm:text-sm max-w-md mx-auto mb-6 leading-relaxed ${
          isLight ? 'text-[#475569]' : 'text-zinc-400'
        }`}>
          {hasDocuments
            ? 'Your document is processed and ready. Ask me anything about courses, admissions, exams, or policies!'
            : 'Upload an academic PDF document to begin asking questions, getting instant answers, and analyzing documents.'}
        </p>

        {/* Suggestion Chips */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6 text-left">
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

        {!hasDocuments && (
          <button
            onClick={onUploadClick}
            className="inline-flex items-center gap-2 bg-[#1557D6] hover:bg-[#0F46B3] text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all shadow-[0_6px_20px_rgba(21,87,214,0.3)] hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Upload a PDF Document</span>
          </button>
        )}
      </motion.div>
    </div>
  );
}
