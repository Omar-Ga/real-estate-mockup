import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Property } from '../types';
import Skeleton from './Skeleton';
import { clsx } from 'clsx';
import { Bed, Bath, Move, ArrowUpRight } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  index?: number;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, index = 0 }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

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
          {!imageLoaded && (
            <Skeleton className="absolute inset-0 w-full h-full" />
          )}
          <img
            src={property.images[0]}
            alt={property.title}
            onLoad={() => setImageLoaded(true)}
            className={clsx(
              "w-full h-full object-cover transition-all duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
          />

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-charcoal/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="bg-brutalist text-charcoal px-6 py-3 uppercase tracking-widest text-xs font-bold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 flex items-center gap-2">
              View Property <ArrowUpRight size={14} />
            </div>
          </div>

          <div className="absolute top-4 right-4 bg-charcoal/80 backdrop-blur px-3 py-1 z-10">
            <span className="text-xs font-mono text-brutalist">{property.price.toLocaleString()} EGP</span>
          </div>
          {property.featured && (
            <div className="absolute top-4 left-4 bg-industrial px-3 py-1 z-10">
              <span className="text-xs font-bold uppercase text-white tracking-wider">Featured</span>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-2xl font-bold tracking-tight group-hover:text-industrial transition-colors line-clamp-1">
            {property.title}
          </h3>

          <div className="flex justify-between items-center text-concrete text-sm border-t border-concrete/20 pt-4">
            <div className="flex gap-4">
              <span className="flex items-center gap-1" title="Bedrooms">
                <Bed size={14} /> {property.bedrooms}
              </span>
              <span className="flex items-center gap-1" title="Bathrooms">
                <Bath size={14} /> {property.bathrooms}
              </span>
              <span className="flex items-center gap-1" title="Square Feet">
                <Move size={14} /> {property.square_feet.toLocaleString()}
              </span>
            </div>
            <span className="truncate max-w-[40%] text-right">{property.city}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default PropertyCard;