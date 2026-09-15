import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import ChatWindow from '../components/ChatWindow';
import ChatInput from '../components/ChatInput';
import UploadModal from '../components/UploadModal';
import SettingsModal from '../components/SettingsModal';
import { useDocuments } from '../hooks/useDocuments';
import { useChat } from '../hooks/useChat';
import { useChatSessions } from '../hooks/useChatSessions';
import { speakText } from '../utils/speech';

export default function Chat() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('app_theme') || 'light';
  });

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('app_theme', next);
      return next;
    });
  };

  const location = useLocation();

  const { documents, isDeleting, deleteDoc } = useDocuments();
  const [selectedModel, setSelectedModel] = useState('llama-3.3-70b-versatile');
  const [selectedRetrievalMode, setSelectedRetrievalMode] = useState('history_aware');
  const { 
    messages, 
    sendMessage, 
    isTyping, 
    selectedDocuments, 
    setSelectedDocuments,
    clearChat,
    currentSessionId,
    loadChat
  } = useChat();
  const [ttsEnabled, setTtsEnabled] = useState(() => {
    return localStorage.getItem('docuchat_tts_enabled') === 'true';
  });

  const handleToggleTts = () => {
    setTtsEnabled(prev => {
      const next = !prev;
      localStorage.setItem('docuchat_tts_enabled', String(next));
      if (!next) {
        window.speechSynthesis.cancel();
      }
      return next;
    });
  };

  useEffect(() => {
    if (messages.length === 0) return;
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.role === 'ai' && lastMessage.isNew && ttsEnabled) {
      speakText(lastMessage.content, () => {
        lastMessage.isNew = false;
      });
    }
  }, [messages, ttsEnabled]);

  const { sessions, fetchSessions, deleteSession } = useChatSessions();

  const handleSendMessage = async (content) => {
    const sessionId = await sendMessage(content, selectedModel, selectedRetrievalMode);
    if (sessionId) {
      fetchSessions(); // Refresh sidebar to show the new chat
    }
  };

  // Handle incoming query or upload from landing page
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('upload') === 'true') {
      setUploadModalOpen(true);
      window.history.replaceState({}, '', '/chat');
    }

    const initialQuery = location.state?.query || searchParams.get('q');
    if (initialQuery) {
      handleSendMessage(initialQuery);
      window.history.replaceState({}, '', '/chat');
    }
  }, [location]);

  useEffect(() => {
    setSelectedDocuments(documents.length > 0 ? [documents[0].id] : []);
  }, [documents, setSelectedDocuments]);

  // Lock html and body overflow to prevent page-level scrolling (critical for mobile viewports)
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    const originalHtmlOverflow = html.style.overflow;
    const originalHtmlHeight = html.style.height;
    const originalBodyOverflow = body.style.overflow;
    const originalBodyHeight = body.style.height;

    html.style.overflow = 'hidden';
    html.style.height = '100%';
    body.style.overflow = 'hidden';
    body.style.height = '100%';

    return () => {
      html.style.overflow = originalHtmlOverflow;
      html.style.height = originalHtmlHeight;
      body.style.overflow = originalBodyOverflow;
      body.style.height = originalBodyHeight;
    };
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className={`flex h-screen h-[100dvh] overflow-hidden relative font-sans transition-colors duration-200 ${
      theme === 'light' ? 'bg-[#F8FAFC] text-[#0F172A]' : 'bg-[#09090B] text-[#EDEDED]'
    }`}>
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className={`fixed inset-0 backdrop-blur-sm z-20 md:hidden ${
            theme === 'light' ? 'bg-[#0F172A]/40' : 'bg-black/80'
          }`}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Desktop & Mobile */}
      <div className={`
        fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar 
          documents={documents}
          isDeleting={isDeleting}
          onDelete={deleteDoc}
          onNewChat={clearChat}
          selectedDocuments={selectedDocuments}
          setSelectedDocuments={setSelectedDocuments}
          sessions={sessions}
          currentSessionId={currentSessionId}
          onSelectSession={loadChat}
          onDeleteSession={deleteSession}
          onClose={() => setSidebarOpen(false)}
          onSettingsClick={() => setSettingsOpen(true)}
          theme={theme}
        />
      </div>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-h-0 w-full relative overflow-hidden transition-colors ${
        theme === 'light' ? 'bg-[#F8FAFC]' : 'bg-[#09090B]'
      }`}>
        {/* Subtle glow background */}
        {theme === 'dark' ? (
          <>
            <div className="absolute top-[-15%] right-[-10%] w-[380px] h-[380px] bg-zinc-800/20 blur-[130px] rounded-full pointer-events-none z-0" />
            <div className="absolute bottom-[-15%] left-[-10%] w-[380px] h-[380px] bg-zinc-800/15 blur-[130px] rounded-full pointer-events-none z-0" />
          </>
        ) : (
          <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-[#1557D6]/5 blur-[120px] rounded-full pointer-events-none z-0" />
        )}
        
        <Header 
          onUploadClick={() => setUploadModalOpen(true)} 
          toggleSidebar={toggleSidebar} 
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          selectedRetrievalMode={selectedRetrievalMode}
          setSelectedRetrievalMode={setSelectedRetrievalMode}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
        
        <ChatWindow 
          messages={messages} 
          isTyping={isTyping}
          onUploadClick={() => setUploadModalOpen(true)}
          documents={documents}
          theme={theme}
          onSendMessage={handleSendMessage}
        />
        
        <ChatInput 
          onSendMessage={handleSendMessage} 
          isTyping={isTyping} 
          ttsEnabled={ttsEnabled}
          onToggleTts={handleToggleTts}
          hasDocuments={documents.length > 0}
          onUploadClick={() => setUploadModalOpen(true)}
          theme={theme}
        />
      </div>

      {/* Modals */}
      <UploadModal 
        isOpen={uploadModalOpen} 
        onClose={() => setUploadModalOpen(false)}
        theme={theme}
      />
      <SettingsModal 
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        selectedRetrievalMode={selectedRetrievalMode}
        setSelectedRetrievalMode={setSelectedRetrievalMode}
        ttsEnabled={ttsEnabled}
        onToggleTts={handleToggleTts}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    </div>
  );
}
