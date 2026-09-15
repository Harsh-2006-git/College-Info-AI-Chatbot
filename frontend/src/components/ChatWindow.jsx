import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import EmptyState from './EmptyState';

export default function ChatWindow({ messages, isTyping, onUploadClick, documents = [], theme = 'light', onSendMessage }) {
  const containerRef = useRef(null);

  // Auto-scroll to bottom of the chat window container
  useEffect(() => {
    if (messages.length > 0 && containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto min-h-0">
        <EmptyState 
          onUploadClick={onUploadClick} 
          hasDocuments={documents.length > 0} 
          theme={theme}
          onSendMessage={onSendMessage}
        />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto min-h-0 scroll-smooth">
      <div className="flex flex-col pb-6">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} theme={theme} />
        ))}
        
        {isTyping && (
          <div className={`py-3.5 md:py-4.5 flex w-full transition-colors ${
            theme === 'light' 
              ? 'bg-white border-y border-[#E2E8F0] shadow-sm' 
              : 'bg-[#0B0B0E] border-y border-[#1A1A20] shadow-sm'
          }`}>
            <div className="max-w-4xl w-full mx-auto md:mx-0 md:ml-12 flex px-4 gap-3 md:gap-5">
              <div className="shrink-0 mt-0.5">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden border-2 border-[#1557D6] flex items-center justify-center bg-white shadow-[0_2px_12px_rgba(21,87,214,0.35)]">
                  <img src="/assets/robot.png" alt="AI Assistant" className="w-full h-full object-cover p-0.5" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <TypingIndicator theme={theme} />
              </div>
            </div>
          </div>
        )}
        <div className="h-4" />
      </div>
    </div>
  );
}
