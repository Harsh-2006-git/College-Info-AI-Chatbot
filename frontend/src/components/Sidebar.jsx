import { MessagesSquare, Plus, FileText, Trash2, Settings, X, MessageSquare, Home, Sparkles } from 'lucide-react';
import { formatRelativeTime } from '../utils/helpers';
import { useNavigate } from 'react-router-dom';

export default function Sidebar({ documents, isDeleting, onDelete, onNewChat, selectedDocuments, setSelectedDocuments, sessions = [], currentSessionId, onSelectSession, onDeleteSession, onClose, onSettingsClick, theme = 'light' }) {
  const navigate = useNavigate();
  const isLight = theme === 'light';
  
  const toggleDocument = (docId) => {
    setSelectedDocuments(prev => 
      prev.includes(docId) 
        ? prev.filter(id => id !== docId)
        : [docId]
    );
  };

  return (
    <div className={`w-64 flex-shrink-0 backdrop-blur-md flex flex-col h-full z-30 select-none transition-colors ${
      isLight ? 'bg-white border-r border-[#E2E8F0] text-[#0F172A]' : 'bg-[#0D0D10] border-r border-[#1F1F24] text-[#EDEDED]'
    }`}>
      {/* App Logo */}
      <div className="p-4 mb-2 flex items-center justify-between">
        <div 
          onClick={() => {
            navigate('/');
            onClose();
          }}
          className="flex items-center gap-2.5 cursor-pointer group"
          title="Back to Landing Page"
        >
          {/* Exact Logo from Landing Page: Blue Academic Shield with Layered Open Book */}
          <div className="w-[36px] h-[36px] sm:w-[40px] sm:h-[40px] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform drop-shadow-[0_4px_12px_rgba(21,87,214,0.30)]">
            <svg className="w-[36px] h-[36px] sm:w-[40px] sm:h-[40px]" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
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
          <div className="flex flex-col text-left">
            <span className={`font-extrabold text-[16.5px] tracking-tight leading-tight ${isLight ? 'text-[#1557D6]' : 'text-white'}`}>
              College InfoBot
            </span>
            <span className={`text-[9.5px] font-semibold tracking-wider uppercase leading-tight mt-0.5 ${isLight ? 'text-[#64748B]' : 'text-zinc-400'}`}>
              AI Academic Assistant
            </span>
          </div>
        </div>
        
        {/* Close Button on Mobile */}
        <button 
          onClick={onClose}
          className={`md:hidden p-1.5 rounded-lg transition-all cursor-pointer ${
            isLight ? 'hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A]' : 'hover:bg-[#1A1A20] text-zinc-400 hover:text-white'
          }`}
          title="Close Sidebar"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* New Chat Button */}
      <div className="px-4 mb-4">
        <button 
          onClick={onNewChat}
          className="w-full flex items-center justify-between px-3.5 py-2.5 bg-[#1557D6] hover:bg-[#0F46B3] text-white text-sm font-semibold rounded-xl transition-all shadow-[0_4px_14px_rgba(21,87,214,0.3)] group cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-white" />
            New Chat
          </span>
          <Plus className="w-4 h-4 text-white/80 group-hover:text-white transition-colors" />
        </button>
      </div>

      {/* Document List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-3 space-y-4">
        <div>
          <div className={`mb-2 px-2 text-[11px] font-bold uppercase tracking-wider ${isLight ? 'text-[#64748B]' : 'text-zinc-400'}`}>
            Knowledge Base
          </div>
          
          <div className="space-y-1">
            {documents.length === 0 ? (
              <div className={`text-xs text-center p-3 border border-dashed rounded-xl mt-1 ${
                isLight ? 'text-[#64748B] border-[#CBD5E1]' : 'text-zinc-500 border-[#222228]'
              }`}>
                No documents uploaded.<br/>Upload a PDF to begin.
              </div>
            ) : (
              documents.map((doc) => (
                <div 
                  key={doc.id}
                  className={`group flex flex-col rounded-xl transition-all p-2.5 cursor-pointer
                    ${selectedDocuments.includes(doc.id) 
                      ? (isLight ? 'bg-[#1557D6]/10 border border-[#1557D6]/40 shadow-sm' : 'bg-[#181820] border border-[#1557D6]/60 shadow-sm text-white') 
                      : (isLight ? 'hover:bg-[#F1F5F9] border border-transparent' : 'hover:bg-[#141418] border border-transparent')}
                  `}
                  onClick={() => toggleDocument(doc.id)}
                >
                  <div className="flex items-start justify-between w-full">
                    <div className="flex items-center gap-2 overflow-hidden w-full">
                      <FileText className={`w-4 h-4 shrink-0 ${selectedDocuments.includes(doc.id) ? 'text-[#1557D6]' : (isLight ? 'text-[#64748B]' : 'text-zinc-400')}`} />
                      <span className={`text-xs truncate font-medium ${isLight ? 'text-[#0F172A]' : 'text-zinc-200'}`}>
                        {doc.filename}
                      </span>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(doc.id);
                      }}
                      className={`opacity-0 group-hover:opacity-100 p-1 rounded hover:text-red-500 transition-all shrink-0 ml-1 ${
                        isLight ? 'hover:bg-red-50 text-[#64748B]' : 'hover:bg-red-500/20 text-zinc-400'
                      }`}
                      title="Delete document"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className={`pl-6 text-[10px] flex justify-between items-center mt-1 ${isLight ? 'text-[#64748B]' : 'text-zinc-400'}`}>
                    <span>{formatRelativeTime(doc.upload_date)}</span>
                    <span className={`w-2 h-2 rounded-full ${doc.status === 'processed' ? 'bg-emerald-500 shadow-sm' : 'bg-amber-400 animate-pulse'}`} title={doc.status} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Chats Section */}
        <div>
          <div className={`mb-2 px-2 text-[11px] font-bold uppercase tracking-wider ${isLight ? 'text-[#64748B]' : 'text-zinc-400'}`}>
            Recent Chats
          </div>
          
          <div className="space-y-1 pb-4">
            {sessions.length === 0 ? (
              <div className={`text-xs text-center p-3 italic ${isLight ? 'text-[#94A3B8]' : 'text-zinc-500'}`}>
                No past conversations.
              </div>
            ) : (
              sessions.map((session) => (
                <div 
                  key={session.id}
                  className={`group flex items-center justify-between rounded-xl transition-all p-2.5 cursor-pointer
                    ${currentSessionId === session.id 
                      ? (isLight ? 'bg-[#F1F5F9] border border-[#CBD5E1] text-[#0F172A] shadow-sm font-semibold' : 'bg-[#181820] border border-[#2B2B33] text-white shadow-sm font-semibold') 
                      : (isLight ? 'hover:bg-[#F8FAFC] text-[#475569] hover:text-[#0F172A] border border-transparent' : 'hover:bg-[#141418] text-zinc-400 hover:text-white border border-transparent')}
                  `}
                  onClick={() => onSelectSession(session.id)}
                >
                  <div className="flex items-center gap-2 overflow-hidden w-full">
                    <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isLight ? 'text-[#64748B]' : 'text-zinc-400'}`} />
                    <span className="text-xs truncate font-medium">
                      {session.title}
                    </span>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSession(session.id);
                    }}
                    className={`opacity-0 group-hover:opacity-100 p-1 rounded hover:text-red-500 transition-all shrink-0 ml-1 ${
                      isLight ? 'hover:bg-red-50 text-[#64748B]' : 'hover:bg-red-500/20 text-zinc-400'
                    }`}
                    title="Delete chat"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Settings / Footer */}
      <div className={`p-3 border-t mt-auto space-y-1 ${isLight ? 'border-[#E2E8F0]' : 'border-[#1F1F24]'}`}>
        <button 
          onClick={() => {
            navigate('/');
            onClose();
          }}
          className={`flex items-center gap-2 text-xs font-medium transition-colors w-full p-2.5 rounded-xl cursor-pointer ${
            isLight ? 'text-[#475569] hover:text-[#0F172A] hover:bg-[#F1F5F9]' : 'text-zinc-400 hover:text-white hover:bg-[#141418]'
          }`}
        >
          <Home className="w-4 h-4" />
          Back to Home
        </button>
        <button 
          onClick={onSettingsClick}
          className={`flex items-center gap-2 text-xs font-medium transition-colors w-full p-2.5 rounded-xl cursor-pointer ${
            isLight ? 'text-[#475569] hover:text-[#0F172A] hover:bg-[#F1F5F9]' : 'text-zinc-400 hover:text-white hover:bg-[#141418]'
          }`}
        >
          <Settings className="w-4 h-4" />
          Settings
        </button>
      </div>
    </div>
  );
}
