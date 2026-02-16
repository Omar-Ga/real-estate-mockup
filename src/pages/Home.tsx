import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { properties } from '../data/properties';

import PropertyCard from '../components/PropertyCard';

const Home: React.FC = () => {
  const featuredProperties = properties.filter(p => p.featured).slice(0, 3);

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={properties[0].images[0]} 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal/30 via-transparent to-charcoal"></div>
        </div>
        
        <div className="relative z-10 text-center max-w-5xl mx-auto px-6">
          <motion.h1 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-6 leading-[0.9]"
          >
            CONCRETE <br/> <span className="text-transparent stroke-text">DREAMS</span>
          </motion.h1>
          <motion.p 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-xl md:text-2xl text-concrete font-light tracking-wide max-w-2xl mx-auto mb-12"
          >
            Architectural masterpieces for the modern purist.
          </motion.p>
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <Link 
              to="/listings" 
              className="inline-flex items-center space-x-4 bg-brutalist text-charcoal px-8 py-4 text-sm uppercase tracking-widest font-bold hover:bg-industrial hover:text-white transition-colors duration-300"
            >
              <span>Explore Collection</span>
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-32 px-6 max-w-[1920px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 border-b border-concrete/20 pb-8">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter">
            SELECTED <span className="text-concrete">WORKS</span>
          </h2>
          <Link to="/listings" className="hidden md:flex items-center space-x-2 text-sm uppercase tracking-widest hover:text-industrial transition-colors mt-4 md:mt-0">
            <span>View All</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {featuredProperties.map((property, index) => (
            <PropertyCard key={property.id} property={property} index={index} />
          ))}
        </div>
      </section>

      {/* Editorial Section */}
      <section className="py-20 bg-concrete/5 border-y border-concrete/10">
        <div className="max-w-[1920px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div>
             <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-8 leading-tight">
              DESIGNED FOR <br/> THE EXTRAORDINARY
            </h2>
            <p className="text-concrete text-lg leading-relaxed mb-8 max-w-xl">
              We specialize in properties that push the boundaries of conventional architecture. 
              From brutalist concrete structures to ethereal glass pavilions, our portfolio is 
              curated for those who see their home as a work of art.
            </p>
            <Link to="/about" className="text-industrial uppercase tracking-widest text-sm font-bold hover:underline underline-offset-4">
              Our Philosophy
            </Link>
          </div>
          <div className="relative h-[600px] overflow-hidden">
             <img 
               src="https://images.unsplash.com/photo-1518005052357-e987154dd981?auto=format&fit=crop&w=2000" 
               alt="Architectural Detail" 
               className="w-full h-full object-cover"
             />
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;