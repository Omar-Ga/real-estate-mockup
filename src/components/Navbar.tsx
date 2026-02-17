import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const isActive = (path: string) => location.pathname === path;

  const navItems = ['Properties', 'About', 'Contact'];

  return (
    <>
    <nav className="fixed top-0 left-0 w-full z-50 bg-charcoal/90 backdrop-blur-md border-b border-concrete/20 transition-all duration-300">
      <div className="max-w-[1920px] mx-auto px-6 py-4 flex justify-between items-center relative z-50">
        <Link to="/" className="text-brutalist text-3xl font-bold tracking-tighter hover:text-industrial transition-colors duration-300 relative z-50">
          DEALS HUB
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-12">
          {navItems.map((item) => {
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

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-brutalist hover:text-industrial transition-colors relative z-50 focus:outline-none"
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>

    {/* Mobile Menu Overlay */}
    <AnimatePresence>
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="fixed inset-0 z-40 bg-charcoal/98 backdrop-blur-xl md:hidden flex flex-col items-center justify-start pt-32 overflow-y-auto"
        >
          <div className="flex flex-col items-center space-y-8 pb-10">
            {navItems.map((item, index) => {
              const path = item === 'Properties' ? '/listings' : `/${item.toLowerCase()}`;
              return (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.1, duration: 0.4 }}
                >
                  <Link
                    to={path}
                    className={clsx(
                      "text-3xl uppercase tracking-widest font-bold hover:text-industrial transition-colors",
                      isActive(path) ? "text-industrial" : "text-brutalist"
                    )}
                  >
                    {item}
                  </Link>
                </motion.div>
              );
            })}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="pt-8"
            >
              <Link
                to="/contact"
                className="px-8 py-3 border border-brutalist text-brutalist text-sm uppercase tracking-widest hover:bg-brutalist hover:text-charcoal transition-all duration-300"
              >
                Inquire Now
              </Link>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
};

export default Navbar;