import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

const Navbar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-charcoal/90 backdrop-blur-sm border-b border-concrete/20">
      <div className="max-w-[1920px] mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-brutalist text-3xl font-bold tracking-tighter hover:text-industrial transition-colors duration-300">
          LUX
        </Link>

        <div className="hidden md:flex items-center space-x-12">
          {['Properties', 'About', 'Contact'].map((item) => {
             const path = item === 'Properties' ? '/listings' : `/${item.toLowerCase()}`;
             return (
              <Link
                key={item}
                to={path}
                className={clsx(
                  "text-sm uppercase tracking-[0.2em] font-medium transition-colors duration-300 relative group",
                  isActive(path) ? "text-industrial" : "text-brutalist hover:text-industrial"
                )}
              >
                {item}
                <span className={clsx(
                  "absolute -bottom-2 left-0 w-full h-[1px] bg-industrial transform scale-x-0 transition-transform duration-300 origin-left",
                  isActive(path) ? "scale-x-100" : "group-hover:scale-x-100"
                )} />
              </Link>
            );
          })}
        </div>

        <Link 
          to="/contact" 
          className="hidden md:block px-6 py-2 border border-brutalist text-brutalist text-xs uppercase tracking-widest hover:bg-brutalist hover:text-charcoal transition-all duration-300"
        >
          Inquire
        </Link>

        {/* Mobile Menu Button - Placeholder for now */}
        <button className="md:hidden text-brutalist">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;