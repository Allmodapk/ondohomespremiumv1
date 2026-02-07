
import React, { useState, useRef, useEffect } from 'react';
import { Send, Target, Sparkles, User, Loader2, X } from 'lucide-react';
import { ondoAssistant } from '../services/gemini';

interface AIChatViewProps {
  onClose: () => void;
}

export const AIChatView: React.FC<AIChatViewProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: "Hello! I'm OndoBot. Looking for a new home or need help listing your property? I can help you find zero-brokerage deals!" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    const response = await ondoAssistant(userMsg);
    setIsTyping(false);
    setMessages(prev => [...prev, { role: 'bot', text: response }]);
  };

  return (
    <div className="fixed inset-0 z-[150] bg-white flex flex-col max-w-[450px] mx-auto animate-in slide-in-from-bottom duration-500">
      <header className="px-6 py-6 border-b border-gray-100 flex items-center justify-between glass">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-orange-500 shadow-lg shadow-orange-100">
            <Target size={24} />
          </div>
          <div>
            <h2 className="font-serif text-xl font-bold text-gray-800">Ondo Assistant</h2>
            <div className="flex items-center gap-1.5 text-xs text-green-500 font-bold">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> AI Powered
            </div>
          </div>
        </div>
        <button onClick={onClose} className="p-2 bg-gray-50 rounded-full text-gray-400">
          <X size={24} />
        </button>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-3xl text-sm font-medium leading-relaxed ${
              m.role === 'user' ? 'bg-orange-500 text-white rounded-tr-none shadow-lg shadow-orange-200' : 'bg-gray-100 text-gray-800 rounded-tl-none'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-4 rounded-3xl rounded-tl-none flex items-center gap-2">
              <Loader2 className="animate-spin text-orange-500" size={16} />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Bot is thinking</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-gray-50 pb-10">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Ask anything about Ondo Homes..."
            className="w-full bg-gray-50 border border-gray-100 pl-6 pr-16 py-5 rounded-[2rem] outline-none focus:ring-2 focus:ring-orange-500 transition-all shadow-sm font-medium"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            className="absolute right-2 top-2 w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-orange-200 active:scale-90 transition-transform"
          >
            <Send size={20} />
          </button>
        </div>
        <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-gray-300 font-bold uppercase tracking-[0.2em]">
          <Sparkles size={12} /> Powered by Gemini 3 Pro
        </div>
      </div>
    </div>
  );
};
