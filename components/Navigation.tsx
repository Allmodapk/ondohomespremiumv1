import React, { useState } from 'react';
import { Home, List, MessageCircle, User, Bell, Target, X, Info, CheckCircle2, Crown, Sparkles } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  time: string;
  type: 'inquiry' | 'membership' | 'system';
  unread: boolean;
}

interface NavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onAIClick?: () => void;
}

export const Header: React.FC<{ notifications: Notification[] }> = ({ notifications }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 glass px-6 py-4 flex items-center justify-between max-w-[450px] mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white">
            <Target size={18} className="text-orange-500" />
          </div>
          <h1 className="font-serif text-xl font-bold text-gray-800 tracking-tight">ONDO HOMES</h1>
        </div>
        <button 
          onClick={() => setShowNotifications(true)}
          className="relative w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-600 shadow-sm border border-gray-100 hover:bg-white transition-all active:scale-95"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-orange-500 border-2 border-white rounded-full"></span>
          )}
        </button>
      </header>

      {/* Notifications Drawer */}
      {showNotifications && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-20">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setShowNotifications(false)}></div>
          <div className="relative w-full max-w-[400px] bg-white/80 backdrop-blur-[24px] rounded-[3rem] p-8 shadow-2xl border border-white/50 animate-in slide-in-from-top-4 duration-500 overflow-hidden">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-gray-800 tracking-tight">Recent Activity</h3>
              <button 
                onClick={() => setShowNotifications(false)}
                className="w-10 h-10 bg-gray-100/50 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-200 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto no-scrollbar">
              {notifications.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-4 text-gray-300">
                    <CheckCircle2 size={32} />
                  </div>
                  <p className="text-gray-500 font-bold">You're all caught up!</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <div key={n.id} className="group relative flex gap-4 p-4 bg-white/40 rounded-[2rem] border border-white/60 hover:bg-white/60 transition-all cursor-pointer">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                      n.type === 'inquiry' ? 'bg-blue-50 text-blue-500' : 
                      n.type === 'membership' ? 'bg-orange-50 text-orange-500' : 'bg-gray-50 text-gray-500'
                    }`}>
                      {n.type === 'inquiry' ? <Info size={20} /> : 
                       n.type === 'membership' ? <Crown size={20} /> : <Target size={20} />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800 leading-tight pr-4">{n.title}</p>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">{n.time}</p>
                    </div>
                    {n.unread && (
                      <div className="absolute top-4 right-4 w-2 h-2 bg-orange-500 rounded-full"></div>
                    )}
                  </div>
                ))
              )}
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-100/50">
              <button 
                onClick={() => setShowNotifications(false)}
                className="w-full py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]"
              >
                Close Alerts
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const BottomNav: React.FC<NavProps> = ({ activeTab, setActiveTab, onAIClick }) => {
  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'listings', icon: List, label: 'Explore' },
    { id: 'ai', icon: Sparkles, label: 'AI Bot', special: true },
    { id: 'chat', icon: MessageCircle, label: 'Chat' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-t border-gray-100 flex items-center justify-between px-4 pb-4 pt-2 max-w-[450px] mx-auto rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => tab.id === 'ai' ? onAIClick?.() : setActiveTab(tab.id)}
          className={`flex flex-col items-center justify-center ${tab.special ? 'relative -top-8' : 'flex-1'} transition-all`}
        >
          {tab.special ? (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center text-white shadow-2xl shadow-orange-500/20 border-[6px] border-white transform active:scale-90 transition-all mb-1">
                <Sparkles size={32} className="text-orange-500" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-orange-500">Ask AI</span>
            </div>
          ) : (
            <>
              <div className={`p-2 rounded-xl transition-all ${activeTab === tab.id ? 'bg-orange-50' : ''}`}>
                <tab.icon
                  size={20}
                  className={activeTab === tab.id ? 'text-orange-500' : 'text-gray-400'}
                />
              </div>
              <span className={`text-[10px] mt-1 font-semibold ${activeTab === tab.id ? 'text-gray-900' : 'text-gray-400'}`}>
                {tab.label}
              </span>
            </>
          )}
        </button>
      ))}
    </nav>
  );
};