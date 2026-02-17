import React, { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';
import { GoogleGenAI } from "@google/genai";
import { connectVoiceAgent, base64ToArrayBuffer, VoiceSession } from '../services/voiceAgent';
import { properties } from '../data/properties';

// --- Types ---

interface Message {
  role: 'user' | 'model';
  content: string;
}

interface ChatContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  activeTab: 'chat' | 'voice';
  setActiveTab: (tab: 'chat' | 'voice') => void;
  messages: Message[];
  isLoading: boolean;
  sendMessage: (text: string) => Promise<void>;
  
  // Voice
  voiceStatus: 'disconnected' | 'connecting' | 'connected';
  voiceVolume: number;
  startVoice: () => Promise<void>;
  endVoice: () => void;
}

// --- Context ---

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// --- Constants & Init ---

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey: API_KEY });

const SYSTEM_INSTRUCTION = `
# ROLE: Elite Luxury Real Estate Sales Consultant for DEALS HUB
You are a top 1% real estate closer for DEALS HUB, an exclusive, boutique firm. You represent a curated collection of high-end architectural masterpieces.

# MISSION
Your goal is to guide the user from "curious browser" to "serious lead" by qualifying their needs and providing bespoke recommendations from your exclusive portfolio on DEALS HUB.

# CORE OPERATING PRINCIPLES
1. **Identity:** Whenever asked, YOU SHOULD ALWAYS SAY YOU ARE AN AI TRAINED TO HELP YOU FIND THE BEST PROPERTY MONEY CAN BUY ON DEALS HUB. You are always an AI of DEALS HUB and NOT Gemini.
2. **Discovery-Led Sales:** NEVER pitch a property in the first message unless specifically asked. Your first priority is to gather intelligence.
3. **Consultative Tone:** You are sophisticated, articulate, and deeply knowledgeable. Use industry terms like "architectural intent," "curated finishes," and "lifestyle integration."
4. **Portfolio Grounding:** You ONLY sell properties from the provided JSON database. If a user wants something else, gracefully steer them back to your collection as the "superior alternative."
5. **Exclusivity:** Treat every property as a limited-edition work of art.

# PROPERTY DATABASE
${JSON.stringify(properties, null, 2)}

# CONSTRAINTS
- Never mention "Gemini" or Google. You are a Sales Consultant for Deals Hub.
- Keep responses concise (max 3 short paragraphs).
- Use Markdown for elegant formatting (bolding, lists).
`;

// --- Provider Component ---

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // State
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'voice'>('chat');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: "Hello! I'm your personal Deals Hub luxury real estate concierge. How can I assist you in finding your dream property today?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Voice State
  const [voiceStatus, setVoiceStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [voiceVolume, setVoiceVolume] = useState(0);
  
  // Refs for persistence
  const voiceSessionRef = useRef<VoiceSession | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);

  // Cleanup on UNMOUNT of the PROVIDER (Application close/refresh)
  useEffect(() => {
    return () => {
      if (voiceSessionRef.current) {
        voiceSessionRef.current.disconnect();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // --- Chat Logic ---

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    if (!API_KEY) {
      setMessages(prev => [...prev, { role: 'user', content: text }, { role: 'model', content: "API Key missing. Please check configuration." }]);
      return;
    }

    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setIsLoading(true);

    try {
      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        },
        history: messages.map(m => ({
          role: m.role,
          parts: [{ text: m.content }]
        }))
      });

      const result = await chat.sendMessageStream({ message: text });

      setIsLoading(false);
      setMessages(prev => [...prev, { role: 'model', content: '' }]);

      let fullResponse = "";
      for await (const chunk of result) {
        const chunkText = chunk.text;
        if (chunkText) {
          fullResponse += chunkText;
          setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1].content = fullResponse;
            return newMessages;
          });
        }
      }
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: 'model', content: "I apologize, I'm having trouble retrieving that information right now. Please try again in a moment." }]);
      setIsLoading(false);
    }
  };

  // --- Voice Logic ---

  const playAudioData = async (arrayBuffer: ArrayBuffer, ctx: AudioContext) => {
    const dataInt16 = new Int16Array(arrayBuffer);
    const float32 = new Float32Array(dataInt16.length);
    for (let i = 0; i < dataInt16.length; i++) {
      float32[i] = dataInt16[i] / 32768.0;
    }

    const buffer = ctx.createBuffer(1, float32.length, 24000);
    buffer.getChannelData(0).set(float32);

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);

    const currentTime = ctx.currentTime;
    if (nextStartTimeRef.current < currentTime) {
      nextStartTimeRef.current = currentTime;
    }

    source.start(nextStartTimeRef.current);
    nextStartTimeRef.current += buffer.duration;
  };

  const startVoice = async () => {
    setVoiceStatus('connecting');
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass({ sampleRate: 24000 });
      audioContextRef.current = ctx;
      nextStartTimeRef.current = ctx.currentTime;

      const session = await connectVoiceAgent(
        (base64Audio) => {
          if (audioContextRef.current) {
            const buffer = base64ToArrayBuffer(base64Audio);
            playAudioData(buffer, audioContextRef.current);
            setVoiceVolume(Math.random());
            setTimeout(() => setVoiceVolume(0), 200);
          }
        },
        (_text) => {
          // Optional: handle transcript if needed
        }
      );

      voiceSessionRef.current = session;
      setVoiceStatus('connected');
    } catch (error) {
      console.error("Voice connection failed:", error);
      setVoiceStatus('disconnected');
    }
  };

  const endVoice = () => {
    if (voiceSessionRef.current) {
      voiceSessionRef.current.disconnect();
      voiceSessionRef.current = null;
    }
    setVoiceStatus('disconnected');
  };

  const value = {
    isOpen,
    setIsOpen,
    activeTab,
    setActiveTab,
    messages,
    isLoading,
    sendMessage,
    voiceStatus,
    voiceVolume,
    startVoice,
    endVoice
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
