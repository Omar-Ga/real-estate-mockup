import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleGenAI, LiveServerMessage, Modality, FunctionDeclaration, Type } from "@google/genai";

// --- GLOBAL CONFIGURATION ---
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- TYPES ---

export interface DocSection {
  id: string;
  title: string;
  content: React.ReactNode;
}

export interface CodeSnippet {
  language: 'typescript' | 'bash' | 'json';
  code: string;
  filename?: string;
}

export enum NavigationItemType {
  Header = 'HEADER',
  Link = 'LINK'
}

export interface NavigationItem {
  type: NavigationItemType;
  label: string;
  href?: string; // Only for links
}

// --- UTILS ---

function floatTo16BitPCM(input: Float32Array): ArrayBuffer {
  const output = new Int16Array(input.length);
  for (let i = 0; i < input.length; i++) {
    const s = Math.max(-1, Math.min(1, input[i]));
    output[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
  }
  return output.buffer;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

// --- DATA ---

const REAL_ESTATE_LISTINGS = [
  { id: '1', title: 'Modern Downtown Loft', price: '$450,000', location: 'Downtown', features: ['2 Bed', '2 Bath', 'City View', 'Open Plan'] },
  { id: '2', title: 'Cozy Suburban Home', price: '$650,000', location: 'Maplewood', features: ['3 Bed', '2 Bath', 'Large Garden', 'Garage'] },
  { id: '3', title: 'Luxury Waterfront Villa', price: '$2,500,000', location: 'Bay Area', features: ['5 Bed', '4 Bath', 'Infinity Pool', 'Private Dock'] },
  { id: '4', title: 'Historic Brownstone', price: '$850,000', location: 'Old Town', features: ['4 Bed', '3 Bath', 'Exposed Brick', 'Roof Deck'] },
];

const SYSTEM_INSTRUCTION = `You are a professional and friendly Real Estate Agent for 'Gemini Estates'.
Your goal is to help users find their dream home from our exclusive list.

AVAILABLE LISTINGS (Use this data strictly):
${JSON.stringify(REAL_ESTATE_LISTINGS, null, 2)}

RULES:
1. Always be polite and enthusiastic.
2. Only recommend properties from the AVAILABLE LISTINGS list.
3. If the user asks for a feature we don't have, politely inform them.
4. Keep responses concise (under 3 sentences) unless asked for details.
5. If a user wants to view a house, ask for their preferred date and time.
`;

const INSTALL_CODE: CodeSnippet = {
  language: 'bash',
  code: 'npm install @google/genai'
};

const SETUP_CODE: CodeSnippet = {
  language: 'typescript',
  filename: 'services/gemini.ts',
  code: `import { GoogleGenAI } from "@google/genai";

// Initialize the client
// CRITICAL: process.env.API_KEY must be defined in your environment
export const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });`
};

const CONTEXT_PREP_CODE: CodeSnippet = {
  language: 'typescript',
  filename: 'utils/context.ts',
  code: `// Example: Fetching listings from your database
const getSystemInstruction = (listings: any[]) => {
  const listingsText = listings.map(l => 
    \`- ID: \${l.id}, Type: \${l.type}, Price: \${l.price}, Location: \${l.location}, Features: \${l.features.join(', ')}\`
  ).join('\\n');

  return \`
    You are a professional Real Estate Agent for Prestige Homes.
    Your goal is to help users find their dream home, schedule viewings, and answer questions about the market.
    
    Here is the live data of available properties you can recommend:
    \${listingsText}
    
    RULES:
    1. Only recommend properties from this list.
    2. Be polite, professional, and concise.
    3. If a user wants to book a viewing, ask for their preferred date and time.
  \`;
};`
};

const CHAT_IMPL_CODE: CodeSnippet = {
  language: 'typescript',
  filename: 'components/ChatBot.tsx',
  code: `import { GoogleGenAI } from "@google/genai";
import { useState } from "react";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const ChatBot = () => {
  const [messages, setMessages] = useState<{role: string, text: string}[]>([]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    // 1. Add user message to UI
    const newMessages = [...messages, { role: 'user', text: input }];
    setMessages(newMessages);
    setInput("");

    // 2. Create Chat Session
    // We recreate the chat or maintain a reference to 'chat' object
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview', // Best balance of speed/cost
      config: {
        systemInstruction: "You are a Real Estate Agent...", // Inject context here
      },
      history: newMessages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }))
    });

    // 3. Stream Response
    const result = await chat.sendMessageStream({ message: input });
    
    let botResponse = "";
    // Placeholder for bot message
    setMessages(prev => [...prev, { role: 'model', text: '' }]);

    for await (const chunk of result) {
      // Direct text access as per SDK
      const text = chunk.text; 
      if (text) {
        botResponse += text;
        // Update last message
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1].text = botResponse;
          return updated;
        });
      }
    }
  };

  return (
    // ... UI Render Logic
    <div>{/* UI Implementation */}</div>
  );
};`
};

const LIVE_VOICE_CODE: CodeSnippet = {
  language: 'typescript',
  filename: 'services/voiceAgent.ts',
  code: `import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const connectVoiceAgent = async (
  onAudioData: (audioBuffer: AudioBuffer) => void,
  onTranscript: (text: string) => void
) => {
  const inputAudioContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });
  
  // Get Microphone Stream
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  
  const sessionPromise = ai.live.connect({
    model: 'gemini-2.5-flash-native-audio-preview-12-2025',
    config: {
      responseModalities: [Modality.AUDIO], // MUST be strictly [Modality.AUDIO]
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
      },
      systemInstruction: "You are a helpful Real Estate voice assistant...",
    },
    callbacks: {
      onopen: () => {
        // Setup Audio Processor to stream mic data to Gemini
        const source = inputAudioContext.createMediaStreamSource(stream);
        const processor = inputAudioContext.createScriptProcessor(4096, 1, 1);
        
        processor.onaudioprocess = (e) => {
          const inputData = e.inputBuffer.getChannelData(0);
          // Convert Float32 to PCM16
          const pcmData = floatTo16BitPCM(inputData);
          const base64Data = arrayBufferToBase64(pcmData);
          
          sessionPromise.then(session => {
            session.sendRealtimeInput({
              media: {
                mimeType: 'audio/pcm;rate=16000',
                data: base64Data
              }
            });
          });
        };
        
        source.connect(processor);
        processor.connect(inputAudioContext.destination);
      },
      onmessage: async (msg: LiveServerMessage) => {
        // Handle Audio Output
        const audioData = msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
        if (audioData) {
           // Decode and play (implementation required for decodeAudioData)
           // onAudioData(decodedBuffer);
        }
        
        // Handle Transcriptions (if enabled in config)
        if (msg.serverContent?.modelTurn?.parts[0]?.text) {
           // onTranscript(text);
        }
      }
    }
  });

  return sessionPromise;
};

// Helper: Convert Float32Array to Int16Array Buffer
function floatTo16BitPCM(input: Float32Array) {
  const output = new Int16Array(input.length);
  for (let i = 0; i < input.length; i++) {
    const s = Math.max(-1, Math.min(1, input[i]));
    output[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
  }
  return output.buffer;
}

// Helper: ArrayBuffer to Base64
function arrayBufferToBase64(buffer: ArrayBuffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}`
};

const TOOLS_CODE: CodeSnippet = {
  language: 'typescript',
  filename: 'config/tools.ts',
  code: `import { FunctionDeclaration, Type } from "@google/genai";

const scheduleViewingTool: FunctionDeclaration = {
  name: 'scheduleViewing',
  description: 'Schedule a physical viewing for a property.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      propertyId: {
        type: Type.STRING,
        description: 'The ID of the property to view'
      },
      date: {
        type: Type.STRING,
        description: 'Preferred date in YYYY-MM-DD format'
      },
      time: {
        type: Type.STRING,
        description: 'Preferred time in HH:MM format'
      }
    },
    required: ['propertyId', 'date']
  }
};

// Usage in chat config:
// config: { tools: [{ functionDeclarations: [scheduleViewingTool] }] }`
};

// --- COMPONENTS ---

interface CodeBlockProps {
  snippet: CodeSnippet;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ snippet }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-6 rounded-lg overflow-hidden border border-slate-800 bg-slate-900 shadow-xl">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800/50 border-b border-slate-800">
        <span className="text-xs font-mono text-slate-400">
          {snippet.filename || snippet.language}
        </span>
        <button
          onClick={handleCopy}
          className="text-xs font-medium text-slate-400 hover:text-white transition-colors"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div className="p-4 overflow-x-auto custom-scrollbar">
        <pre className="text-sm leading-relaxed text-slate-300">
          <code>{snippet.code}</code>
        </pre>
      </div>
    </div>
  );
};

interface SidebarProps {
  items: NavigationItem[];
  activeSection: string;
}

const Sidebar: React.FC<SidebarProps> = ({ items, activeSection }) => {
  return (
    <nav className="w-64 flex-shrink-0 hidden lg:block h-screen sticky top-0 overflow-y-auto py-8 pl-8 pr-4 border-r border-slate-800/50 custom-scrollbar">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-white tracking-tight">
          <span className="text-primary-400">Gemini</span> Real Estate
        </h1>
        <p className="text-xs text-slate-500 mt-1">Integration Documentation</p>
      </div>
      
      <ul className="space-y-1">
        {items.map((item, idx) => {
          if (item.type === NavigationItemType.Header) {
            return (
              <li key={idx} className="mt-8 mb-2 px-2">
                <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
                  {item.label}
                </h3>
              </li>
            );
          }
          
          const isActive = activeSection === item.href?.replace('#', '');
          
          return (
            <li key={idx}>
              <a
                href={item.href}
                className={`block px-2 py-1.5 text-sm rounded-md transition-colors ${
                  isActive
                    ? 'bg-primary-500/10 text-primary-400 font-medium'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

const ChatDemo: React.FC = () => {
  const [messages, setMessages] = useState<{role: string, text: string}[]>([
    { role: 'model', text: 'Hello! I am your Gemini Estate agent. I can help you find listings in Downtown, Maplewood, or the Bay Area. How can I help you today?' }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // Initialize chat with history
      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        },
        history: messages.map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        }))
      });

      const result = await chat.sendMessageStream({ message: input });
      
      setLoading(false);
      setMessages(prev => [...prev, { role: 'model', text: '' }]);

      let fullResponse = "";
      for await (const chunk of result) {
        const text = chunk.text;
        if (text) {
          fullResponse += text;
          setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1].text = fullResponse;
            return newMessages;
          });
        }
      }
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error. Please try again." }]);
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col h-[500px] shadow-2xl">
      <div className="bg-slate-800/80 p-4 border-b border-slate-700 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-white font-medium">Gemini Estate Agent</span>
        </div>
        <span className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded">gemini-3-flash-preview</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-primary-600 text-white rounded-br-none' 
                : 'bg-slate-800 text-slate-200 rounded-bl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 rounded-2xl rounded-bl-none px-4 py-3 flex gap-1">
              <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-75"></div>
              <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-150"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-slate-800/50 border-t border-slate-800">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about our listings..."
            className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 placeholder-slate-500"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-primary-600 hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

const VoiceDemo: React.FC = () => {
  const [active, setActive] = useState(false);
  const [status, setStatus] = useState("Ready to connect");
  const [volume, setVolume] = useState(0);
  
  // Refs for cleanup
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const isConnectedRef = useRef(false);

  const startSession = async () => {
    setStatus("Requesting microphone...");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const inputContext = new AudioContextClass({ sampleRate: 16000 });
      const outputContext = new AudioContextClass({ sampleRate: 24000 });
      
      audioContextRef.current = inputContext;
      outputContextRef.current = outputContext;

      setStatus("Connecting to Gemini Live...");

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
          },
          systemInstruction: SYSTEM_INSTRUCTION,
        },
        callbacks: {
          onopen: () => {
            setStatus("Connected! Speak now.");
            setActive(true);
            isConnectedRef.current = true;
            
            // Audio Input Pipeline
            const source = inputContext.createMediaStreamSource(stream);
            const processor = inputContext.createScriptProcessor(4096, 1, 1);
            
            processor.onaudioprocess = (e) => {
              if (!isConnectedRef.current) return;
              
              const inputData = e.inputBuffer.getChannelData(0);
              
              // Simple volume visualization
              let sum = 0;
              for(let i=0; i<inputData.length; i++) sum += inputData[i]*inputData[i];
              const rms = Math.sqrt(sum/inputData.length);
              setVolume(Math.min(rms * 10, 1)); // Scale for UI

              const pcmData = floatTo16BitPCM(inputData);
              const base64Data = arrayBufferToBase64(pcmData);
              
              sessionPromise.then(session => {
                session.sendRealtimeInput({
                  media: {
                    mimeType: 'audio/pcm;rate=16000',
                    data: base64Data
                  }
                });
              });
            };

            source.connect(processor);
            processor.connect(inputContext.destination);
            
            sourceRef.current = source;
            processorRef.current = processor;
          },
          onmessage: async (msg: LiveServerMessage) => {
            const audioData = msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData) {
               const audioBuffer = await decodeAudioData(
                 base64ToArrayBuffer(audioData),
                 outputContext,
                 24000
               );
               playAudio(audioBuffer, outputContext);
            }
          },
          onclose: () => {
            setStatus("Disconnected");
            setActive(false);
          },
          onerror: (err) => {
            console.error(err);
            setStatus("Error occurred");
            stopSession();
          }
        }
      });
      sessionPromiseRef.current = sessionPromise;

    } catch (error) {
      console.error("Connection failed", error);
      setStatus("Failed to connect");
      setActive(false);
    }
  };

  const stopSession = () => {
    isConnectedRef.current = false;
    
    // Close session if possible
    sessionPromiseRef.current?.then(session => {
       try { session.close(); } catch(e){}
    });

    // Stop tracks
    streamRef.current?.getTracks().forEach(track => track.stop());
    
    // Disconnect nodes
    sourceRef.current?.disconnect();
    processorRef.current?.disconnect();
    
    // Close contexts
    audioContextRef.current?.close();
    outputContextRef.current?.close();

    setActive(false);
    setStatus("Ready to connect");
    setVolume(0);
  };

  // Helper to decode PCM
  async function decodeAudioData(
    arrayBuffer: ArrayBuffer,
    ctx: AudioContext,
    sampleRate: number
  ): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(arrayBuffer);
    const float32 = new Float32Array(dataInt16.length);
    for(let i=0; i<dataInt16.length; i++) {
        float32[i] = dataInt16[i] / 32768.0;
    }
    const buffer = ctx.createBuffer(1, float32.length, sampleRate);
    buffer.getChannelData(0).set(float32);
    return buffer;
  }

  // Helper to play audio
  function playAudio(buffer: AudioBuffer, ctx: AudioContext) {
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    
    const currentTime = ctx.currentTime;
    // Ensure we schedule in the future
    if (nextStartTimeRef.current < currentTime) {
        nextStartTimeRef.current = currentTime;
    }
    
    source.start(nextStartTimeRef.current);
    nextStartTimeRef.current += buffer.duration;
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden">
      {/* Background Glow */}
      <div className={`absolute inset-0 bg-primary-500/10 blur-[100px] transition-opacity duration-1000 ${active ? 'opacity-100' : 'opacity-0'}`} />
      
      <div className="relative z-10 mb-8">
        <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${active ? 'bg-primary-500/20 ring-4 ring-primary-500/30' : 'bg-slate-800'}`}>
          {active ? (
             <div className="flex gap-1 items-center h-16">
               {[1,2,3,4,5].map((i) => (
                  <div 
                    key={i} 
                    className="w-2 bg-primary-400 rounded-full transition-all duration-75"
                    style={{ 
                      height: `${Math.max(10, Math.random() * volume * 100 + 20)}%`,
                      opacity: 0.8
                    }}
                  />
               ))}
             </div>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          )}
        </div>
      </div>

      <h3 className="text-xl font-semibold text-white mb-2 relative z-10">{active ? 'Listening...' : 'Start Voice Conversation'}</h3>
      <p className="text-slate-400 mb-8 h-6 relative z-10 text-sm font-mono">{status}</p>

      <button
        onClick={active ? stopSession : startSession}
        className={`relative z-10 px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
          active 
            ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/50' 
            : 'bg-primary-600 text-white hover:bg-primary-500 shadow-lg shadow-primary-500/20'
        }`}
      >
        {active ? 'End Call' : 'Start Call'}
      </button>
    </div>
  );
};

// --- MAIN APP ---

const App = () => {
  const [activeSection, setActiveSection] = useState('intro');

  const navItems: NavigationItem[] = [
    { type: NavigationItemType.Header, label: 'Live Demos' },
    { type: NavigationItemType.Link, label: 'Interactive Chat', href: '#demo-chat' },
    { type: NavigationItemType.Link, label: 'Live Voice Agent', href: '#demo-voice' },
    { type: NavigationItemType.Header, label: 'Documentation' },
    { type: NavigationItemType.Link, label: 'Introduction', href: '#intro' },
    { type: NavigationItemType.Link, label: 'Installation', href: '#install' },
    { type: NavigationItemType.Link, label: 'Configuration', href: '#config' },
    { type: NavigationItemType.Header, label: 'Implementation' },
    { type: NavigationItemType.Link, label: 'Context Injection', href: '#context' },
    { type: NavigationItemType.Link, label: 'Chat Code', href: '#chat-code' },
    { type: NavigationItemType.Link, label: 'Voice Code', href: '#voice-code' },
    { type: NavigationItemType.Link, label: 'Tools Code', href: '#tools-code' },
  ];

  // Intersection Observer to update active section on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -60% 0px' } 
    );

    document.querySelectorAll('section[id]').forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-300">
      <Sidebar items={navItems} activeSection={activeSection} />

      <main className="flex-1 max-w-4xl mx-auto px-6 py-12 lg:px-12 overflow-y-auto">
        {/* Header */}
        <header className="mb-16 border-b border-slate-800 pb-8">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-500/10 text-primary-400 text-xs font-medium mb-4 border border-primary-500/20">
            Gemini 2.5 & 3.0 Compatible
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
            Building a <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-indigo-400">Real Estate AI Agent</span>
          </h1>
          <p className="text-xl text-slate-400 leading-relaxed max-w-2xl">
            A complete guide to implementing context-aware Chat and Voice agents for real estate platforms using the Google GenAI SDK.
          </p>
        </header>

        {/* Content Sections */}
        <div className="space-y-20">
          
          {/* LIVE DEMOS SECTION */}
          <section id="demo-chat" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-8 bg-primary-500 rounded-full"></span>
              Interactive Chat Demo
            </h2>
            <p className="text-slate-400 mb-6">
              Try asking about the properties available in our mock database below. For example: 
              <span className="text-primary-400 italic"> "Do you have anything with a pool?"</span>
            </p>
            
            <div className="grid lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-lg p-4 text-xs font-mono text-slate-400 overflow-y-auto h-[500px] custom-scrollbar">
                <div className="uppercase tracking-wider text-slate-500 font-bold mb-2">Context Data (Live)</div>
                <pre>{JSON.stringify(REAL_ESTATE_LISTINGS, null, 2)}</pre>
              </div>
              <div className="lg:col-span-2">
                <ChatDemo />
              </div>
            </div>
          </section>

          <section id="demo-voice" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-8 bg-purple-500 rounded-full"></span>
              Live Voice Agent Demo
            </h2>
            <p className="text-slate-400 mb-6">
              Connect to the Gemini Live API for a real-time conversation. Ensure your microphone is enabled.
            </p>
            <div className="max-w-xl mx-auto">
              <VoiceDemo />
            </div>
          </section>

          <hr className="border-slate-800" />

          {/* DOCUMENTATION SECTION */}
          <section id="intro" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-white mb-4">Introduction</h2>
            <p className="text-slate-400 mb-4 leading-7">
              Real estate requires immediate, accurate, and personalized responses. By integrating Gemini, you can offer:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-400 mb-6 marker:text-primary-500">
              <li><strong>Context-Aware Chat:</strong> Answering questions about specific listings on your site.</li>
              <li><strong>Live Voice Interaction:</strong> A low-latency conversational agent that can "talk" to clients.</li>
              <li><strong>Actionable Tools:</strong> Automatically scheduling viewings or filtering searches.</li>
            </ul>
          </section>

          <section id="install" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-white mb-4">Installation</h2>
            <p className="text-slate-400 mb-4">
              Start by installing the official Google GenAI SDK.
            </p>
            <CodeBlock snippet={INSTALL_CODE} />
          </section>

          <section id="config" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-white mb-4">Configuration & API Key</h2>
            <div className="bg-amber-900/20 border border-amber-900/50 rounded-lg p-4 mb-6">
              <p className="text-amber-200/80 text-sm">
                <strong>Security Note:</strong> Never expose your API key in client-side code unless restricted by domain headers in Google Cloud Console.
              </p>
            </div>
            <CodeBlock snippet={SETUP_CODE} />
          </section>

          <section id="context" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-white mb-4">Injecting "Full Context"</h2>
            <p className="text-slate-400 mb-4">
              The key to a "smart" agent is the <code>systemInstruction</code>. You must dynamically generate this string based on the real estate data available on your website. 
            </p>
            <CodeBlock snippet={CONTEXT_PREP_CODE} />
          </section>

          <section id="chat-code" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-white mb-4">Implementing Chat (Streaming)</h2>
            <p className="text-slate-400 mb-4">
              Use <code>gemini-3-flash-preview</code> for high-speed interactions.
            </p>
            <CodeBlock snippet={CHAT_IMPL_CODE} />
          </section>

          <section id="voice-code" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-white mb-4">Voice Bot (Gemini Live API)</h2>
            <p className="text-slate-400 mb-4">
              For a truly immersive experience, use the Live API over WebSockets.
            </p>
            <CodeBlock snippet={LIVE_VOICE_CODE} />
          </section>

          <section id="tools-code" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-white mb-4">Function Calling (Tools)</h2>
            <p className="text-slate-400 mb-4">
              Enable the bot to take action. Define tools that the model can call when a user expresses intent.
            </p>
            <CodeBlock snippet={TOOLS_CODE} />
          </section>

          <footer className="mt-20 pt-10 border-t border-slate-800 text-center text-slate-500 text-sm">
            <p>Generated for Senior Frontend Implementation • Gemini API 2025</p>
          </footer>
        </div>
      </main>
    </div>
  );
};

// --- RENDER ---

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);