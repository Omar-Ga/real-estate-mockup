import { Property } from '../types';

export const properties: Property[] = [
  {
    id: '1',
    title: 'Standalone Villa in Mivida',
    description: 'Standalone Villa | Ready To Move | Prime Location. Developer: Emaar Misr. View: Open View. Condition: Semi-Finished. Delivery: Ready To Move. 4 Bedrooms + Living, 4 Bathrooms, Nanny Room with Private Bathroom.',
    price: 47000000,
    type: 'villa',
    bedrooms: 4,
    bathrooms: 4,
    square_feet: 3660, // approx for 340 sqm BUA
    address: 'Mivida',
    city: 'New Cairo',
    state: 'Cairo',
    zip_code: '11835',
    latitude: 30.0166,
    longitude: 31.4795,
    featured: true,
    active: true,
    images: [
      '/images/properties/house-img-1.webp',
      '/images/properties/house-img-2.webp',
      '/images/properties/house-img-3.webp'
    ],
    amenities: ['Nanny Room', 'Private Bathroom', 'Open View', 'Living Room', 'Semi-Finished', 'Ready To Move'],
    landArea: 430,
    bua: 340,
    finishing: 'Semi-Finished',
    deliveryDate: 'Ready To Move',
    paymentPlan: 'Cash',
    internalCode: 'N/A'
  },
  {
    id: '2',
    title: 'Apartment in Sarai Compound',
    description: 'Ground floor apartment with 196m garden. Selling point: open view garden and corner. 2 Master Bedrooms, 3 Bathrooms. Finishing: Core and Shell.',
    price: 5640000, // Using the DP value as price or Total Price if cash? Source says "Total Price : cash" and "D.P : 5,640,000". Assuming 5.64M is the cash price based on context "Total Price : cash".
    type: 'apartment',
    bedrooms: 2,
    bathrooms: 3,
    square_feet: 1550, // approx for 144 sqm
    address: 'Sarai Compound',
    city: 'New Cairo',
    state: 'Cairo',
    zip_code: '11835',
    latitude: 30.0266,
    longitude: 31.4895,
    featured: true,
    active: true,
    images: [
      '/images/properties/house-img-4.webp',
      '/images/properties/house-img-5.webp',
      '/images/properties/house-img-6.webp'
    ],
    amenities: ['Garden (196m)', 'Corner Unit', 'Open View', 'Core and Shell'],
    internalCode: 'bh 123',
    bua: 144,
    landArea: 196, // Garden area
    finishing: 'Core and Shell',
    deliveryDate: 'Ready To Move',
    paymentPlan: 'Cash',
    downPayment: 5640000
  },
  {
    id: '3',
    title: 'Twin House in Hyde Park',
    description: 'Type: Twin House. Floor: G + 1 + Roof. Selling point: open view landscape pocket. 4 Bed + 2 Living + Nanny. 4 Bathrooms. Finishing: Core.',
    price: 41106190,
    type: 'townhouse',
    bedrooms: 4,
    bathrooms: 4,
    square_feet: 2530, // approx for 235 sqm
    address: 'Hyde Park',
    city: 'New Cairo',
    state: 'Cairo',
    zip_code: '11835',
    latitude: 30.0366,
    longitude: 31.4995,
    featured: false,
    active: true,
    images: [
      '/images/properties/house-img-7.webp',
      '/images/properties/house-img-8.webp',
      '/images/properties/house-img-9.webp'
    ],
    amenities: ['Landscape View', 'Nanny Room', 'Living Room (x2)', 'Roof', 'Core Finishing'],
    internalCode: 'bh 121',
    bua: 235,
    landArea: 303,
    finishing: 'Core',
    deliveryDate: '12 / 2026',
    downPayment: 14120590,
    paymentPlan: 'Installments available'
  },
  {
    id: '4',
    title: 'Hyde Park New Cairo Project',
    description: 'Project: Hyde Park New Cairo. Location: New Cairo 5th Settlement. 3 Bedrooms, 3 Bathrooms. Area: 176 sqm. Installments over 8 years.',
    price: 21129000,
    type: 'apartment',
    bedrooms: 3,
    bathrooms: 3,
    square_feet: 1894, // 176 sqm
    address: 'Hyde Park New Cairo',
    city: 'New Cairo',
    state: 'Cairo',
    zip_code: '11835',
    latitude: 30.0466,
    longitude: 31.5095,
    featured: false,
    active: true,
    images: [
      '/images/properties/house-img-10.webp',
      '/images/properties/house-img-11.webp',
      '/images/properties/house-img-12.webp'
    ],
    amenities: ['5th Settlement Location', 'Installments (8 years)'],
    bua: 176,
    finishing: 'Not Specified',
    deliveryDate: '2027',
    downPayment: 1056450, // 5% of 21,129,000
    paymentPlan: '5% Down payment, Installments over 8 years'
  },
  {
    id: '5',
    title: 'Mohamed Bin Zayed South Axis Project',
    description: 'Massive project directly on Mohamed Bin Zayed South Axis, Facing 97 Hills. 290 acres. Master plan by SWA. Commercial area, school, clubhouse. \n\nAVAILABLE INVENTORY:\n\n1. APARTMENTS (G+7):\n   - 1 Bedroom (66 sqm) starting from 5.5M EGP\n   - 2 Bedrooms (95 sqm) starting from 7.9M EGP\n   - 3 Bedrooms (140 sqm) starting from 11.6M EGP\n\n2. TOWNHOUSES:\n   - Middle (186 sqm) from 18.8M EGP\n   - Corner (186 sqm) from 20.8M EGP\n\n3. STANDALONE VILLAS:\n   - Type A (278 sqm) from 36.6M EGP\n   - Type B (250 sqm) from 29.9M EGP\n   - Type C (185 sqm) from 26.5M EGP\n\nPayment Plan: 1.5% Down Payment, Installments up to 10 & 12 years (Backloaded/Escalating).',
    price: 5500000, // Starting price
    type: 'condo', // Generic type for the project entry
    bedrooms: 1, // Minimum
    bathrooms: 1, // Minimum
    square_feet: 710, // 66 sqm
    address: 'Mohamed Bin Zayed South Axis',
    city: 'New Capital',
    state: 'Cairo',
    zip_code: '11835',
    latitude: 30.0566,
    longitude: 31.5195,
    featured: true,
    active: true,
    images: [
      '/images/properties/house-img-13.webp',
      '/images/properties/house-img-14.webp',
      '/images/properties/house-img-15.webp'
    ],
    amenities: ['Landscape View', 'Water Features', 'Commercial Area', 'Clubhouse', 'School', 'Facing 97 Hills'],
    landArea: 1173588, // 290 acres in sqm approx
    finishing: 'Not Specified',
    deliveryDate: 'Not Specified',
    paymentPlan: '1.5% Down Payment, Installments up to 10 & 12 years',
    downPayment: 82500 // 1.5% of 5.5M
  }
];