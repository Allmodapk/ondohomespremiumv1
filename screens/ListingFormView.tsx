
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Upload, X, CheckCircle2, Sparkles, Loader2, Wand2, Phone, MessageCircle } from 'lucide-react';
import { ListingFormData, Property } from '../types';
import { mockStorage } from '../services/mockFirebase';
import { generateDescription, analyzePropertyImage } from '../services/gemini';

interface ListingFormViewProps {
  initialData?: Property | null;
  onCancel: () => void;
  onComplete: (data: Omit<Property, 'id' | 'createdAt'>) => void;
}

export const ListingFormView: React.FC<ListingFormViewProps> = ({ initialData, onCancel, onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<ListingFormData>({
    type: 'Apartment',
    pincode: '',
    mobile: '',
    preferWhatsApp: true,
    allowCalls: true,
    allowChat: true,
    bhk: '1 BHK',
    bathrooms: '1',
    furnishing: 'Semi',
    builtUpArea: '',
    carpetArea: '',
    preferredTenant: 'Family',
    monthlyRent: '',
    advance: '',
    negotiable: true,
    maintenanceFee: '0',
    totalFloors: '',
    floorNumber: '',
    parking: true,
    title: '',
    description: '',
    images: [],
    isActive: true
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const [uploading, setUploading] = useState<number[]>([]); 
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);

  const nextStep = () => setStep(s => Math.min(4, s + 1));
  const prevStep = () => setStep(s => Math.max(1, s - 1));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleToggle = (name: 'allowCalls' | 'allowChat') => {
    setFormData(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages = [...(formData.images || [])];
    const startIndex = newImages.length;
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setUploading(prev => [...prev, startIndex + i]);
      const url = await mockStorage.uploadFile(file);
      newImages.push(url);
      setUploading(prev => prev.filter(idx => idx !== startIndex + i));
    }
    
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const handleAutoDescribe = async (imgUrl: string) => {
    setIsAnalyzingImage(true);
    try {
      const response = await fetch(imgUrl);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64data = (reader.result as string).split(',')[1];
        const result = await analyzePropertyImage(base64data);
        if (result.title) {
          setFormData(prev => ({ 
            ...prev, 
            title: result.title, 
            description: result.description 
          }));
          setStep(3);
        }
        setIsAnalyzingImage(false);
      };
    } catch (e) {
      setIsAnalyzingImage(false);
    }
  };

  const handleAIDescription = async () => {
    if (!formData.title || !formData.monthlyRent) return;
    setIsGeneratingAI(true);
    const desc = await generateDescription({
      type: formData.type!,
      bhk: formData.bhk!,
      furnishing: formData.furnishing!,
      area: formData.builtUpArea!,
      rent: formData.monthlyRent!,
      title: formData.title!
    });
    setFormData(prev => ({ ...prev, description: desc }));
    setIsGeneratingAI(false);
  };

  const isFormValid = () => {
    if (step === 1) return formData.pincode && formData.mobile && (formData.allowCalls || formData.allowChat);
    if (step === 2) return formData.builtUpArea && formData.carpetArea;
    if (step === 3) return formData.monthlyRent && formData.title && formData.description;
    if (step === 4) return (formData.images?.length || 0) >= 1;
    return false;
  };

  return (
    <div className="fixed inset-0 z-[150] bg-white overflow-y-auto max-w-[450px] mx-auto pb-24 backdrop-blur-[16px] bg-white/90">
      <header className="sticky top-0 z-10 glass px-6 py-4 flex items-center justify-between">
        <button onClick={onCancel} className="text-gray-500">
          <X size={24} />
        </button>
        <div className="flex-1 text-center">
          <span className="text-xs font-bold text-orange-500 uppercase tracking-widest">Step {step} of 4</span>
          <h2 className="font-serif text-lg font-bold text-gray-800">
            {initialData ? 'Edit Property' : (
              <>
                {step === 1 && 'Basic Details'}
                {step === 2 && 'Property Specs'}
                {step === 3 && 'Financials & Info'}
                {step === 4 && 'Upload Images'}
              </>
            )}
          </h2>
        </div>
        <div className="w-6"></div>
      </header>

      <div className="h-1 bg-gray-100">
        <div 
          className="h-full bg-orange-500 transition-all duration-300" 
          style={{ width: `${(step / 4) * 100}%` }}
        ></div>
      </div>

      <div className="p-6 space-y-8 animate-in fade-in duration-300">
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Property Type</label>
              <select name="type" value={formData.type} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none">
                <option>House</option>
                <option>Apartment</option>
                <option>Villa</option>
                <option>Studio</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Pincode (6 digits)</label>
              <input name="pincode" type="text" maxLength={6} value={formData.pincode} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none" placeholder="Ex: 560001" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Mobile Number</label>
              <input name="mobile" type="tel" value={formData.mobile} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none" placeholder="Enter 10 digit number" />
            </div>

            <div className="pt-4 space-y-4">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact Preference</label>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => handleToggle('allowCalls')}
                  className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${formData.allowCalls ? 'bg-orange-50 border-orange-200 text-orange-600 shadow-sm' : 'bg-white border-gray-100 text-gray-400 opacity-60'}`}
                >
                  <Phone size={20} />
                  <span className="text-xs font-bold uppercase tracking-wider">Allow Calls</span>
                </button>
                <button 
                  onClick={() => handleToggle('allowChat')}
                  className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${formData.allowChat ? 'bg-orange-50 border-orange-200 text-orange-600 shadow-sm' : 'bg-white border-gray-100 text-gray-400 opacity-60'}`}
                >
                  <MessageCircle size={20} />
                  <span className="text-xs font-bold uppercase tracking-wider">Allow Chat</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">BHK</label>
                <select name="bhk" value={formData.bhk} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none">
                  <option>1 BHK</option>
                  <option>2 BHK</option>
                  <option>3 BHK</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Furnishing</label>
                <select name="furnishing" value={formData.furnishing} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none">
                  <option>Fully</option>
                  <option>Semi</option>
                  <option>Unfurnished</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Built-up Area</label>
                <input name="builtUpArea" value={formData.builtUpArea} onChange={handleInputChange} type="number" className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none" placeholder="sq ft" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Carpet Area</label>
                <input name="carpetArea" value={formData.carpetArea} onChange={handleInputChange} type="number" className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none" placeholder="sq ft" />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Monthly Rent</label>
                <input name="monthlyRent" value={formData.monthlyRent} onChange={handleInputChange} type="number" className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Advance</label>
                <input name="advance" value={formData.advance} onChange={handleInputChange} type="number" className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none" />
              </div>
            </div>
            <div>
               <label className="block text-sm font-bold text-gray-700 mb-2">Listing Title</label>
               <input name="title" value={formData.title} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none" />
            </div>
            <div>
               <div className="flex justify-between items-center mb-2">
                 <label className="block text-sm font-bold text-gray-700">Description</label>
                 <button onClick={handleAIDescription} disabled={isGeneratingAI} className="flex items-center gap-1 text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1.5 rounded-full">
                   {isGeneratingAI ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />} Magic Write
                 </button>
               </div>
               <textarea name="description" value={formData.description} onChange={handleInputChange} rows={4} className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none resize-none" />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {formData.images?.map((url, i) => (
                <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border border-gray-100 group">
                  <img src={url} alt="Listing" className="w-full h-full object-cover" />
                  <button onClick={() => setFormData(prev => ({ ...prev, images: prev.images?.filter((_, idx) => idx !== i) }))} className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full">
                    <X size={14} />
                  </button>
                  <button 
                    onClick={() => handleAutoDescribe(url)}
                    disabled={isAnalyzingImage}
                    className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur py-1.5 rounded-xl text-[10px] font-bold text-orange-600 flex items-center justify-center gap-1 shadow-lg"
                  >
                    {isAnalyzingImage ? <Loader2 size={10} className="animate-spin" /> : <Wand2 size={10} />}
                    AI Describe
                  </button>
                </div>
              ))}
              
              {uploading.map((idx) => (
                <div key={idx} className="aspect-square bg-gray-50 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-200">
                  <Loader2 className="text-orange-500 animate-spin" size={24} />
                </div>
              ))}

              {(formData.images?.length || 0) < 5 && (
                <label className="aspect-square bg-orange-50 rounded-2xl flex flex-col items-center justify-center gap-2 border-2 border-dashed border-orange-200 cursor-pointer">
                  <Upload className="text-orange-500" size={32} />
                  <span className="text-xs font-bold text-orange-600 uppercase">Add Photo</span>
                  <input type="file" className="hidden" multiple accept="image/*" onChange={handleImageUpload} />
                </label>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 glass px-6 py-4 flex gap-4 max-w-[450px] mx-auto">
        <button onClick={prevStep} disabled={step === 1} className="flex-1 bg-gray-100 text-gray-800 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 disabled:opacity-50">Back</button>
        <button onClick={step === 4 ? () => onComplete(formData as any) : nextStep} disabled={!isFormValid()} className="flex-[2] bg-orange-500 disabled:bg-gray-200 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-orange-200 transition-all">
          {step === 4 ? (initialData ? 'Update' : 'Publish') : 'Continue'} <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};
