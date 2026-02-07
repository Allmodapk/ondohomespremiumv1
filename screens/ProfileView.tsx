import React, { useState, useEffect } from 'react';
import { 
  User, 
  ShieldCheck, 
  ChevronRight, 
  Crown, 
  CheckCircle2, 
  Sparkles, 
  Users, 
  ArrowUpRight,
  List,
  Heart,
  X,
  Clock
} from 'lucide-react';
import { User as UserType } from '../types';

interface ProfileViewProps {
  user: UserType | null;
  onSignIn: () => void;
  onSignOut: () => void;
  onViewMyListings: () => void;
  onEditProfile: () => void;
  onViewSavedProperties: () => void;
  savedCount: number;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ 
  user, onSignIn, onSignOut, onViewMyListings, onEditProfile, onViewSavedProperties, savedCount
}) => {
  const [showGoldModal, setShowGoldModal] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(false);

  useEffect(() => {
    if (user) {
      const hasBeenWelcomed = localStorage.getItem('ondo_welcomed');
      if (!hasBeenWelcomed) {
        setIsFirstTime(true);
        localStorage.setItem('ondo_welcomed', 'true');
      }
    } else {
      setIsFirstTime(false);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="pt-24 pb-24 h-full flex flex-col px-10 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="relative w-32 h-32 mx-auto mb-10">
          <div className="absolute inset-0 bg-orange-100 rounded-[2.5rem] blur-2xl opacity-50 animate-pulse"></div>
          <div className="relative w-full h-full bg-white rounded-[2.5rem] flex items-center justify-center text-gray-300 shadow-xl border border-gray-50">
            <User size={60} />
          </div>
        </div>
        
        <h3 className="font-serif text-3xl font-bold mb-4 text-gray-800 tracking-tight">Your Identity</h3>
        <p className="text-gray-500 mb-12 leading-relaxed font-medium">Manage your listings, saved properties, and profile settings in one place.</p>
        <button onClick={onSignIn} className="w-full flex items-center justify-center gap-4 bg-white border border-gray-100 py-5 px-6 rounded-[2rem] shadow-xl shadow-gray-200/50 hover:shadow-2xl active:scale-[0.98] transition-all">
          <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" alt="Google" className="w-6 h-6" />
          <span className="text-gray-700 font-bold text-lg">Sign in with Google</span>
        </button>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-32 h-full flex flex-col px-6 bg-[#FAFBFF] overflow-y-auto no-scrollbar relative">
      
      {isFirstTime && (
        <div className="mb-6 p-6 bg-gradient-to-r from-orange-500 to-orange-400 rounded-[2.5rem] text-white shadow-xl shadow-orange-100 animate-in slide-in-from-top-4 duration-700">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-xl font-black tracking-tight">Congratulations!</h4>
              <p className="text-white/80 text-sm font-medium mt-1">Welcome to the Ondo Homes family. Your journey to a broker-free home starts now.</p>
            </div>
            <Sparkles className="text-white/40" size={24} />
          </div>
        </div>
      )}

      <div className="flex items-center gap-6 mb-10">
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-tr from-orange-400 to-yellow-400 rounded-full blur-sm opacity-30"></div>
          <img src={user.photoURL} alt={user.name} className="relative w-24 h-24 rounded-full border-4 border-white shadow-2xl" />
          <div className="absolute -bottom-1 -right-1 bg-gray-400 text-white p-1.5 rounded-full border-2 border-white shadow-lg">
            <ShieldCheck size={14} />
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-800 tracking-tight">{user.name}</h2>
          <div className="flex items-center gap-2 mt-1">
             <div className="flex items-center gap-1.5 bg-orange-50 text-orange-600 px-3 py-1 rounded-full border border-orange-100">
               <Crown size={12} />
               <span className="text-[10px] font-black uppercase tracking-wider">{user.membership} Member</span>
             </div>
          </div>
        </div>
      </div>

      <div className="mb-10 animate-in fade-in duration-700">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Your Unlocked Benefits</p>
        <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-100 space-y-4">
          {[
            "Basic search & direct chat",
            "Verified tenant inquiries",
            "Zero brokers – ever"
          ].map((benefit, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <CheckCircle2 size={18} className="text-orange-500 flex-shrink-0" />
              <span className="text-sm font-semibold text-gray-700">{benefit}</span>
            </div>
          ))}
          {user.membership === 'Silver' && (
            <div className="pt-4 border-t border-gray-50">
              <button 
                onClick={() => setShowGoldModal(true)}
                className="text-teal-600 text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all"
              >
                Upgrade to Gold for even more peace of mind <ArrowUpRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mb-10">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Your Activity</p>
        <div className="space-y-3">
          <button onClick={onEditProfile} className="w-full flex items-center justify-between p-5 bg-white rounded-[2rem] border border-gray-50 shadow-sm hover:bg-gray-50 transition-all group">
            <div className="flex items-center gap-4 text-gray-700">
              <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:text-orange-500 shadow-sm transition-colors">
                <User size={22} />
              </div>
              <span className="font-bold">Edit Profile</span>
            </div>
            <ChevronRight size={20} className="text-gray-300" />
          </button>

          <button onClick={onViewMyListings} className="w-full flex items-center justify-between p-5 bg-white rounded-[2rem] border border-gray-50 shadow-sm hover:bg-gray-50 transition-all group">
            <div className="flex items-center gap-4 text-gray-700">
              <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:text-orange-500 shadow-sm transition-colors">
                <List size={22} />
              </div>
              <span className="font-bold">My Listings</span>
            </div>
            <ChevronRight size={20} className="text-gray-300" />
          </button>

          <button 
            onClick={onViewSavedProperties}
            className="w-full flex items-center justify-between p-5 bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:bg-gray-50 transition-all group"
          >
            <div className="flex items-center gap-4 text-gray-700">
              <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:text-orange-500 shadow-sm transition-colors">
                <Heart size={22} />
              </div>
              <div className="flex flex-col items-start">
                <span className="font-bold">Saved Properties</span>
                {savedCount > 0 && <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">{savedCount} Bookmarked</span>}
              </div>
            </div>
            <ChevronRight size={20} className="text-gray-300" />
          </button>
        </div>
      </div>

      <div className="pb-10">
        <button 
          onClick={onSignOut}
          className="w-full flex items-center justify-center gap-2 py-4 text-red-500 font-black text-[10px] uppercase tracking-[0.3em] opacity-60 hover:opacity-100 transition-opacity"
        >
          Sign Out of Account
        </button>
      </div>

      {showGoldModal && (
        <div className="fixed inset-0 z-[300] flex items-end justify-center px-4 pb-10">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowGoldModal(false)}></div>
          <div className="relative w-full max-w-[400px] bg-white/90 backdrop-blur-[16px] rounded-[3rem] p-8 shadow-2xl border border-white/50 animate-in slide-in-from-bottom duration-500">
            <button onClick={() => setShowGoldModal(false)} className="absolute top-6 right-6 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
              <X size={20} />
            </button>
            <div className="text-center mb-8 pt-4">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                <Crown size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-black text-gray-800 tracking-tight">Ondo Gold</h3>
              <div className="flex flex-col items-center mt-2">
                <span className="text-3xl font-black text-gray-900">₹2,999</span>
                <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest mt-1">Saves you 50% in Brokerage!</span>
              </div>
            </div>
            <button className="w-full bg-orange-500 text-white py-5 rounded-[2rem] font-black text-lg shadow-xl shadow-orange-100 active:scale-[0.98] transition-all">
              Unlock Gold Access
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
