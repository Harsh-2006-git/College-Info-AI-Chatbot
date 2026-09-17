import { useState } from 'react';
import { 
  MessagesSquare, Plus, FileText, Trash2, Settings, X, MessageSquare, Home, Sparkles,
  Compass, ShieldCheck, BookOpen, Users, Building2, Briefcase, Award, UserCheck, 
  Wallet, Landmark, Cpu, GraduationCap, ChevronDown, ChevronRight, Layers, Eye
} from 'lucide-react';

import { formatRelativeTime } from '../utils/helpers';
import { useNavigate } from 'react-router-dom';

const KNOWLEDGE_DOMAINS = [
  { id: '01', title: 'Vision & Mission', query: 'What is the vision, mission, and history of MITS Gwalior?', icon: Compass },
  { id: '02', title: 'Governance & BoG', query: 'Tell me about the Board of Governors, Director, and administration of MITS.', icon: ShieldCheck },
  { id: '03', title: 'Courses & Curriculum', query: 'What B.Tech, M.Tech, MCA, and MBA courses are offered at MITS?', icon: BookOpen },
  { id: '04', title: 'Regulations & Grading', query: 'What are the academic attendance, grading system, and examination rules?', icon: FileText },
  { id: '05', title: 'Faculty Directory (202)', query: 'Who are the faculty members and department heads at MITS Gwalior?', icon: Users },
  { id: '06', title: 'Infrastructure & Labs', query: 'What campus facilities, Central Library, and labs like ASIMOV exist?', icon: Building2 },
  { id: '07', title: 'Placements & Internships', query: 'What are the recent placement packages, top recruiters, and internship stats?', icon: Briefcase },
  { id: '08', title: 'Student Life & Clubs', query: 'What student clubs, technical societies, NCC, and sports activities exist?', icon: Sparkles },
  { id: '09', title: 'Accreditations (NAAC A++)', query: 'What is MITS NAAC grade, NBA accreditation, and NIRF ranking?', icon: Award },
  { id: '10', title: 'Admissions & Cutoffs', query: 'What is the admission procedure, eligibility criteria, and DTE MP counseling?', icon: UserCheck },
  { id: '11', title: 'Fee Structure & Scholarships', query: 'What is the fee structure for B.Tech and what scholarships are available?', icon: Wallet },
  { id: '12', title: 'Hostels, Wardens & Mess', query: 'What are the hostel room options, mess charges, wardens, and curfew rules?', icon: Building2 },
  { id: '13', title: 'Civil Engineering Dept', query: 'Tell me about the Civil Engineering department, faculty, and consultancy projects.', icon: Landmark },
  { id: '14', title: 'Information Technology Dept', query: 'Tell me about the IT department faculty, specialized labs, and research.', icon: Cpu },
  { id: '15', title: 'Prominent Alumni & MoUs', query: 'Who are some distinguished alumni of MITS and what MoUs are signed?', icon: GraduationCap },
];

export default function Sidebar({
  documents,
  isDeleting,
  onDelete,
  onNewChat,
  selectedDocuments,
  setSelectedDocuments,
  sessions = [],
  currentSessionId,
  onSelectSession,
  onDeleteSession,
  onClose,
  onSettingsClick,
  theme = 'light',
  onViewDomain
}) {
  const navigate = useNavigate();
  const isLight = theme === 'light';
  const [domainsOpen, setDomainsOpen] = useState(false);

  const toggleDocument = (docId) => {
    setSelectedDocuments(prev =>
      prev.includes(docId)
        ? prev.filter(id => id !== docId)
        : [docId]
    );
  };

  const handleDomainClick = (domain) => {
    if (onViewDomain) {
      onViewDomain(domain);
    }
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  return (
    <div className={`w-64 flex-shrink-0 backdrop-blur-md flex flex-col h-full z-30 select-none transition-colors ${isLight ? 'bg-white border-r border-[#E2E8F0] text-[#0F172A]' : 'bg-[#0D0D10] border-r border-[#1F1F24] text-[#EDEDED]'
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
          className={`md:hidden p-1.5 rounded-lg transition-all cursor-pointer ${isLight ? 'hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A]' : 'hover:bg-[#1A1A20] text-zinc-400 hover:text-white'
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

      {/* Knowledge Base & Custom Documents */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-3 space-y-4">
        <div>
          <div className={`mb-2 px-2 text-[11px] font-bold uppercase tracking-wider ${isLight ? 'text-[#64748B]' : 'text-zinc-400'}`}>
            Knowledge Base
          </div>

          {/* Active Institutional Database Card */}
          <div className={`p-2.5 rounded-xl border transition-all mb-2 ${isLight ? 'bg-[#EFF6FF] border-[#BFDBFE] text-[#1E3A8A]' : 'bg-[#121624] border-[#1E3E75] text-[#93C5FD]'
            }`}>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span className="text-xs font-bold truncate">MITS Campus Knowledge Base</span>
            </div>

          </div>

          {/* 15 Knowledge Base Domains Interactive List */}
          <div className="mt-3">
            <button
              onClick={() => setDomainsOpen(!domainsOpen)}
              className={`w-full flex items-center justify-between px-2 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer ${isLight ? 'text-[#475569] hover:bg-[#F1F5F9]' : 'text-zinc-400 hover:bg-[#141418]'
                }`}
            >
              <div className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#1557D6]" />
                <span>Knowledge Domains</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${isLight ? 'bg-[#1557D6]/10 text-[#1557D6]' : 'bg-[#1557D6]/20 text-[#60A5FA]'
                  }`}>
                  15
                </span>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${domainsOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {domainsOpen && (
              <div className="space-y-0.5 mt-1.5 max-h-56 overflow-y-auto custom-scrollbar pr-1">
                {KNOWLEDGE_DOMAINS.map((domain) => {
                  const Icon = domain.icon;
                  return (
                    <button
                      key={domain.id}
                      onClick={() => handleDomainClick(domain)}
                      title={`Click to ask about: ${domain.title}`}
                      className={`w-full flex items-center gap-2 p-2 rounded-xl text-left text-xs transition-all cursor-pointer group ${isLight
                          ? 'hover:bg-[#EFF6FF] text-[#334155] hover:text-[#1557D6]'
                          : 'hover:bg-[#151722] text-zinc-300 hover:text-white'
                        }`}
                    >
                      <div className={`p-1.5 rounded-lg shrink-0 transition-colors ${isLight
                          ? 'bg-[#F1F5F9] text-[#1557D6] group-hover:bg-[#1557D6] group-hover:text-white'
                          : 'bg-[#181820] text-[#60A5FA] group-hover:bg-[#1557D6] group-hover:text-white'
                        }`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="truncate font-medium text-[11.5px] flex-1">
                        {domain.title}
                      </span>
                      <Sparkles className="w-3 h-3 opacity-0 group-hover:opacity-100 text-[#1557D6] shrink-0 transition-opacity" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Custom Uploaded Documents (if user added custom PDFs via Settings) */}
          {documents && documents.length > 0 && (
            <div className="space-y-1 mt-3 pt-3 border-t border-dashed border-zinc-200 dark:border-zinc-800">
              <div className={`px-2 text-[10px] font-semibold uppercase tracking-wider mb-1 ${isLight ? 'text-[#64748B]' : 'text-zinc-400'}`}>
                Custom Documents
              </div>

              {documents.map((doc) => (
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
                      className={`opacity-0 group-hover:opacity-100 p-1 rounded hover:text-red-500 transition-all shrink-0 ml-1 ${isLight ? 'hover:bg-red-50 text-[#64748B]' : 'hover:bg-red-500/20 text-zinc-400'
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
              ))}
            </div>
          )}
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
                    className={`opacity-0 group-hover:opacity-100 p-1 rounded hover:text-red-500 transition-all shrink-0 ml-1 ${isLight ? 'hover:bg-red-50 text-[#64748B]' : 'hover:bg-red-500/20 text-zinc-400'
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
          className={`flex items-center gap-2 text-xs font-medium transition-colors w-full p-2.5 rounded-xl cursor-pointer ${isLight ? 'text-[#475569] hover:text-[#0F172A] hover:bg-[#F1F5F9]' : 'text-zinc-400 hover:text-white hover:bg-[#141418]'
            }`}
        >
          <Home className="w-4 h-4" />
          Back to Home
        </button>
        <button
          onClick={onSettingsClick}
          className={`flex items-center gap-2 text-xs font-medium transition-colors w-full p-2.5 rounded-xl cursor-pointer ${isLight ? 'text-[#475569] hover:text-[#0F172A] hover:bg-[#F1F5F9]' : 'text-zinc-400 hover:text-white hover:bg-[#141418]'
            }`}
        >
          <Settings className="w-4 h-4" />
          Settings
        </button>
      </div>
    </div>
  );
}
