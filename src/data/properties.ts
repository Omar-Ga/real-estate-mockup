import { Property } from '../types';

export const properties: Property[] = [
  {
    id: '1',
    title: 'Brutalist Concrete Villa',
    description: 'Striking architectural masterpiece featuring raw concrete finishes and expansive glass walls. This home redefines luxury with its bold lines and seamless indoor-outdoor living spaces.',
    price: 2850000,
    type: 'house',
    bedrooms: 4,
    bathrooms: 3,
    square_feet: 4200,
    address: '123 Brutalist Avenue',
    city: 'Los Angeles',
    state: 'CA',
    zip_code: '90210',
    latitude: 34.0522,
    longitude: -118.2437,
    featured: true,
    active: true,
    images: [
      'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=2000',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2000',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=2000'
    ],
    amenities: ['Concrete Walls', 'Pool', 'Smart Home', 'Wine Cellar']
  },
  {
    id: '2',
    title: 'Industrial Loft Penthouse',
    description: 'Converted warehouse space with 20-foot ceilings and exposed steel beams. A true urban sanctuary in the heart of the city.',
    price: 1650000,
    type: 'apartment',
    bedrooms: 2,
    bathrooms: 2,
    square_feet: 2800,
    address: '456 Industrial Way',
    city: 'New York',
    state: 'NY',
    zip_code: '10013',
    latitude: 40.7128,
    longitude: -74.0060,
    featured: true,
    active: true,
    images: [
      'https://images.unsplash.com/photo-1593696140826-c58b5e636894?auto=format&fit=crop&w=2000',
      'https://images.unsplash.com/photo-1556912173-3db996e7c3ac?auto=format&fit=crop&w=2000',
      'https://images.unsplash.com/photo-1505693416388-b0346efee971?auto=format&fit=crop&w=2000'
    ],
    amenities: ['Exposed Brick', 'Roof Deck', 'Freight Elevator', 'High Ceilings']
  },
  {
    id: '3',
    title: 'Minimalist Glass House',
    description: 'Transparent living spaces floating above the landscape with uninterrupted views. Designed for those who appreciate nature and modern design.',
    price: 3200000,
    type: 'house',
    bedrooms: 3,
    bathrooms: 2.5,
    square_feet: 3500,
    address: '789 Glass Ridge',
    city: 'Malibu',
    state: 'CA',
    zip_code: '90265',
    latitude: 34.0259,
    longitude: -118.7798,
    featured: false,
    active: true,
    images: [
      'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=2000',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2000',
      'https://images.unsplash.com/photo-1584622050111-993a426fbf0a?auto=format&fit=crop&w=2000'
    ],
    amenities: ['Ocean View', 'Floor to Ceiling Windows', 'Infinity Pool', 'Private Beach Access']
  },
  {
    id: '4',
    title: 'Raw Concrete Townhouse',
    description: 'Five-story urban dwelling with brutalist facade and rooftop terrace. A fortress of privacy in a bustling neighborhood.',
    price: 1950000,
    type: 'townhouse',
    bedrooms: 3,
    bathrooms: 3,
    square_feet: 3100,
    address: '321 Concrete Street',
    city: 'San Francisco',
    state: 'CA',
    zip_code: '94105',
    latitude: 37.7749,
    longitude: -122.4194,
    featured: false,
    active: true,
    images: [
      'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=2000',
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=2000',
      'https://images.unsplash.com/photo-1502005229766-31e7ad43d5a2?auto=format&fit=crop&w=2000'
    ],
    amenities: ['Rooftop Terrace', 'Private Garage', 'Home Office', 'Security System']
  },
  {
    id: '5',
    title: 'Editorial Penthouse Suite',
    description: 'Magazine-worthy interiors with custom furniture and art installations. Every corner is a curated vignette.',
    price: 4200000,
    type: 'condo',
    bedrooms: 4,
    bathrooms: 4,
    square_feet: 4500,
    address: '654 Skyline Plaza',
    city: 'Miami',
    state: 'FL',
    zip_code: '33139',
    latitude: 25.7617,
    longitude: -80.1918,
    featured: true,
    active: true,
    images: [
      'https://images.unsplash.com/photo-1600607687644-c7171b42498b?auto=format&fit=crop&w=2000',
      'https://images.unsplash.com/photo-1512918760513-95f1929757cd?auto=format&fit=crop&w=2000',
      'https://images.unsplash.com/photo-1616594039964-40891a909d99?auto=format&fit=crop&w=2000'
    ],
    amenities: ['Concierge', 'Spa', 'Private Elevator', 'Art Gallery Lighting']
  }
];
