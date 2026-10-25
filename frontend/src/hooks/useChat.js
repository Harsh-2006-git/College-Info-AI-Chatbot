import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { chatAPI } from '../services/api';

// Simple ID generator since we didn't install uuid
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

export function cleanMessageContent(raw) {
  if (!raw || typeof raw !== 'string') return '';
  let text = raw.trim();
  
  // Check if content was wrapped in JSON with an "answer" field
  if (text.startsWith('{') && text.includes('"answer"')) {
    try {
      const parsed = JSON.parse(text);
      if (parsed.answer) text = parsed.answer;
    } catch {
      const match = text.match(/"answer"\s*:\s*"([\s\S]*)/);
      if (match) {
        let content = match[1];
        const endMatch = content.match(/([\s\S]*?)(?:",\s*"(?:confidence|sources_used|suggested_followups|citations)"|"\s*\}\s*$)/);
        if (endMatch) content = endMatch[1];
        else content = content.replace(/"\s*\}?\s*$/, '');
        text = content;
      }
    }
  }

  // Handle literal escaped newlines and tabs if present as string literals
  if (text.includes('\\n') || text.includes('\\t') || text.includes('\\"')) {
    text = text
      .replace(/\\n/g, '\n')
      .replace(/\\t/g, '\t')
      .replace(/\\"/g, '"')
      .replace(/\\\//g, '/');
  }

  // Clean unneeded markdown backslash escapes like \* or \- or \_ or non-breaking hyphens
  text = text
    .replace(/\\([*_\-[\]()#`])/g, '$1')
    .replace(/\u2011/g, '-');
  
  return text.trim();
}

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);

  const chatMutation = useMutation({
    mutationFn: (data) => chatAPI.send(data.question, data.documentIds, data.sessionId, data.model, data.retrievalMode),
  });

  const loadChat = useCallback(async (sessionId) => {
    try {
      const data = await chatAPI.get(sessionId);
      setCurrentSessionId(data.id);
      
      // Map backend messages to frontend format
      const formattedMessages = data.messages.map(msg => ({
        id: msg.id,
        role: msg.role === 'assistant' ? 'ai' : 'user',
        content: cleanMessageContent(msg.content),
        sources: msg.sources || [],
        analytics: msg.analytics || null,
        timestamp: msg.created_at
      }));
      
      setMessages(formattedMessages);
    } catch (error) {
      console.error("Failed to load chat:", error);
    }
  }, []);

  const sendMessage = useCallback(async (content, selectedModel, selectedRetrievalMode = "history_aware") => {
    // 1. Add user message instantly
    const userMessage = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);

    try {
      // 2. Send to API
      const response = await chatMutation.mutateAsync({
        question: content,
        documentIds: selectedDocuments.length > 0 ? selectedDocuments : undefined,
        sessionId: currentSessionId,
        model: selectedModel,
        retrievalMode: selectedRetrievalMode
      });

      // Update session ID if it was newly created
      if (!currentSessionId && response.session_id) {
        setCurrentSessionId(response.session_id);
      }

      // 3. Add AI response
      const aiMessage = {
        id: generateId(),
        role: 'ai',
        content: cleanMessageContent(response.answer),
        sources: response.sources || [],
        processingTime: response.processing_time_ms,
        analytics: response.analytics || null,
        confidence: response.confidence || null,
        suggestedFollowups: response.suggested_followups || null,
        timestamp: new Date().toISOString(),
        isNew: true
      };

      setMessages(prev => [...prev, aiMessage]);
      return response.session_id;
    } catch (error) {
      console.error("Failed to send message:", error);
      const errorMessage = {
        id: generateId(),
        role: 'error',
        content: error.response?.data?.detail || "An error occurred while generating the answer.",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
      return null;
    }
  }, [messages, selectedDocuments, currentSessionId, chatMutation]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setCurrentSessionId(null);
  }, []);

  return {
    messages,
    sendMessage,
    isTyping: chatMutation.isPending,
    selectedDocuments,
    setSelectedDocuments,
    clearChat,
    currentSessionId,
    loadChat
  };
}
