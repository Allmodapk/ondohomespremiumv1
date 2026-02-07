
export type Role = 'Owner' | 'Tenant';

export interface Property {
  id: string;
  ownerId: string;
  type: 'House' | 'Apartment' | 'Villa' | 'Studio';
  pincode: string;
  mobile: string;
  preferWhatsApp: boolean;
  allowCalls: boolean; // New: owner preference
  allowChat: boolean;  // New: owner preference
  bhk: string;
  bathrooms: string;
  furnishing: 'Fully' | 'Semi' | 'Unfurnished';
  builtUpArea: string;
  carpetArea: string;
  preferredTenant: 'Family' | 'Bachelors' | 'Couples';
  monthlyRent: string;
  advance: string;
  negotiable: boolean;
  maintenanceFee: string;
  totalFloors: string;
  floorNumber: string;
  parking: boolean;
  title: string;
  description: string;
  images: string[];
  createdAt: number;
  isActive: boolean;
}

export interface User {
  id: string;
  name: string;
  username?: string;
  phone?: string;
  email: string;
  photoURL: string;
  membership: 'Silver' | 'Gold' | 'Platinum';
}

export interface ListingFormData extends Partial<Property> {}
