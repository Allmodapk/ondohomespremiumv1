
import React, { useState, useEffect } from 'react';
import { Header, BottomNav } from './components/Navigation';
import { HomeView } from './screens/HomeView';
import { ListingsView } from './screens/ListingsView';
import { ListingDetailView } from './screens/ListingDetailView';
import { ListingFormView } from './screens/ListingFormView';
import { ProfileView } from './screens/ProfileView';
import { AIChatView } from './screens/AIChatView';
import { DashboardView } from './screens/DashboardView';
import { EditProfileView } from './screens/EditProfileView';
import { ChatListView } from './screens/ChatListView';
import { DirectChatView } from './screens/DirectChatView';
import { mockAuth, mockFirestore } from './services/mockFirebase';
import { Role, Property, User } from './types';
import { Loader2, MessageCircle, Sparkles, Crown, X, Clock, ShieldCheck, Users, Heart } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [view, setView] = useState<'main' | 'dashboard' | 'editProfile' | 'saved'>('main');
  const [role, setRole] = useState<Role>('Tenant');
  const [user, setUser] = useState<User | null>(null);
  const [listings, setListings] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [isListingFormOpen, setIsListingFormOpen] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showGoldModal, setShowGoldModal] = useState(false);
  const [limitMessage, setLimitMessage] = useState<string | null>(null);
  const [savedPropertyIds, setSavedPropertyIds] = useState<string[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  
  const [notifications] = useState([
    { id: '1', title: 'New tenant inquiry for your property', time: '2h ago', type: 'inquiry' as const, unread: true },
    { id: '2', title: 'Membership upgraded to Silver', time: '1d ago', type: 'membership' as const, unread: false },
    { id: '3', title: 'Welcome to Ondo Homes family!', time: '2d ago', type: 'system' as const, unread: false },
  ]);

  useEffect(() => {
    const init = async () => {
      const currentUser = mockAuth.checkSession();
      setUser(currentUser);
      const data = await mockFirestore.getListings();
      setListings(data);
      
      const saved = localStorage.getItem('ondo_saved_properties');
      if (saved) {
        setSavedPropertyIds(JSON.parse(saved));
      }
      
      setIsLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    localStorage.setItem('ondo_saved_properties', JSON.stringify(savedPropertyIds));
  }, [savedPropertyIds]);

  const handleToggleSave = (id: string) => {
    setSavedPropertyIds(prev => 
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
    );
  };

  const handleSignIn = async () => {
    setIsLoading(true);
    setTimeout(async () => {
      const u = await mockAuth.signInWithGoogle();
      setUser(u);
      setIsLoading(false);
    }, 800);
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    setTimeout(async () => {
      await mockAuth.signOut();
      setUser(null);
      setIsLoading(false);
      setView('main');
      setActiveTab('home');
    }, 600);
  };

  const handlePlusClick = () => {
    if (!user) {
      handleSignIn();
      return;
    }

    const userListingsCount = listings.filter(l => l.ownerId === user.id).length;
    if (user.membership === 'Silver' && userListingsCount >= 1) {
      setShowGoldModal(true);
      return;
    }
    
    setEditingProperty(null);
    setIsListingFormOpen(true);
  };

  const handleAIChatToggle = () => {
    setIsAIChatOpen(true);
  };

  const handleCreateOrUpdateListing = async (data: Omit<Property, 'id' | 'createdAt'>) => {
    setIsLoading(true);
    if (editingProperty) {
      await mockFirestore.updateListing(editingProperty.id, data);
      const updated = await mockFirestore.getListings();
      setListings(updated);
    } else {
      const newListing = await mockFirestore.addListing({ ...data, ownerId: user?.id || 'anonymous' });
      setListings(prev => [newListing, ...prev]);
    }
    setIsListingFormOpen(false);
    setEditingProperty(null);
    if (view === 'main') setActiveTab('listings');
    setIsLoading(false);
  };

  const handleUpdateProfile = async (data: Partial<User>) => {
    setIsLoading(true);
    const updated = await mockAuth.updateProfile(data);
    setUser(updated);
    setIsLoading(false);
    setView('main');
  };

  const handleToggleListingStatus = async (id: string, current: boolean) => {
    await mockFirestore.updateListing(id, { isActive: !current });
    const updated = await mockFirestore.getListings();
    setListings(updated);
  };

  const handleDeleteListing = async (id: string) => {
    if (confirm("Are you sure you want to delete this listing?")) {
      await mockFirestore.deleteListing(id);
      const updated = await mockFirestore.getListings();
      setListings(updated);
    }
  };

  if (isLoading) {
    return (
      <div className="mobile-container flex items-center justify-center bg-white">
        <div className="text-center">
          <Loader2 className="animate-spin text-orange-500 mx-auto mb-6" size={48} />
          <p className="text-gray-400 font-black text-[10px] uppercase tracking-[0.3em] animate-pulse">Ondo Experience</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mobile-container overflow-hidden bg-white">
      <Header notifications={notifications} />
      
      {limitMessage && (
        <div className="fixed top-24 left-6 right-6 z-[200] bg-gray-900 text-white p-4 rounded-2xl flex items-center gap-3 shadow-2xl animate-in slide-in-from-top duration-500">
          <Sparkles className="text-orange-500" />
          <p className="text-xs font-bold uppercase tracking-widest leading-relaxed">{limitMessage}</p>
        </div>
      )}

      <main className="h-full overflow-y-auto no-scrollbar">
        {view === 'main' && (
          <>
            {activeTab === 'home' && (
              <HomeView 
                role={role} 
                setRole={setRole} 
                onStartListing={handlePlusClick}
                onExploreListings={() => setActiveTab('listings')}
              />
            )}
            
            {activeTab === 'listings' && (
              <ListingsView 
                listings={listings.filter(l => l.isActive)} 
                onSelect={setSelectedProperty} 
                savedIds={savedPropertyIds}
                onToggleSave={handleToggleSave}
              />
            )}

            {activeTab === 'chat' && (
              <ChatListView onSelectChat={setActiveChatId} />
            )}

            {activeTab === 'profile' && (
              <ProfileView 
                user={user} 
                onSignIn={handleSignIn}
                onSignOut={handleSignOut} 
                onViewMyListings={() => setView('dashboard')}
                onEditProfile={() => setView('editProfile')}
                onViewSavedProperties={() => setView('saved')}
                savedCount={savedPropertyIds.length}
              />
            )}
          </>
        )}

        {view === 'dashboard' && user && (
          <DashboardView 
            user={user}
            listings={listings}
            onBack={() => setView('main')}
            onAddNew={handlePlusClick}
            onEdit={(p) => { setEditingProperty(p); setIsListingFormOpen(true); }}
            onDelete={handleDeleteListing}
            onToggleStatus={handleToggleListingStatus}
          />
        )}

        {view === 'editProfile' && user && (
          <EditProfileView 
            user={user}
            onBack={() => setView('main')}
            onSave={handleUpdateProfile}
          />
        )}

        {view === 'saved' && (
          <div className="pt-24 pb-32 h-full flex flex-col px-6 animate-in slide-in-from-right duration-500">
            <div className="flex items-center gap-4 mb-8">
              <button 
                onClick={() => setView('main')}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-800 shadow-sm border border-gray-100"
              >
                <X size={20} />
              </button>
              <h2 className="font-serif text-2xl font-bold text-gray-800">Saved Homes</h2>
            </div>
            {savedPropertyIds.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50">
                <Heart size={64} className="text-gray-300 mb-4" />
                <p className="font-bold text-gray-400">No saved homes yet</p>
                <button onClick={() => { setView('main'); setActiveTab('listings'); }} className="mt-4 text-orange-500 font-black text-[10px] uppercase tracking-widest">Explore Listings</button>
              </div>
            ) : (
              <ListingsView 
                listings={listings.filter(l => savedPropertyIds.includes(l.id))} 
                onSelect={setSelectedProperty} 
                savedIds={savedPropertyIds}
                onToggleSave={handleToggleSave}
              />
            )}
          </div>
        )}
      </main>

      {view === 'main' && (
        <BottomNav 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          onAIClick={handleAIChatToggle}
        />
      )}

      {selectedProperty && (
        <ListingDetailView 
          property={selectedProperty} 
          onBack={() => setSelectedProperty(null)} 
          isSaved={savedPropertyIds.includes(selectedProperty.id)}
          onToggleSave={() => handleToggleSave(selectedProperty.id)}
        />
      )}

      {activeChatId && (
        <DirectChatView chatId={activeChatId} onBack={() => setActiveChatId(null)} />
      )}

      {isListingFormOpen && (
        <ListingFormView 
          initialData={editingProperty}
          onCancel={() => { setIsListingFormOpen(false); setEditingProperty(null); }} 
          onComplete={handleCreateOrUpdateListing}
        />
      )}

      {isAIChatOpen && (
        <AIChatView onClose={() => setIsAIChatOpen(false)} />
      )}

      {/* Gold Modal Shared */}
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
            <div className="space-y-4 mb-8">
               {[
                { icon: Clock, label: "11 Months Validity", sub: "Synced with Rental Agreement" },
                { icon: ShieldCheck, label: "6-Month Tenant Replacement", sub: "Peace of mind guarantee" },
                { icon: Users, label: "Double Listing Capacity", sub: "List up to 2 properties" }
               ].map((item, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500 shrink-0">
                    <item.icon size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-black text-gray-800 leading-tight">{item.label}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{item.sub}</p>
                  </div>
                </div>
               ))}
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

export default App;
