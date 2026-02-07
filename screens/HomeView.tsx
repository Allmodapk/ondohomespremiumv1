
import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Zap, 
  Users, 
  Wrench,
  Sparkles
} from 'lucide-react';
import { Role } from '../types';

interface HomeViewProps {
  role: Role;
  setRole: (role: Role) => void;
  onStartListing: () => void;
  onExploreListings: () => void;
}

const slides = [
  {
    title: 'Friendly Owner',
    image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80&w=1200"
  },
  {
    title: 'Properties with Warm Welcomes',
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=1200"
  },
  {
    title: 'Pocket Friendly Properties',
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200"
  },
  {
    title: 'Newly Vacated Houses',
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200"
  }
];

const HeroCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full max-w-[600px] mx-auto px-4 mt-8 mb-4">
      <div className="relative aspect-[16/9] w-full rounded-[3rem] overflow-hidden shadow-2xl shadow-gray-300 group">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-105'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/60 z-10" />
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover transition-transform duration-[4000ms] ease-out"
              style={{ transform: index === currentIndex ? 'scale(1.1)' : 'scale(1)' }}
            />
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-8 text-center">
              <h3 className="text-white text-3xl md:text-4xl font-extrabold font-serif leading-tight drop-shadow-2xl tracking-tight">
                {slide.title}
              </h3>
              <div className="mt-4 w-12 h-1 bg-orange-500 rounded-full shadow-lg"></div>
              <p className="text-white/70 text-[10px] font-black uppercase tracking-[0.4em] mt-6">
                Direct Owner Deals
              </p>
            </div>
          </div>
        ))}

        <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-center gap-2.5">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all duration-500 ${
                index === currentIndex 
                  ? 'bg-orange-500 w-8 shadow-lg shadow-orange-500/50' 
                  : 'bg-white/40 w-2 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export const HomeView: React.FC<HomeViewProps> = ({ role, setRole, onStartListing, onExploreListings }) => {
  const ownerBenefits = [
    { text: "11-month membership", icon: Clock },
    { text: "6-Month Tenant Replacement Guarantee", icon: ShieldCheck },
    { text: "Zero brokerage fee", icon: Zap },
    { text: "Direct Verified Tenant Access", icon: Users },
    { text: "24/7 Priority Support & Handyman Access", icon: Wrench }
  ];

  return (
    <div className="pt-16 pb-32 h-full overflow-y-auto no-scrollbar bg-white">
      <div className="relative flex flex-col items-center justify-center px-6 pt-12 pb-14 text-center overflow-hidden bg-gradient-to-b from-[#E0F2FE] via-[#F8FAFC] to-white rounded-b-[4rem] shadow-sm">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-white rounded-full blur-[80px] -z-10 opacity-80"></div>
        
        <div className="relative w-full max-w-[280px] aspect-square flex items-center justify-center animate-float mx-auto">
          {/* Updated Hero Image: 3D Clay House on Clouds */}
          <img 
            src="https://img.freepik.com/premium-photo/3d-clay-house-with-cloud-icon-rendering-isolated-background_327483-3054.jpg" 
            alt="3D Claymorphism House on Clouds" 
            className="w-full h-full object-contain drop-shadow-[0_25px_30px_rgba(0,0,0,0.1)]"
          />
          <div className="absolute -bottom-6 w-[220px] h-12 bg-white/60 blur-3xl rounded-full -z-10"></div>
        </div>

        <h2 className="font-serif text-[2.2rem] text-gray-800 font-extrabold leading-[1.1] mt-8 tracking-tight max-w-[90%] mx-auto">
          Choose your path to get started
        </h2>

        <div className="mt-10 flex items-center justify-center w-full max-w-[280px] mx-auto">
          <div className="bg-white/80 backdrop-blur-md p-1.5 rounded-full flex w-full border border-gray-100 shadow-xl shadow-gray-200/50">
            <button
              onClick={() => setRole('Owner')}
              className={`flex-1 py-3.5 rounded-full text-sm font-bold transition-all duration-300 ${
                role === 'Owner' ? 'bg-orange-500 text-white shadow-lg shadow-orange-200' : 'text-gray-400'
              }`}
            >
              Owner
            </button>
            <button
              onClick={() => setRole('Tenant')}
              className={`flex-1 py-3.5 rounded-full text-sm font-bold transition-all duration-300 ${
                role === 'Tenant' ? 'bg-orange-500 text-white shadow-lg shadow-orange-200' : 'text-gray-400'
              }`}
            >
              Tenant
            </button>
          </div>
        </div>
        <p className="text-gray-400 text-[9px] font-bold uppercase tracking-[0.4em] mt-6 opacity-60">
          Built from trust
        </p>
      </div>

      {role === 'Owner' ? (
        <div className="px-6 py-12 animate-in fade-in slide-in-from-bottom-8 duration-700 bg-gray-50/50 rounded-t-[3rem] -mt-4">
          <div className="flex items-center justify-between mb-8 px-2">
            <div>
              <h3 className="font-serif text-[1.75rem] font-black text-gray-900 leading-tight">Owner Privileges</h3>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mt-1">Exclusively for landlords</p>
            </div>
            <div className="flex items-center gap-1 bg-orange-50 text-orange-600 px-4 py-2 rounded-full border border-orange-100/50 shadow-sm">
              <Sparkles size={14} />
              <span className="text-[10px] font-black uppercase tracking-wider">Premium</span>
            </div>
          </div>
          
          <div className="grid gap-4 mb-12">
            {ownerBenefits.map((benefit, i) => (
              <div 
                key={i} 
                className="flex items-center gap-5 p-6 bg-white/60 backdrop-blur-[16px] border-[0.5px] border-white/40 rounded-[2.5rem] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_30px_rgba(249,115,22,0.08)] transition-all duration-500 group"
              >
                <div className="w-14 h-14 bg-white rounded-3xl flex items-center justify-center flex-shrink-0 shadow-sm border border-gray-100 group-hover:scale-110 group-hover:bg-orange-50 transition-all duration-500">
                  <benefit.icon className="text-orange-500" size={26} />
                </div>
                <p className="text-gray-800 font-bold text-[15px] leading-tight tracking-tight">
                  {benefit.text}
                </p>
              </div>
            ))}
          </div>

          <button 
            onClick={onStartListing}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-6 rounded-[2.5rem] font-black flex items-center justify-center gap-3 shadow-[0_20px_40px_rgba(249,115,22,0.3)] active:scale-[0.97] transition-all text-xl"
          >
            List your property
            <ChevronRight size={24} />
          </button>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
          <HeroCarousel />

          <div className="px-6 mt-6 pb-12">
            <button 
              onClick={onExploreListings}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-5 rounded-[2.5rem] font-bold flex items-center justify-center gap-3 shadow-[0_15px_30px_rgba(249,115,22,0.3)] active:scale-95 transition-all text-lg"
            >
              Start searching now
              <ChevronRight size={22} />
            </button>
            <div className="mt-8 flex flex-col items-center gap-2 opacity-50">
               <div className="flex items-center gap-4 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
                 <span>Zero Brokerage</span>
                 <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                 <span>Verified Owners</span>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
