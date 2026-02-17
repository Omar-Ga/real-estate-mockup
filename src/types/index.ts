export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  type: 'house' | 'apartment' | 'condo' | 'townhouse' | 'villa';
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  latitude: number;
  longitude: number;
  featured: boolean;
  active: boolean;
  images: string[];
  amenities: string[];
  // Extended details for AI context
  internalCode?: string;
  landArea?: number; // in sqm
  bua?: number; // in sqm
  finishing?: string;
  deliveryDate?: string;
  paymentPlan?: string;
  downPayment?: number;
}
