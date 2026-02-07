
import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, MapPin, Bed, Bath, Globe, ExternalLink, Loader2, X, Check, Users, Heart } from 'lucide-react';
import { Property } from '../types';
import { searchNearbyLocations } from '../services/gemini';

interface ListingsViewProps {
  listings: Property[];
  onSelect: (p: Property) => void;
  savedIds?: string[];
  onToggleSave?: (id: string) => void;
}

export const ListingsView: React.FC<ListingsViewProps> = ({ listings, onSelect, savedIds = [], onToggleSave }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [isSearchingMap, setIsSearchingMap] = useState(false);
  const [mapResults, setMapResults] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);

  // Advanced Filters State
  const [filters, setFilters] = useState({
    budget: 150000,
    bhk: [] as string[],
    type: [] as string[],
    furnishing: [] as string[],
    preference: [] as string[]
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setUserLocation({ lat: 12.9716, lng: 77.5946 }) // Default Bangalore
    );
  }, []);

  const handleMapSearch = async () => {
    if (!searchQuery || !userLocation) return;
    setIsSearchingMap(true);
    const results = await searchNearbyLocations(searchQuery, userLocation);
    setMapResults(results);
    setIsSearchingMap(false);
  };

  const toggleFilter = (category: 'bhk' | 'type' | 'furnishing' | 'preference', value: string) => {
    setFilters(prev => {
      const current = prev[category];
      const next = current.includes(value) 
        ? current.filter(item => item !== value)
        : [...current, value];
      return { ...prev, [category]: next };
    });
  };

  const filteredListings = listings.filter(l => {
    const matchesSearch = l.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          l.pincode.includes(searchQuery) ||
                          l.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBudget = parseInt(l.monthlyRent) <= filters.budget;
    const matchesBHK = filters.bhk.length === 0 || filters.bhk.includes(l.bhk);
    const matchesType = filters.type.length === 0 || filters.type.includes(l.type);
    const matchesFurnishing = filters.furnishing.length === 0 || filters.furnishing.includes(l.furnishing);
    const matchesPreference = filters.preference.length === 0 || filters.preference.includes(l.preferredTenant);

    return matchesSearch && matchesBudget && matchesBHK && matchesType && matchesFurnishing && matchesPreference;
  });

  return (
    <div className="pt-20 pb-24 h-full flex flex-col relative">
      {/* Search Header */}
      <div className="px-6 mb-6 flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search city, area or pincode..."
            className="w-full bg-white border border-gray-100 pl-12 pr-12 py-4 rounded-[2.5rem] focus:ring-2 focus:ring-orange-500 outline-none shadow-sm font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleMapSearch()}
          />
          <button 
            onClick={handleMapSearch}
            disabled={isSearchingMap}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-orange-50 text-orange-600 rounded-2xl hover:bg-orange-100 transition-colors"
          >
            {isSearchingMap ? <Loader2 className="animate-spin" size={18} /> : <Globe size={18} />}
          </button>
        </div>
        <button 
          onClick={() => setShowFilters(true)}
          className="w-14 h-14 glass rounded-[2.5rem] flex items-center justify-center text-orange-500 shadow-sm border border-white/40 shrink-0 active:scale-95 transition-all"
        >
          <SlidersHorizontal size={22} />
        </button>
      </div>

      {mapResults && (
        <div className="mx-6 mb-6 p-5 bg-blue-50 border border-blue-100 rounded-[2.5rem] animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2 mb-2 text-blue-800 font-black text-[10px] uppercase tracking-wider">
            <MapPin size={14} /> Maps Grounding Result
          </div>
          <p className="text-xs text-blue-700 leading-relaxed mb-4">{mapResults.text}</p>
          <div className="flex flex-wrap gap-2">
            {mapResults.links?.map((chunk: any, i: number) => (
              chunk.maps && (
                <a key={i} href={chunk.maps.uri} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-white px-4 py-2 rounded-full text-[10px] font-black text-blue-600 shadow-sm border border-blue-50 uppercase tracking-widest">
                  {chunk.maps.title || 'View Area'} <ExternalLink size={10} />
                </a>
              )
            ))}
          </div>
          <button onClick={() => setMapResults(null)} className="mt-4 text-[10px] font-black text-blue-400 uppercase tracking-widest">Clear Results</button>
        </div>
      )}

      {/* Main Listings Scroll Area */}
      <div className="flex-1 overflow-y-auto px-6 space-y-6 no-scrollbar pb-10">
        <div className="flex items-center justify-between px-2">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{filteredListings.length} Properties found</p>
        </div>

        {filteredListings.length === 0 ? (
          <div className="text-center py-24 px-10">
            <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center text-gray-200 mx-auto mb-6">
               <Search size={44} />
            </div>
            <h3 className="font-serif text-xl font-bold text-gray-800 mb-2">No Matching Homes</h3>
            <p className="text-gray-400 text-xs font-medium leading-relaxed">Try adjusting your filters or search for a different area.</p>
            <button 
              className="mt-8 text-orange-500 font-black text-[10px] uppercase tracking-[0.2em]" 
              onClick={() => { setSearchQuery(''); setFilters({ budget: 150000, bhk: [], type: [], furnishing: [], preference: [] }); }}
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          filteredListings.map((p) => {
            const isSaved = savedIds.includes(p.id);
            return (
              <div 
                key={p.id} 
                onClick={() => onSelect(p)}
                className="bg-white rounded-[2.5rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 group active:scale-[0.98] transition-all"
              >
                <div className="relative h-60">
                  <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  
                  {/* Save Button */}
                  {onToggleSave && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); onToggleSave(p.id); }}
                      className={`absolute top-4 right-4 w-10 h-10 glass rounded-full flex items-center justify-center shadow-sm transition-all active:scale-90 z-10 ${isSaved ? 'text-orange-500 bg-orange-50/50' : 'text-gray-800'}`}
                    >
                      <Heart size={20} fill={isSaved ? "currentColor" : "none"} />
                    </button>
                  )}

                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase text-gray-800 tracking-widest border border-white/40">
                    {p.type}
                  </div>
                  <div className="absolute bottom-4 left-4">
                     <div className="bg-orange-500 text-white px-5 py-2.5 rounded-[1.5rem] shadow-xl shadow-orange-500/20 font-black text-lg">
                      ₹{parseInt(p.monthlyRent).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-1.5 text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">
                    <MapPin size={12} className="text-orange-500" />
                    <span>{p.pincode}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-5 line-clamp-1 font-serif tracking-tight">{p.title}</h3>
                  <div className="flex items-center gap-3">
                     <div className="bg-gray-50 px-4 py-2.5 rounded-2xl text-[11px] font-black text-gray-700 flex items-center gap-2 border border-gray-100">
                       <Bed size={14} className="text-orange-500" /> {p.bhk}
                     </div>
                     <div className="bg-gray-50 px-4 py-2.5 rounded-2xl text-[11px] font-black text-gray-700 flex items-center gap-2 border border-gray-100">
                       <Users size={14} className="text-orange-500" /> {p.preferredTenant}
                     </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Filter Bottom Sheet (Drawer) */}
      {showFilters && (
        <div className="fixed inset-0 z-[200] flex items-end justify-center px-0">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowFilters(false)}></div>
          <div className="relative w-full max-w-[450px] bg-white/90 backdrop-blur-[16px] rounded-t-[2.5rem] p-8 shadow-2xl border-t border-white/50 animate-in slide-in-from-bottom duration-500">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-serif text-2xl font-bold text-gray-800">Refine Search</h3>
              <button 
                onClick={() => setShowFilters(false)}
                className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-8 max-h-[60vh] overflow-y-auto no-scrollbar pb-6">
              {/* Budget Filter */}
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Monthly Rent (Max)</label>
                  <span className="text-lg font-black text-orange-500">₹{filters.budget.toLocaleString()}</span>
                </div>
                <input 
                  type="range" 
                  min="5000" 
                  max="300000" 
                  step="5000"
                  value={filters.budget}
                  onChange={(e) => setFilters(prev => ({ ...prev, budget: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
                <div className="flex justify-between text-[8px] font-black text-gray-300 uppercase tracking-tighter">
                  <span>₹5K</span>
                  <span>₹300K</span>
                </div>
              </div>

              {/* BHK Selection */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">BHK Type</label>
                <div className="flex flex-wrap gap-2">
                  {['Studio', '1RK', '1 BHK', '2 BHK', '3 BHK', '4+ BHK'].map((val) => (
                    <button
                      key={val}
                      onClick={() => toggleFilter('bhk', val)}
                      className={`px-5 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border ${
                        filters.bhk.includes(val) 
                          ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-200' 
                          : 'bg-white border-gray-100 text-gray-500'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>

              {/* Property Type Selection */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Property Type</label>
                <div className="flex flex-wrap gap-2">
                  {['Apartment', 'House', 'Villa'].map((val) => (
                    <button
                      key={val}
                      onClick={() => toggleFilter('type', val)}
                      className={`px-5 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border ${
                        filters.type.includes(val) 
                          ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-200' 
                          : 'bg-white border-gray-100 text-gray-500'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>

              {/* Furnishing Selection */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Furnishing</label>
                <div className="flex flex-wrap gap-2">
                  {['Unfurnished', 'Semi', 'Fully'].map((val) => (
                    <button
                      key={val}
                      onClick={() => toggleFilter('furnishing', val)}
                      className={`px-5 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border ${
                        filters.furnishing.includes(val) 
                          ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-200' 
                          : 'bg-white border-gray-100 text-gray-500'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tenant Preference Selection */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tenant Preference</label>
                <div className="flex flex-wrap gap-2">
                  {['Family', 'Bachelors', 'Couples'].map((val) => (
                    <button
                      key={val}
                      onClick={() => toggleFilter('preference', val)}
                      className={`px-5 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border ${
                        filters.preference.includes(val) 
                          ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-200' 
                          : 'bg-white border-gray-100 text-gray-500'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100/50 flex gap-4">
               <button 
                onClick={() => { setFilters({ budget: 150000, bhk: [], type: [], furnishing: [], preference: [] }); }}
                className="flex-1 py-5 rounded-[2.5rem] text-[12px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-all"
               >
                 Reset All
               </button>
               <button 
                onClick={() => setShowFilters(false)}
                className="flex-[2] bg-orange-500 text-white py-5 rounded-[2.5rem] text-[12px] font-black uppercase tracking-[0.2em] shadow-xl shadow-orange-200 active:scale-95 transition-all flex items-center justify-center gap-2"
               >
                 <Check size={18} /> View {filteredListings.length} Homes
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
