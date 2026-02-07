import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, Send, Phone, Info, MoreVertical, X, Check } from 'lucide-react';

interface DirectChatViewProps {
  chatId: string;
  onBack: () => void;
}

export const DirectChatView: React.FC<DirectChatViewProps> = ({ chatId, onBack }) => {
  const [messages, setMessages] = useState([
    { id: 1, role: 'other', text: 'Hey, I saw your property listing on Electronic City. It looks stunning!', time: '12:30 PM' },
    { id: 2, role: 'other', text: 'Is it still available for visit this weekend? I am very interested.', time: '12:31 PM' },
    { id: 3, role: 'me', text: 'Hello! Yes, it is currently available. Saturday afternoon would be perfect for a walkthrough.', time: '12:45 PM' },
    { id: 4, role: 'other', text: 'That works for me. Can you please share the exact location or pincode?', time: '12:46 PM' },
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { id: Date.now(), role: 'me', text: input.trim(), time }]);
    setInput('');
  };

  return (
    <div className="fixed inset-0 z-[120] bg-white flex flex-col max-w-[450px] mx-auto animate-in slide-in-from-right duration-500 shadow-2xl">
      <header className="px-6 py-4 glass flex items-center justify-between border-b border-gray-100 z-10">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 -ml-2 bg-gray-50 rounded-full text-gray-800 active:scale-90 transition-all">
            <ChevronLeft size={20} />
          </button>
          <div className="relative">
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100" alt="Avatar" className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" />
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-800">Rahul Sharma</h3>
            <span className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Active Now</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <button className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-600 active:scale-95 transition-all">
            <Phone size={18} />
          </button>
          <button className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-600 active:scale-95 transition-all">
            <MoreVertical size={18} />
          </button>
        </div>
      </header>

      <div className="bg-orange-50/50 p-3 flex items-center justify-center gap-2 border-b border-orange-100/50">
        <Info size={12} className="text-orange-400" />
        <p className="text-[9px] font-black text-orange-600 uppercase tracking-widest">Property: Spacious 2BHK in Bangalore Center</p>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar bg-[#FAFBFF]">
        <div className="text-center mb-4">
          <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] bg-white px-5 py-2 rounded-full border border-gray-100 shadow-sm">Conversation Started</span>
        </div>
        
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'me' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] flex flex-col ${m.role === 'me' ? 'items-end' : 'items-start'}`}>
              <div className={`p-4 rounded-[2rem] text-sm font-medium leading-relaxed shadow-sm ${
                m.role === 'me' 
                ? 'bg-orange-500 text-white rounded-tr-none' 
                : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
              }`}>
                {m.text}
              </div>
              <div className="flex items-center gap-1.5 mt-1 px-2">
                <span className="text-[9px] text-gray-400 font-bold">{m.time}</span>
                {m.role === 'me' && <Check size={10} className="text-orange-500" />}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 bg-white border-t border-gray-100 pb-10">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Write a message..."
            className="w-full bg-gray-50 border border-gray-100 pl-6 pr-16 py-5 rounded-[2.5rem] outline-none focus:ring-2 focus:ring-orange-500/10 transition-all font-bold text-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            className="absolute right-2 top-2 w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-orange-200 active:scale-90 transition-transform"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};