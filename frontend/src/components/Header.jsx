import { useState, useRef, useEffect } from 'react';
import { Menu, ChevronDown, Home, Bot, Brain, Cpu, Zap, Search, MessageSquare, Layers, Sun, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Header({ toggleSidebar, selectedModel, setSelectedModel, selectedRetrievalMode, setSelectedRetrievalMode, theme = 'light', onToggleTheme }) {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [retrievalDropdownOpen, setRetrievalDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const retrievalDropdownRef = useRef(null);

  const models = [
    { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', icon: <Bot className="w-4 h-4 text-violet-500" /> },
    { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B (Groq)', icon: <Zap className="w-4 h-4 text-amber-500" /> },
    { id: 'llama3.2:latest', name: 'Llama 3.2 (Local)', icon: <Cpu className="w-4 h-4 text-blue-500" /> }
  ];

  const retrievalModes = [
    { id: 'simple', name: 'Simple Vector Search', icon: <Search className="w-4 h-4 text-slate-400" /> },
    { id: 'history_aware', name: 'History-Aware RAG', icon: <MessageSquare className="w-4 h-4 text-indigo-500" /> },
    { id: 'multi_query', name: 'Multi-Query RRF', icon: <Layers className="w-4 h-4 text-emerald-500" /> },
    { id: 'advanced', name: 'Advanced RAG Hybrid', icon: <Brain className="w-4 h-4 text-violet-500" /> }
  ];

  const currentModel = models.find(m => m.id === selectedModel) || models[0];
  const currentRetrievalMode = retrievalModes.find(m => m.id === selectedRetrievalMode) || retrievalModes[1];

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (retrievalDropdownRef.current && !retrievalDropdownRef.current.contains(event.target)) {
        setRetrievalDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isLight = theme === 'light';

  return (
    <header className={`h-14 flex items-center justify-between px-4 shrink-0 backdrop-blur-md sticky top-0 z-10 select-none transition-colors ${
      isLight ? 'bg-white/90 border-b border-[#E2E8F0]' : 'bg-[#0D0D10]/90 border-b border-[#1F1F24]'
    }`}>
      <div className="flex items-center gap-2 sm:gap-3">
        <button 
          onClick={toggleSidebar}
          className={`p-2 md:hidden rounded-lg transition-colors cursor-pointer ${
            isLight ? 'text-[#475569] hover:bg-[#F1F5F9]' : 'text-zinc-400 hover:bg-[#141418]'
          }`}
        >
          <Menu className="w-5 h-5" />
        </button>
        
        {/* Mobile Header Brand Logo from Landing Page */}
        <div 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 cursor-pointer md:hidden"
          title="Back to Landing Page"
        >
          <div className="w-[30px] h-[30px] flex items-center justify-center flex-shrink-0 drop-shadow-[0_2px_8px_rgba(21,87,214,0.30)]">
            <svg className="w-[30px] h-[30px]" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 8 L24 4 L38 8 V24 C38 34 24 43 24 43 C24 43 10 34 10 24 V8 Z" fill="#1557D6" />
              <path d="M24 4 L38 8 V24 C38 34 24 43 24 43 V4 Z" fill="#0F49B8" />
              <path d="M13.5 17.5 L15.5 17 V30 L13.5 29 V17.5 Z" fill="white" opacity="0.8" />
              <path d="M34.5 17.5 L32.5 17 V30 L34.5 29 V17.5 Z" fill="white" opacity="0.8" />
              <path d="M16 15 C19 14.2 22 14.5 24 16.5 C26 14.5 29 14.2 32 15 V28.5 C29 27.5 26 27.5 24 29.5 C22 27.5 19 27.5 16 28.5 V15 Z" fill="white" />
              <path d="M24 16.5 V29.5" stroke="#1557D6" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M21.5 30.5 C22.5 31.8 25.5 31.8 26.5 30.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
        </div>
        
        {/* Model Selector Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all shadow-sm cursor-pointer ${
              isLight 
                ? 'bg-[#F8FAFC] hover:bg-[#F1F5F9] border-[#CBD5E1] text-[#0F172A]' 
                : 'bg-[#141418] hover:bg-[#1A1A20] border-[#27272A] text-zinc-200'
            }`}
            title="Select AI Model"
          >
            {currentModel.icon}
            <span className="text-xs sm:text-sm font-semibold hidden sm:inline">{currentModel.name}</span>
            <ChevronDown 
              className={`w-4 h-4 transition-transform duration-200 ${isLight ? 'text-[#64748B]' : 'text-zinc-400'}`} 
              style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'none' }} 
            />
          </button>
          
          {dropdownOpen && (
            <div className={`absolute left-0 mt-2 w-56 rounded-xl border p-1.5 shadow-xl z-50 animate-in fade-in slide-in-from-top-1 duration-100 ${
              isLight ? 'bg-white border-[#CBD5E1]' : 'bg-[#111114] border-[#27272A]'
            }`}>
              {models.map((model) => (
                <button
                  key={model.id}
                  onClick={() => {
                    setSelectedModel(model.id);
                    setDropdownOpen(false);
                  }}
                  className={`flex items-center gap-2.5 w-full text-left px-3 py-2 rounded-lg text-xs sm:text-sm transition-all cursor-pointer ${
                    selectedModel === model.id 
                      ? 'bg-[#1557D6] text-white font-bold shadow-sm' 
                      : isLight ? 'text-[#334155] hover:bg-[#F1F5F9]' : 'text-zinc-300 hover:text-white hover:bg-[#18181D]'
                  }`}
                >
                  {model.icon}
                  {model.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RAG Mode Selector Dropdown */}
        <div className="relative" ref={retrievalDropdownRef}>
          <button 
            onClick={() => setRetrievalDropdownOpen(!retrievalDropdownOpen)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all shadow-sm cursor-pointer ${
              isLight 
                ? 'bg-[#F8FAFC] hover:bg-[#F1F5F9] border-[#CBD5E1] text-[#0F172A]' 
                : 'bg-[#141418] hover:bg-[#1A1A20] border-[#27272A] text-zinc-200'
            }`}
            title="Select RAG Retrieval Strategy"
          >
            {currentRetrievalMode.icon}
            <span className="text-xs sm:text-sm font-semibold hidden sm:inline">{currentRetrievalMode.name}</span>
            <ChevronDown 
              className={`w-4 h-4 transition-transform duration-200 ${isLight ? 'text-[#64748B]' : 'text-zinc-400'}`} 
              style={{ transform: retrievalDropdownOpen ? 'rotate(180deg)' : 'none' }} 
            />
          </button>
          
          {retrievalDropdownOpen && (
            <div className={`absolute left-0 mt-2 w-64 rounded-xl border p-1.5 shadow-xl z-50 animate-in fade-in slide-in-from-top-1 duration-100 ${
              isLight ? 'bg-white border-[#CBD5E1]' : 'bg-[#111114] border-[#27272A]'
            }`}>
              {retrievalModes.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => {
                    setSelectedRetrievalMode(mode.id);
                    setRetrievalDropdownOpen(false);
                  }}
                  className={`flex items-start gap-2.5 w-full text-left px-3 py-2.5 rounded-lg text-xs sm:text-sm transition-all cursor-pointer ${
                    selectedRetrievalMode === mode.id 
                      ? 'bg-[#1557D6] text-white font-bold shadow-sm' 
                      : isLight ? 'text-[#334155] hover:bg-[#F1F5F9]' : 'text-zinc-300 hover:text-white hover:bg-[#18181D]'
                  }`}
                >
                  <div className="mt-0.5">{mode.icon}</div>
                  <div className="flex flex-col">
                    <div className="font-semibold text-xs">{mode.name}</div>
                    <div className={`text-[10px] leading-tight mt-0.5 ${isLight ? 'text-[#64748B]' : 'text-zinc-400'}`}>
                      {mode.id === 'simple' && 'Standard query semantic lookup.'}
                      {mode.id === 'history_aware' && 'Resolves references using chat history.'}
                      {mode.id === 'multi_query' && 'Generates variations + fusion ranking.'}
                      {mode.id === 'advanced' && 'Standalone rewrite + variations + RRF.'}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Theme Switcher Button */}
        {onToggleTheme && (
          <button
            onClick={onToggleTheme}
            className={`p-2 rounded-xl border transition-all flex items-center justify-center cursor-pointer ${
              isLight 
                ? 'bg-[#F8FAFC] hover:bg-[#F1F5F9] border-[#CBD5E1] text-[#1557D6] shadow-sm' 
                : 'bg-[#141418] hover:bg-[#1A1A20] border-[#27272A] text-amber-400 shadow-sm'
            }`}
            title={isLight ? "Switch to Obsidian Dark Theme" : "Switch to Light Theme"}
          >
            {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
        )}

        {/* Back to Home Button */}
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-xs text-white bg-[#1557D6] hover:bg-[#0F46B3] px-3.5 py-2 rounded-xl shadow-[0_4px_14px_rgba(21,87,214,0.3)] transition-all cursor-pointer font-semibold"
          title="Back to Landing Page"
        >
          <Home className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Back to Home</span>
        </button>
      </div>
    </header>
  );
}
