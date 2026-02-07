import React, { useState, useRef } from 'react';
import { ChevronLeft, MapPin, Bed, Bath, LayoutGrid, Users, Phone, MessageCircle, Heart, Share2 } from 'lucide-react';
import { Property } from '../types';

interface ListingDetailViewProps {
  property: Property;
  onBack: () => void;
  isSaved?: boolean;
  onToggleSave?: () => void;
}

export const ListingDetailView: React.FC<ListingDetailViewProps> = ({ 
  property, 
  onBack, 
  isSaved = false, 
  onToggleSave 
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (scrollRef.current) {
      const index = Math.round(scrollRef.current.scrollLeft / scrollRef.current.clientWidth);
      setCurrentImageIndex(index);
    }
  };

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleAction = (type: 'call' | 'chat') => {
    if (type === 'call') {
      if (property.allowCalls) {
        window.location.href = `tel:${property.mobile}`;
      } else {
        showFeedback("Owner preference: Direct chat");
      }
    } else {
      if (property.allowChat) {
        showFeedback("Opening Chat...");
      } else {
        showFeedback("Owner preference: Direct call");
      }
    }
  };

  const handleSaveToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleSave) {
      onToggleSave();
      showFeedback(isSaved ? "Removed from saved" : "Added to saved");
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-white overflow-y-auto max-w-[450px] mx-auto pb-24">
      {/* Property Image Slider */}
      <div className="relative h-[45vh] bg-gray-900 overflow-hidden">
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex h-full overflow-x-auto snap-x snap-mandatory no-scrollbar"
        >
          {property.images.map((img, i) => (
            <div key={i} className="w-full h-full flex-shrink-0 snap-center">
              <img src={img} alt={`${property.title} - ${i + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>

        {/* Floating Controls */}
        <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-10">
          <button 
            onClick={onBack}
            className="w-10 h-10 glass rounded-full flex items-center justify-center text-gray-800 shadow-sm"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="flex gap-3">
             <button className="w-10 h-10 glass rounded-full flex items-center justify-center text-gray-800 shadow-sm">
              <Share2 size={20} />
            </button>
            <button 
              onClick={handleSaveToggle}
              className={`w-10 h-10 glass rounded-full flex items-center justify-center shadow-sm transition-all active:scale-90 ${isSaved ? 'text-orange-500 bg-orange-50/50' : 'text-gray-800'}`}
            >
              <Heart size={20} fill={isSaved ? "currentColor" : "none"} />
            </button>
          </div>
        </div>

        {/* Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {property.images.map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-300 ${i === currentImageIndex ? 'w-6 bg-orange-500' : 'w-1.5 bg-white/40'}`} 
            />
          ))}
        </div>

        {/* Price Tag */}
        <div className="absolute bottom-6 left-6 z-10">
          <div className="bg-orange-500 text-white px-6 py-3 rounded-2xl shadow-xl font-bold text-xl">
            ₹{parseInt(property.monthlyRent).toLocaleString()}/mo
          </div>
        </div>
      </div>

      <div className="px-6 py-8">
        <h1 className="font-serif text-3xl font-bold text-gray-800 mb-2 leading-tight">{property.title}</h1>
        <div className="flex items-center gap-1.5 text-gray-400 mb-8">
          <MapPin size={18} className="text-orange-500" />
          <span className="text-sm font-medium">Area Pincode: {property.pincode}</span>
        </div>

        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Core Specifications</h3>
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Type', value: property.bhk, icon: Bed },
            { label: 'Bath', value: `${property.bathrooms} Baths`, icon: Bath },
            { label: 'Furnish', value: property.furnishing, icon: LayoutGrid },
          ].map((spec, i) => (
            <div key={i} className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex flex-col items-center gap-2 text-center">
              <spec.icon size={20} className="text-orange-500" />
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 font-bold uppercase">{spec.label}</span>
                <span className="text-sm font-black text-gray-700">{spec.value}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <section>
            <h3 className="text-lg font-bold text-gray-800 mb-2 font-serif">Description</h3>
            <p className="text-gray-600 leading-relaxed text-sm font-medium">{property.description}</p>
          </section>

          <section className="bg-orange-50/50 p-6 rounded-[2rem] border border-orange-100/50">
            <h3 className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Users size={16} />
              Tenant Preference
            </h3>
            <p className="text-gray-800 font-bold">This property is highly preferred for <span className="text-orange-600 underline decoration-2 underline-offset-4">{property.preferredTenant}</span>.</p>
          </section>

          <section>
             <h3 className="text-lg font-bold text-gray-800 mb-4 font-serif">Financial Details</h3>
             <div className="space-y-3">
               <div className="flex justify-between items-center p-5 bg-white border border-gray-100 rounded-[1.5rem] shadow-sm">
                 <span className="text-sm font-bold text-gray-400">Security Deposit</span>
                 <span className="text-lg font-black text-gray-800">₹{parseInt(property.advance).toLocaleString()}</span>
               </div>
               <div className="flex justify-between items-center p-5 bg-white border border-gray-100 rounded-[1.5rem] shadow-sm">
                 <span className="text-sm font-bold text-gray-400">Monthly Maintenance</span>
                 <span className="text-lg font-black text-gray-800">₹{property.maintenanceFee}</span>
               </div>
             </div>
          </section>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 glass px-6 py-4 flex gap-4 max-w-[450px] mx-auto z-50 rounded-t-[2rem] shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        {feedback && (
          <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest px-6 py-2.5 rounded-full shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-300">
            {feedback}
          </div>
        )}
        
        <button 
          onClick={() => handleAction('call')}
          className={`flex-1 py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg ${
            property.allowCalls 
            ? 'bg-gray-100 text-gray-800 hover:bg-gray-200' 
            : 'bg-gray-100 text-gray-300'
          }`}
        >
          <Phone size={20} className={property.allowCalls ? 'text-orange-500' : 'text-gray-200'} />
          Call Owner
        </button>
        
        <button 
          onClick={() => handleAction('chat')}
          className={`flex-1 py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg ${
            property.allowChat 
            ? 'bg-orange-500 text-white shadow-orange-200' 
            : 'bg-gray-200 text-gray-400'
          }`}
        >
          <MessageCircle size={20} />
          Chat Now
        </button>
      </div>
    </div>
  );
};
