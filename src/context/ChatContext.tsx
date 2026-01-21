import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ChatMessage, ChatStats, parseWhatsAppChat, calculateStats } from '@/lib/chatParser';

interface ChatContextType {
  messages: ChatMessage[];
  stats: ChatStats | null;
  isProcessing: boolean;
  error: string | null;
  selectedParticipant: string | null;
  processChat: (text: string) => Promise<void>;
  setSelectedParticipant: (participant: string | null) => void;
  clearChat: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [stats, setStats] = useState<ChatStats | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedParticipant, setSelectedParticipant] = useState<string | null>(null);

  const processChat = async (text: string): Promise<void> => {
    setIsProcessing(true);
    setError(null);
    
    try {
      // Simulate async processing for smooth UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const parsedMessages = parseWhatsAppChat(text);
      
      if (parsedMessages.length === 0) {
        throw new Error('No messages found. Please ensure this is a valid WhatsApp chat export.');
      }
      
      const calculatedStats = calculateStats(parsedMessages);
      
      setMessages(parsedMessages);
      setStats(calculatedStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process chat');
      setMessages([]);
      setStats(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setStats(null);
    setSelectedParticipant(null);
    setError(null);
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        stats,
        isProcessing,
        error,
        selectedParticipant,
        processChat,
        setSelectedParticipant,
        clearChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
