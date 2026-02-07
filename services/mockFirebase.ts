
import { Property, User } from '../types';

const STORAGE_KEY_LISTINGS = 'ondo_homes_listings';
const STORAGE_KEY_USER = 'ondo_homes_user';

const INITIAL_LISTINGS: Property[] = [
  {
    id: '1',
    ownerId: 'mock-user-123',
    type: 'Apartment',
    pincode: '560001',
    mobile: '9876543210',
    preferWhatsApp: true,
    allowCalls: true,
    allowChat: true,
    bhk: '2 BHK',
    bathrooms: '2',
    furnishing: 'Semi',
    builtUpArea: '1200',
    carpetArea: '1000',
    preferredTenant: 'Family',
    monthlyRent: '25000',
    advance: '100000',
    negotiable: true,
    maintenanceFee: '2000',
    totalFloors: '5',
    floorNumber: '3',
    parking: true,
    title: 'Spacious 2BHK in Bangalore Center',
    description: 'Beautiful apartment with modern amenities and great connectivity in a premium residential hub.',
    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=800'],
    createdAt: Date.now(),
    isActive: true,
  }
];

export const mockAuth = {
  currentUser: null as User | null,
  
  signInWithGoogle: async (): Promise<User> => {
    const user: User = {
      id: 'mock-user-123',
      name: 'John Doe',
      username: 'johndoe_ondo',
      phone: '9876543210',
      email: 'john.doe@example.com',
      photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
      membership: 'Silver',
    };
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    mockAuth.currentUser = user;
    return user;
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const saved = localStorage.getItem(STORAGE_KEY_USER);
    const current = saved ? JSON.parse(saved) : {};
    const updated = { ...current, ...data };
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(updated));
    mockAuth.currentUser = updated;
    return updated;
  },

  signOut: async () => {
    localStorage.removeItem(STORAGE_KEY_USER);
    mockAuth.currentUser = null;
  },

  checkSession: (): User | null => {
    const saved = localStorage.getItem(STORAGE_KEY_USER);
    if (saved) {
      const user = JSON.parse(saved);
      mockAuth.currentUser = user;
      return user;
    }
    return null;
  }
};

export const mockFirestore = {
  getListings: async (): Promise<Property[]> => {
    const saved = localStorage.getItem(STORAGE_KEY_LISTINGS);
    if (!saved) {
      localStorage.setItem(STORAGE_KEY_LISTINGS, JSON.stringify(INITIAL_LISTINGS));
      return INITIAL_LISTINGS;
    }
    return JSON.parse(saved);
  },

  addListing: async (data: Omit<Property, 'id' | 'createdAt'>): Promise<Property> => {
    const listings = await mockFirestore.getListings();
    const newListing: Property = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now(),
    };
    const updated = [newListing, ...listings];
    localStorage.setItem(STORAGE_KEY_LISTINGS, JSON.stringify(updated));
    return newListing;
  },

  updateListing: async (id: string, data: Partial<Property>): Promise<void> => {
    const listings = await mockFirestore.getListings();
    const updated = listings.map(l => l.id === id ? { ...l, ...data } : l);
    localStorage.setItem(STORAGE_KEY_LISTINGS, JSON.stringify(updated));
  },

  deleteListing: async (id: string): Promise<void> => {
    const listings = await mockFirestore.getListings();
    const updated = listings.filter(l => l.id !== id);
    localStorage.setItem(STORAGE_KEY_LISTINGS, JSON.stringify(updated));
  }
};

export const mockStorage = {
  uploadFile: async (file: File): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return URL.createObjectURL(file);
  }
};
