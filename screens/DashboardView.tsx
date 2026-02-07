
import React from 'react';
import { ChevronLeft, Edit3, Plus, Trash2, MapPin, Building2, AlertCircle } from 'lucide-react';
import { Property, User } from '../types';

interface DashboardViewProps {
  user: User;
  listings: Property[];
  onBack: () => void;
  onEdit: (p: Property) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, current: boolean) => void;
  onAddNew: () => void;
}

const CustomToggle: React.FC<{ active: boolean; onToggle: () => void }> = ({ active, onToggle }) => (
  <button 
    onClick={(e) => { e.stopPropagation(); onToggle(); }}
    className={`relative w-[44px] h-[24px] rounded-full transition-colors duration-300 ${active ? 'bg-[#FF8A00]' : 'bg-[#E2E8F0]'}`}
  >
    <div 
      className={`absolute top-1 left-1 w-[16px] h-[16px] bg-white rounded-full shadow-sm transform transition-transform duration-300 ${active ? 'translate-x-5' : 'translate-x-0'}`}
    />
  </button>
);

export const DashboardView: React.FC<DashboardViewProps> = ({ 
  user, listings, onBack, onEdit, onDelete, onToggleStatus, onAddNew 
}) => {
  const userListings = listings.filter(l => l.ownerId === user.id);

  return (
    <div className="fixed inset-0 z-[120] bg-[#F8FAFC] overflow-y-auto max-w-[450px] mx-auto pb-24 animate-in slide-in-from-right duration-500">
      <header className="sticky top-0 z-10 glass px-6 py-4 flex items-center justify-between">
        <button onClick={onBack} className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-800 shadow-sm">
          <ChevronLeft size={24} />
        </button>
        <h2 className="font-serif text-xl font-bold text-gray-800">My Properties</h2>
        <button onClick={onAddNew} className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform">
          <Plus size={24} />
        </button>
      </header>

      <div className="p-6">
        {/* Membership Info Bar */}
        <div className="mb-8 p-5 bg-white rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Listings</p>
            <p className="text-xl font-black text-gray-800">
              {userListings.filter(l => l.isActive).length} / {user.membership === 'Silver' ? '1' : '2'}
            </p>
          </div>
          <div className="bg-orange-50 text-orange-600 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-wider border border-orange-100">
            {user.membership}
          </div>
        </div>

        {userListings.length === 0 ? (
          <div className="text-center py-20 flex flex-col items-center">
            <div className="w-32 h-32 bg-gray-100 rounded-[2.5rem] flex items-center justify-center text-gray-300 mb-6 border-2 border-dashed border-gray-200">
              <Building2 size={60} />
            </div>
            <p className="text-gray-500 font-bold max-w-[200px] leading-relaxed">Your dashboard is empty. Post a property to find a verified tenant!</p>
            <button 
              onClick={onAddNew}
              className="mt-8 text-orange-500 font-black uppercase tracking-widest flex items-center gap-2"
            >
              <Plus size={18} /> Post Now
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {userListings.map(p => (
              <div key={p.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 group transition-all">
                <div className="relative h-48">
                  <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button 
                      onClick={() => onDelete(p.id)}
                      className="w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-red-500 shadow-sm"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className={`absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center transition-opacity duration-300 ${p.isActive ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                    <div className="text-white text-center">
                      <AlertCircle size={32} className="mx-auto mb-2 text-white/50" />
                      <p className="font-black text-[10px] uppercase tracking-widest">Property Hidden</p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-gray-800 line-clamp-1">{p.title}</h3>
                      <p className="text-xs text-gray-400 font-medium flex items-center gap-1 mt-1">
                        <MapPin size={12} className="text-orange-500" /> {p.pincode}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <CustomToggle 
                        active={p.isActive} 
                        onToggle={() => onToggleStatus(p.id, p.isActive)} 
                      />
                      <span className="text-[8px] font-black uppercase text-gray-400 tracking-widest">
                        {p.isActive ? 'Live' : 'Hidden'}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-gray-50">
                    <button 
                      onClick={() => onEdit(p)}
                      className="flex-1 bg-gray-50 hover:bg-orange-50 py-3 rounded-2xl flex items-center justify-center gap-2 text-sm font-bold text-gray-600 hover:text-orange-500 transition-all"
                    >
                      <Edit3 size={16} /> Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
