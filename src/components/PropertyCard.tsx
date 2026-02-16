import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Property } from '../types';

interface PropertyCardProps {
  property: Property;
  index?: number;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, index = 0 }) => {
  return (
    <motion.div 
      initial={{ y: 50, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className="group cursor-pointer w-full"
    >
      <Link to={`/property/${property.id}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden mb-6 bg-concrete/10">
          <img 
            src={property.images[0]} 
            alt={property.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
          />
          <div className="absolute top-4 right-4 bg-charcoal/80 backdrop-blur px-3 py-1">
            <span className="text-xs font-mono text-brutalist">${property.price.toLocaleString()}</span>
          </div>
          {property.featured && (
             <div className="absolute top-4 left-4 bg-industrial px-3 py-1">
              <span className="text-xs font-bold uppercase text-white tracking-wider">Featured</span>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <h3 className="text-2xl font-bold tracking-tight group-hover:text-industrial transition-colors line-clamp-1">
            {property.title}
          </h3>
          <div className="flex justify-between items-center text-concrete text-sm border-t border-concrete/20 pt-4 mt-2">
            <span className="truncate max-w-[70%]">{property.city}, {property.state}</span>
            <span className="font-mono">{property.square_feet.toLocaleString()} SQFT</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default PropertyCard;