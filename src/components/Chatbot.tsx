import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { MessageCircle, X, Send, Bot, Minimize2, Mic, Phone, PhoneOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from '../context/ChatContext';

const Chatbot: React.FC = () => {
  const {
    isOpen,
    setIsOpen,
    activeTab,
    setActiveTab,
    messages,
    isLoading,
    sendMessage,
    voiceStatus,
    startVoice,
    endVoice
  } = useChat();

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && activeTab === 'chat') {
      scrollToBottom();
    }
  }, [messages, isOpen, activeTab]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const text = input;
    setInput(''); // Clear input immediately
    await sendMessage(text);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-8rem)] bg-white dark:bg-charcoal border border-stone-200 dark:border-stone-800 shadow-2xl rounded-2xl flex flex-col overflow-hidden z-50 font-sans"
          >
            {/* Header */}
            <div className="bg-charcoal text-white p-4 flex justify-between items-center shadow-md">
              <div className="flex items-center gap-2">
                <div className="bg-industrial p-1.5 rounded-full">
                  <Bot size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Luxury Concierge</h3>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${voiceStatus === 'connected' ? 'bg-green-500 animate-pulse' : 'bg-primary-400'}`}></span>
                    <p className="text-xs text-stone-400">Deals Hub AI</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                  aria-label="Minimize chat"
                >
                  <Minimize2 size={18} />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/50">
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex-1 py-3 text-sm font-medium transition-colors relative ${activeTab === 'chat' ? 'text-industrial' : 'text-stone-500 hover:text-stone-300'}`}
              >
                <div className="flex items-center justify-center gap-2">
                  <MessageCircle size={16} />
                  Chat
                </div>
                {activeTab === 'chat' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-industrial" />}
              </button>
              <button
                onClick={() => setActiveTab('voice')}
                className={`flex-1 py-3 text-sm font-medium transition-colors relative ${activeTab === 'voice' ? 'text-industrial' : 'text-stone-500 hover:text-stone-300'}`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Mic size={16} />
                  Live Voice
                </div>
                {activeTab === 'voice' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-industrial" />}
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden relative bg-stone-50 dark:bg-[#1a1a1a]">

              {/* CHAT TAB */}
              {activeTab === 'chat' && (
                <div className="absolute inset-0 flex flex-col">
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg, index) => (
                      <div
                        key={index}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-2xl p-3 text-sm shadow-sm ${msg.role === 'user'
                            ? 'bg-charcoal text-white rounded-br-none'
                            : 'bg-white dark:bg-stone-800 text-charcoal dark:text-stone-200 rounded-bl-none border border-stone-100 dark:border-stone-700'
                            }`}
                        >
                          {msg.role === 'model' ? (
                            <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0.5">
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {msg.content}
                              </ReactMarkdown>
                            </div>
                          ) : (
                            <p>{msg.content}</p>
                          )}
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-white dark:bg-stone-800 rounded-2xl rounded-bl-none p-4 shadow-sm border border-stone-100 dark:border-stone-700">
                          <div className="flex gap-1.5">
                            <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  <div className="p-4 bg-white dark:bg-charcoal border-t border-stone-200 dark:border-stone-800">
                    <div className="flex gap-2 items-end bg-stone-100 dark:bg-stone-900 rounded-xl p-2 border border-transparent focus-within:border-stone-300 dark:focus-within:border-stone-700 transition-colors">
                      <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Type a message..."
                        className="flex-1 bg-transparent border-none focus:ring-0 resize-none max-h-32 text-sm text-charcoal dark:text-white placeholder:text-stone-400 py-2 px-1"
                        rows={1}
                        style={{ minHeight: '40px' }}
                      />
                      <button
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        className="p-2 bg-charcoal hover:bg-black text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-0.5"
                        aria-label="Send message"
                      >
                        <Send size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* VOICE TAB */}
              {activeTab === 'voice' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-stone-900 to-charcoal">

                  {/* Visualizer */}
                  <div className="relative mb-8">
                    <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${voiceStatus === 'connected' ? 'bg-industrial/10 ring-2 ring-industrial/20' : 'bg-stone-800'}`}>
                      {voiceStatus === 'connected' ? (
                        <div className="flex gap-1 items-center h-12">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <motion.div
                              key={i}
                              className="w-1.5 bg-industrial rounded-full"
                              animate={{
                                height: [10, Math.max(10, Math.random() * 40 + 10), 10]
                              }}
                              transition={{
                                repeat: Infinity,
                                duration: 0.5,
                                ease: "easeInOut",
                                delay: i * 0.1
                              }}
                            />
                          ))}
                        </div>
                      ) : (
                        <Mic size={32} className="text-stone-500" />
                      )}
                    </div>
                    {/* Pulse Effect */}
                    {voiceStatus === 'connected' && (
                      <motion.div
                        className="absolute inset-0 rounded-full border border-industrial"
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      />
                    )}
                  </div>

                  {/* Status Text */}
                  <h3 className="text-xl font-bold text-white mb-2">
                    {voiceStatus === 'connected' ? 'Listening...' :
                      voiceStatus === 'connecting' ? 'Connecting...' : 'Voice Assistant'}
                  </h3>
                  <p className="text-stone-400 text-center mb-8 text-sm max-w-[200px]">
                    {voiceStatus === 'connected'
                      ? 'Speak naturally to inquire about properties.'
                      : 'Start a live two-way conversation with our AI agent.'}
                  </p>

                  {/* Action Button */}
                  <button
                    onClick={voiceStatus === 'connected' ? endVoice : startVoice}
                    disabled={voiceStatus === 'connecting'}
                    className={`flex items-center gap-2 px-8 py-3 rounded-full font-semibold transition-all transform active:scale-95 shadow-lg ${voiceStatus === 'connected'
                      ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/50'
                      : 'bg-industrial text-white hover:bg-orange-600'
                      }`}
                  >
                    {voiceStatus === 'connected' ? (
                      <>
                        <PhoneOff size={18} />
                        End Call
                      </>
                    ) : (
                      <>
                        <Phone size={18} />
                        Start Call
                      </>
                    )}
                  </button>
                </div>
              )}

            </div>

            {/* Footer */}
            <div className="bg-white dark:bg-charcoal px-4 py-2 border-t border-stone-200 dark:border-stone-800">
              <p className="text-[10px] text-center text-stone-400">
                Powered by Deals Hub AI. Latency: Ultra-low.
              </p>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-industrial text-white rounded-full shadow-xl flex items-center justify-center z-50 hover:bg-orange-600 transition-colors"
          aria-label="Open chat"
        >
          <MessageCircle size={28} />
        </motion.button>
      )}

      {/* Close Button when open */}
      {isOpen && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(false)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-charcoal text-white rounded-full shadow-xl flex items-center justify-center z-40 hover:bg-black transition-colors"
          aria-label="Close chat"
        >
          <X size={28} />
        </motion.button>
      )}
    </>
  );
};

export default Chatbot;