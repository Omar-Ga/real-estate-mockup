import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { properties } from '../data/properties';
import PropertyCard from '../components/PropertyCard';
import { Filter, X } from 'lucide-react';
import { clsx } from 'clsx';

const Listings: React.FC = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const filteredProperties = selectedType
    ? properties.filter(p => p.type === selectedType)
    : properties;

  const propertyTypes = Array.from(new Set(properties.map(p => p.type)));

  return (
    <div className="min-h-screen pt-20 pb-32 px-6 max-w-[1920px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-concrete/20 pb-8">
        <div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4">
            COLLECTION
          </h1>
          <p className="text-concrete text-lg">
            {filteredProperties.length} properties available
          </p>
        </div>
        
        <button 
          onClick={() => setFilterOpen(!filterOpen)}
          className="flex items-center space-x-2 uppercase tracking-widest text-sm font-bold hover:text-industrial transition-colors mt-6 md:mt-0"
        >
          <Filter size={18} />
          <span>Filter</span>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Filter Sidebar - Mobile Toggle / Desktop Sticky */}
        <motion.aside 
          initial={{ height: 0, opacity: 0 }}
          animate={{ 
            height: filterOpen ? 'auto' : '0px',
            opacity: filterOpen ? 1 : 0
          }}
          className={clsx(
            "lg:w-64 lg:h-auto lg:opacity-100 overflow-hidden lg:overflow-visible lg:block",
             filterOpen ? "block" : "hidden lg:block"
          )}
        >
          <div className="sticky top-32 space-y-8">
            <div>
              <h3 className="text-xs uppercase tracking-widest text-concrete mb-4">Property Type</h3>
              <ul className="space-y-3">
                <li>
                  <button 
                    onClick={() => setSelectedType(null)}
                    className={clsx(
                      "text-sm hover:text-industrial transition-colors text-left w-full",
                      selectedType === null ? "text-industrial font-bold" : "text-brutalist"
                    )}
                  >
                    All Properties
                  </button>
                </li>
                {propertyTypes.map(type => (
                  <li key={type}>
                    <button 
                      onClick={() => setSelectedType(type)}
                      className={clsx(
                        "text-sm capitalize hover:text-industrial transition-colors text-left w-full",
                        selectedType === type ? "text-industrial font-bold" : "text-brutalist"
                      )}
                    >
                      {type}s
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Additional filters could go here */}
            <div>
              <h3 className="text-xs uppercase tracking-widest text-concrete mb-4">Price Range</h3>
              <div className="flex items-center space-x-2 text-sm text-concrete">
                <span>$1M</span>
                <div className="h-[1px] bg-concrete/50 w-8"></div>
                <span>$10M+</span>
              </div>
            </div>
          </div>
        </motion.aside>

        {/* Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-16">
            {filteredProperties.map((property, index) => (
              <PropertyCard key={property.id} property={property} index={index} />
            ))}
          </div>
          
          {filteredProperties.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-xl text-concrete">No properties match your criteria.</p>
              <button 
                onClick={() => setSelectedType(null)}
                className="mt-4 text-industrial hover:underline"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Listings;