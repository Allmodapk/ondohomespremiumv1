import React from 'react';
import { Search, ChevronRight, User as UserIcon, MessageSquare } from 'lucide-react';

interface ChatPreview {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  avatar: string;
  unread: boolean;
  propertyTitle: string;
}

interface ChatListViewProps {
  onSelectChat: (id: string) => void;
}

export const ChatListView: React.FC<ChatListViewProps> = ({ onSelectChat }) => {
  const mockChats: ChatPreview[] = [
    {
      id: 'chat-1',
      name: 'Rahul Sharma',
      lastMessage: 'Is the apartment still available for visit tomorrow?',
      time: '12:45 PM',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100',
      unread: true,
      propertyTitle: 'Spacious 2BHK in Bangalore Center'
    },
    {
      id: 'chat-2',
      name: 'Priya Patel',
      lastMessage: 'I have shared the advance payment screenshot. Please confirm.',
      time: 'Yesterday',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100',
      unread: false,
      propertyTitle: 'Luxury Villa - Electronic City'
    },
    {
      id: 'chat-3',
      name: 'Amit Kumar',
      lastMessage: 'Can you please share the exact location of the property?',
      time: 'Mon',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100',
      unread: false,
      propertyTitle: 'Modern Studio Apartment near Metro'
    }
  ];

  return (
    <div className="pt-24 pb-32 h-full flex flex-col px-6 animate-in fade-in duration-500 bg-white">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-serif text-3xl font-bold text-gray-800">Messages</h2>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Direct Owner & Tenant Connection</p>
        </div>
      </div>

      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
        <input 
          type="text" 
          placeholder="Search conversations..."
          className="w-full bg-gray-50 border border-gray-100 pl-12 pr-6 py-4 rounded-[2rem] outline-none focus:ring-2 focus:ring-orange-500/20 font-medium text-sm transition-all"
        />
      </div>

      <div className="space-y-4 overflow-y-auto no-scrollbar flex-1 pb-4">
        {mockChats.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
            <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center text-gray-200 mb-6">
              <MessageSquare size={40} />
            </div>
            <p className="font-bold text-gray-400">No active chats</p>
            <p className="text-[10px] font-black uppercase tracking-widest mt-2">Browse listings to connect with owners</p>
          </div>
        ) : (
          mockChats.map((chat) => (
            <button 
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className="w-full flex gap-4 p-5 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-all group relative active:scale-[0.98]"
            >
              {chat.unread && (
                <div className="absolute top-5 right-5 w-2.5 h-2.5 bg-orange-500 rounded-full border-2 border-white"></div>
              )}
              <div className="relative shrink-0">
                <img src={chat.avatar} alt={chat.name} className="w-14 h-14 rounded-full border-2 border-white shadow-sm object-cover" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h4 className={`text-sm font-bold truncate ${chat.unread ? 'text-gray-900' : 'text-gray-700'}`}>{chat.name}</h4>
                  <span className="text-[10px] text-gray-400 font-bold shrink-0">{chat.time}</span>
                </div>
                <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1 truncate">{chat.propertyTitle}</p>
                <p className={`text-xs truncate ${chat.unread ? 'text-gray-800 font-bold' : 'text-gray-500'}`}>{chat.lastMessage}</p>
              </div>
              <div className="flex items-center text-gray-200 group-hover:text-orange-500 transition-colors">
                <ChevronRight size={20} />
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};