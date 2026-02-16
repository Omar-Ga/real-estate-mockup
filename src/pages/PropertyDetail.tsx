import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { properties } from '../data/properties';
import { ArrowLeft, MapPin, Maximize, Check } from 'lucide-react';
import { clsx } from 'clsx';

const PropertyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const property = properties.find(p => p.id === id);
  const [activeImage, setActiveImage] = useState(0);

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4">Property Not Found</h2>
          <Link to="/listings" className="text-industrial hover:underline">Return to Collection</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32">
      {/* Navigation Back */}
      <div className="fixed top-24 left-6 z-40 mix-blend-difference text-white">
        <Link to="/listings" className="flex items-center space-x-2 text-sm uppercase tracking-widest hover:text-industrial transition-colors">
          <ArrowLeft size={16} />
          <span>Back</span>
        </Link>
      </div>

      {/* Hero Image */}
      <div className="h-[80vh] w-full relative overflow-hidden">
        <motion.img 
          key={activeImage}
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          src={property.images[activeImage]} 
          alt={property.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 to-transparent"></div>
        
        <div className="absolute bottom-12 left-6 right-6 max-w-[1920px] mx-auto">
          <motion.h1 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-4 leading-none"
          >
            {property.title}
          </motion.h1>
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-8 text-lg">
             <div className="flex items-center space-x-2 text-concrete">
               <MapPin size={20} />
               <span>{property.address}, {property.city}</span>
             </div>
             <div className="text-brutalist font-mono text-2xl">
               ${property.price.toLocaleString()}
             </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="max-w-[1920px] mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* Left Column: Description & Specs */}
        <div className="lg:col-span-8 space-y-16">
          <div>
            <h3 className="text-xs uppercase tracking-widest text-concrete mb-6">Overview</h3>
            <p className="text-2xl md:text-3xl leading-relaxed font-light text-brutalist/90">
              {property.description}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-y border-concrete/20 py-12">
            <div>
              <span className="block text-xs uppercase tracking-widest text-concrete mb-2">Type</span>
              <span className="text-xl capitalize">{property.type}</span>
            </div>
            <div>
              <span className="block text-xs uppercase tracking-widest text-concrete mb-2">Bedrooms</span>
              <span className="text-xl">{property.bedrooms}</span>
            </div>
            <div>
              <span className="block text-xs uppercase tracking-widest text-concrete mb-2">Bathrooms</span>
              <span className="text-xl">{property.bathrooms}</span>
            </div>
            <div>
              <span className="block text-xs uppercase tracking-widest text-concrete mb-2">Area</span>
              <span className="text-xl">{property.square_feet.toLocaleString()} <span className="text-sm text-concrete">SQFT</span></span>
            </div>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-widest text-concrete mb-6">Amenities</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {property.amenities.map(amenity => (
                <div key={amenity} className="flex items-center space-x-3 text-brutalist">
                  <div className="w-1 h-1 bg-industrial rounded-full"></div>
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Gallery Thumbs */}
          <div>
             <h3 className="text-xs uppercase tracking-widest text-concrete mb-6">Gallery</h3>
             <div className="grid grid-cols-2 gap-4">
               {property.images.map((img, idx) => (
                 <div 
                   key={idx} 
                   onClick={() => setActiveImage(idx)}
                   className={clsx(
                     "cursor-pointer overflow-hidden aspect-video relative group",
                     activeImage === idx ? "ring-2 ring-industrial" : "opacity-70 hover:opacity-100 transition-opacity"
                   )}
                 >
                   <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                 </div>
               ))}
             </div>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="lg:col-span-4">
          <div className="sticky top-32 bg-concrete/5 p-8 border border-concrete/10">
            <h3 className="text-2xl font-bold mb-2">Interested?</h3>
            <p className="text-concrete mb-8">Schedule a private viewing or request more details.</p>
            
            <form className="space-y-6">
              <div>
                <label className="block text-xs uppercase tracking-widest text-concrete mb-2">Name</label>
                <input type="text" className="w-full bg-charcoal border border-concrete/30 p-3 text-brutalist focus:border-industrial focus:outline-none transition-colors" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-concrete mb-2">Email</label>
                <input type="email" className="w-full bg-charcoal border border-concrete/30 p-3 text-brutalist focus:border-industrial focus:outline-none transition-colors" placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-concrete mb-2">Phone</label>
                <input type="tel" className="w-full bg-charcoal border border-concrete/30 p-3 text-brutalist focus:border-industrial focus:outline-none transition-colors" placeholder="+1 (555) 000-0000" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-concrete mb-2">Message</label>
                <textarea rows={4} className="w-full bg-charcoal border border-concrete/30 p-3 text-brutalist focus:border-industrial focus:outline-none transition-colors" placeholder="I am interested in this property..."></textarea>
              </div>
              
              <button type="submit" className="w-full bg-brutalist text-charcoal py-4 uppercase tracking-widest font-bold hover:bg-industrial hover:text-white transition-colors duration-300">
                Send Inquiry
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PropertyDetail;