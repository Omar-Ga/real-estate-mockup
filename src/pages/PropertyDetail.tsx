import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { properties } from '../data/properties';
import { ArrowLeft, MapPin, Maximize, Check } from 'lucide-react';
import { clsx } from 'clsx';
import Skeleton from '../components/Skeleton';
import { Lightbox } from '../components/Lightbox';

const PropertyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const property = properties.find(p => p.id === id);
  const [activeImage, setActiveImage] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [showStickyCTA, setShowStickyCTA] = useState(false);

  useEffect(() => {
    setImageLoaded(false);
  }, [activeImage]);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky CTA after scrolling past 80vh (hero height)
      if (window.scrollY > window.innerHeight * 0.8) {
        setShowStickyCTA(true);
      } else {
        setShowStickyCTA(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      <Lightbox
        images={property.images}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        currentIndex={activeImage}
        onNavigate={setActiveImage}
      />

      {/* Navigation Back */}
      <div className="fixed top-24 left-6 z-40 mix-blend-difference text-white">
        <Link to="/listings" className="flex items-center space-x-2 text-sm uppercase tracking-widest hover:text-industrial transition-colors">
          <ArrowLeft size={16} />
          <span>Back</span>
        </Link>
      </div>

      {/* Sticky CTA Bar */}
      <AnimatePresence>
        {showStickyCTA && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 w-full bg-charcoal/90 backdrop-blur-md border-t border-concrete/20 p-4 z-40 hidden md:flex justify-between items-center"
          >
            <div className="flex items-center space-x-4 px-6">
              <span className="font-bold text-lg">{property.title}</span>
              <span className="text-concrete">|</span>
              <span className="font-mono text-industrial">{property.price.toLocaleString()} EGP</span>
            </div>
            <div className="px-6">
              <button
                onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
                className="bg-brutalist text-charcoal px-6 py-3 uppercase tracking-widest text-xs font-bold hover:bg-industrial hover:text-white transition-colors duration-300"
              >
                Inquire Now
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Image */}
      <div
        className="h-[80vh] w-full relative overflow-hidden bg-charcoal cursor-zoom-in"
        onClick={() => setLightboxOpen(true)}
      >
        {!imageLoaded && (
          <Skeleton className="absolute inset-0 w-full h-full" />
        )}
        <motion.img
          key={activeImage}
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{
            scale: 1,
            opacity: imageLoaded ? 1 : 0
          }}
          transition={{ duration: 0.8 }}
          src={property.images[activeImage]}
          alt={property.title}
          onLoad={() => setImageLoaded(true)}
          className="w-full h-full object-cover hover:opacity-90 transition-opacity"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 to-transparent pointer-events-none"></div>

        <div className="absolute top-4 right-4 z-10 pointer-events-none">
          <div className="bg-charcoal/50 backdrop-blur px-4 py-2 rounded-full flex items-center gap-2">
            <Maximize size={16} />
            <span className="text-xs uppercase tracking-widest">View Fullscreen</span>
          </div>
        </div>

        <div className="absolute bottom-12 left-6 right-6 max-w-[1920px] mx-auto pointer-events-none">
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
              {property.price.toLocaleString()} EGP
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