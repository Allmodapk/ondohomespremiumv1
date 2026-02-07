
import React, { useState } from 'react';
import { ChevronLeft, Save, Lock, User, Phone, Mail } from 'lucide-react';
import { User as UserType } from '../types';

interface EditProfileViewProps {
  user: UserType;
  onBack: () => void;
  onSave: (data: Partial<UserType>) => void;
}

export const EditProfileView: React.FC<EditProfileViewProps> = ({ user, onBack, onSave }) => {
  const [formData, setFormData] = useState({
    username: user.username || '',
    phone: user.phone || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-[120] bg-white overflow-y-auto max-w-[450px] mx-auto pb-24 animate-in slide-in-from-right duration-500">
      <header className="sticky top-0 z-10 glass px-6 py-4 flex items-center justify-between">
        <button onClick={onBack} className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-800">
          <ChevronLeft size={24} />
        </button>
        <h2 className="font-serif text-xl font-bold text-gray-800">Edit Profile</h2>
        <div className="w-10"></div>
      </header>

      <form onSubmit={handleSubmit} className="p-6 space-y-8 mt-4">
        {/* Profile Pic Visual */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <img src={user.photoURL} alt={user.name} className="w-24 h-24 rounded-full border-4 border-white shadow-xl" />
            <div className="absolute -bottom-1 -right-1 bg-gray-100 p-2 rounded-full border border-white">
              <Lock size={12} className="text-gray-400" />
            </div>
          </div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-4">Photo Synced from Google</p>
        </div>

        <div className="space-y-6">
          {/* Read Only Fields */}
          <div className="opacity-60">
            <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
              <Mail size={12} /> Email Address (Read Only)
            </label>
            <div className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl text-gray-500 font-medium">
              {user.email}
            </div>
          </div>

          <div className="opacity-60">
            <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
              <User size={12} /> Full Name (Read Only)
            </label>
            <div className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl text-gray-500 font-medium">
              {user.name}
            </div>
          </div>

          {/* Editable Fields */}
          <div>
            <label className="flex items-center gap-2 text-[10px] font-black text-gray-600 uppercase tracking-widest mb-2">
              <User size={12} className="text-orange-500" /> Username
            </label>
            <input 
              type="text" 
              value={formData.username}
              onChange={(e) => setFormData(p => ({ ...p, username: e.target.value }))}
              placeholder="Pick a unique handle"
              className="w-full bg-white border border-gray-100 p-4 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none shadow-sm font-bold text-gray-800"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-[10px] font-black text-gray-600 uppercase tracking-widest mb-2">
              <Phone size={12} className="text-orange-500" /> Phone Number
            </label>
            <input 
              type="tel" 
              value={formData.phone}
              onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))}
              placeholder="Enter 10 digit mobile"
              className="w-full bg-white border border-gray-100 p-4 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none shadow-sm font-bold text-gray-800"
            />
          </div>
        </div>

        <button 
          type="submit"
          className="w-full bg-orange-500 text-white py-5 rounded-[2.5rem] font-black text-lg shadow-xl shadow-orange-100 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
        >
          <Save size={20} />
          Save Changes
        </button>
      </form>
    </div>
  );
};
