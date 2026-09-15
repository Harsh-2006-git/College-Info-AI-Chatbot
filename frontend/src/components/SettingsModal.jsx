import React from 'react';
import { X, Sparkles, Cpu, Zap, Search, MessageSquare, Layers, Volume2, VolumeX, Bot, Brain, Sun, Moon, Palette } from 'lucide-react';

export default function SettingsModal({
  isOpen,
  onClose,
  selectedModel,
  setSelectedModel,
  selectedRetrievalMode,
  setSelectedRetrievalMode,
  ttsEnabled,
  onToggleTts,
  theme = 'light',
  onToggleTheme
}) {
  if (!isOpen) return null;

  const isLight = theme === 'light';

  const models = [
    { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', desc: 'Fast, balanced model for most tasks.', icon: <Bot className="w-4 h-4 text-violet-500" /> },
    { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B (Groq)', desc: 'High intelligence versatile model.', icon: <Zap className="w-4 h-4 text-amber-500" /> },
    { id: 'llama3.2:latest', name: 'Llama 3.2 (Local)', desc: 'Run locally on your device.', icon: <Cpu className="w-4 h-4 text-blue-500" /> }
  ];

  const retrievalModes = [
    { id: 'simple', name: 'Simple Vector Search', desc: 'Standard semantic document search.', icon: <Search className="w-4 h-4 text-slate-400" /> },
    { id: 'history_aware', name: 'History-Aware RAG', desc: 'Maintains context across follow-up queries.', icon: <MessageSquare className="w-4 h-4 text-indigo-500" /> },
    { id: 'multi_query', name: 'Multi-Query RRF', desc: 'Searches multiple query variations.', icon: <Layers className="w-4 h-4 text-emerald-500" /> },
    { id: 'advanced', name: 'Advanced RAG Hybrid', desc: 'Combines Standalone rewrite + RRF.', icon: <Brain className="w-4 h-4 text-violet-500" /> }
  ];

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md select-none ${
      isLight ? 'bg-slate-900/40' : 'bg-black/80'
    }`}>
      <div 
        className="fixed inset-0 bg-transparent" 
        onClick={onClose} 
      />
      
      <div className={`w-full max-w-[92%] sm:max-w-md rounded-2xl p-5 shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[85vh] border transition-colors ${
        isLight ? 'bg-white border-[#E2E8F0] text-[#0F172A]' : 'bg-[#0D0D10] border-[#27272A] text-white'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between pb-3 border-b mb-4 shrink-0 ${
          isLight ? 'border-[#E2E8F0]' : 'border-[#1F1F24]'
        }`}>
          <h3 className="text-base font-extrabold flex items-center gap-2">
            Settings
          </h3>
          <button
            onClick={onClose}
            className={`p-1 rounded-lg transition-colors cursor-pointer ${
              isLight ? 'text-[#64748B] hover:bg-[#F1F5F9]' : 'text-zinc-400 hover:bg-[#18181D] hover:text-white'
            }`}
            title="Close Settings"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4 custom-scrollbar">

          {/* Theme Switcher Section */}
          <div className="space-y-2">
            <label className={`text-[10px] font-bold uppercase tracking-wider block ${
              isLight ? 'text-[#64748B]' : 'text-zinc-400'
            }`}>
              Appearance & Theme
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => theme !== 'light' && onToggleTheme && onToggleTheme()}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  theme === 'light'
                    ? 'bg-[#1557D6] text-white border-[#1557D6] shadow-sm'
                    : isLight ? 'bg-[#F8FAFC] border-[#CBD5E1] text-[#334155]' : 'bg-[#141418] border-[#27272A] text-zinc-400 hover:text-white'
                }`}
              >
                <Sun className="w-4 h-4 text-amber-300" />
                <span>Light Mode</span>
              </button>
              <button
                onClick={() => theme !== 'dark' && onToggleTheme && onToggleTheme()}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-[#1557D6] text-white border-[#1557D6] shadow-sm'
                    : isLight ? 'bg-[#F8FAFC] border-[#CBD5E1] text-[#334155]' : 'bg-[#141418] border-[#27272A] text-zinc-400 hover:text-white'
                }`}
              >
                <Moon className="w-4 h-4 text-indigo-300" />
                <span>Dark Obsidian</span>
              </button>
            </div>
          </div>
          
          {/* AI Model Selection */}
          <div className="space-y-2">
            <label className={`text-[10px] font-bold uppercase tracking-wider block ${
              isLight ? 'text-[#64748B]' : 'text-zinc-400'
            }`}>
              AI Chat Model
            </label>
            <div className="grid grid-cols-1 gap-1.5">
              {models.map((model) => (
                <button
                  key={model.id}
                  onClick={() => setSelectedModel(model.id)}
                  className={`flex items-start gap-2.5 w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer ${
                    selectedModel === model.id
                      ? (isLight ? 'bg-[#1557D6]/10 border-[#1557D6] text-[#1557D6] font-bold' : 'bg-[#1557D6]/20 border-[#1557D6] text-white font-bold')
                      : (isLight ? 'bg-[#F8FAFC] border-[#E2E8F0] hover:border-[#CBD5E1]' : 'bg-[#141418] border-[#27272A] hover:border-zinc-500')
                  }`}
                >
                  <div className="mt-0.5 shrink-0">{model.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-xs font-semibold ${isLight ? 'text-[#0F172A]' : 'text-white'}`}>{model.name}</div>
                    <div className={`text-[11px] mt-0.5 ${isLight ? 'text-[#64748B]' : 'text-zinc-400'}`}>{model.desc}</div>
                  </div>
                  {selectedModel === model.id && (
                    <div className="w-2 h-2 rounded-full bg-[#1557D6] mt-1.5 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* RAG Strategy Selection */}
          <div className="space-y-2">
            <label className={`text-[10px] font-bold uppercase tracking-wider block ${
              isLight ? 'text-[#64748B]' : 'text-zinc-400'
            }`}>
              Retrieval Strategy
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {retrievalModes.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setSelectedRetrievalMode(mode.id)}
                  className={`flex flex-col justify-between w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer ${
                    selectedRetrievalMode === mode.id
                      ? (isLight ? 'bg-[#1557D6]/10 border-[#1557D6]' : 'bg-[#1557D6]/20 border-[#1557D6]')
                      : (isLight ? 'bg-[#F8FAFC] border-[#E2E8F0] hover:border-[#CBD5E1]' : 'bg-[#141418] border-[#27272A] hover:border-zinc-500')
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <div className="shrink-0">{mode.icon}</div>
                    <div className={`text-xs font-semibold truncate ${isLight ? 'text-[#0F172A]' : 'text-white'}`}>{mode.name}</div>
                  </div>
                  <div className={`text-[10px] mt-1 leading-normal flex-1 ${isLight ? 'text-[#64748B]' : 'text-zinc-400'}`}>
                    {mode.desc}
                  </div>
                  {selectedRetrievalMode === mode.id && (
                    <div className="w-1.5 h-1.5 rounded-full bg-[#1557D6] self-end mt-1.5" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Voice Assistant */}
          <div className={`space-y-2 pt-2 border-t ${isLight ? 'border-[#E2E8F0]' : 'border-[#1F1F24]'}`}>
            <label className={`text-[10px] font-bold uppercase tracking-wider block ${
              isLight ? 'text-[#64748B]' : 'text-zinc-400'
            }`}>
              Voice Assistant
            </label>
            <div 
              onClick={onToggleTts}
              className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                isLight ? 'bg-[#F8FAFC] border-[#E2E8F0] hover:border-[#CBD5E1]' : 'bg-[#141418] border-[#27272A] hover:border-zinc-500'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`p-1.5 rounded-lg ${ttsEnabled ? 'bg-emerald-500/20 text-emerald-500' : (isLight ? 'bg-[#E2E8F0] text-[#64748B]' : 'bg-[#1E1E24] text-zinc-400')}`}>
                  {ttsEnabled ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
                </div>
                <div>
                  <div className={`text-xs font-semibold ${isLight ? 'text-[#0F172A]' : 'text-white'}`}>Auto Read-Aloud</div>
                  <div className={`text-[10px] ${isLight ? 'text-[#64748B]' : 'text-zinc-400'}`}>Read AI answers aloud automatically</div>
                </div>
              </div>
              
              {/* Toggle switch */}
              <div className={`w-8 h-5 flex items-center rounded-full p-0.5 cursor-pointer transition-colors ${ttsEnabled ? 'bg-[#1557D6]' : (isLight ? 'bg-[#CBD5E1]' : 'bg-[#27272A]')}`}>
                <div className={`bg-white w-3.5 h-3.5 rounded-full shadow-md transform transition-transform duration-200 ${ttsEnabled ? 'translate-x-3.5' : 'translate-x-0'}`} />
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className={`pt-3 border-t mt-4 shrink-0 ${isLight ? 'border-[#E2E8F0]' : 'border-[#1F1F24]'}`}>
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-[#1557D6] hover:bg-[#0F46B3] active:scale-[0.99] text-white font-semibold rounded-xl shadow-[0_4px_14px_rgba(21,87,214,0.3)] transition-all text-xs cursor-pointer"
          >
            Apply Changes
          </button>
        </div>
      </div>
    </div>
  );
}
