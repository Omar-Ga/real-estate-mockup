import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-charcoal border-t border-concrete/20 pt-20 pb-10">
      <div className="max-w-[1920px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="text-brutalist text-6xl font-bold tracking-tighter block mb-6">
              LUX
            </Link>
            <p className="text-concrete max-w-md text-lg leading-relaxed">
              Curating the world's most exceptional brutalist and modern architectural properties for the discerning few.
            </p>
          </div>
          
          <div>
            <h4 className="text-brutalist text-xs uppercase tracking-widest mb-8">Navigation</h4>
            <ul className="space-y-4">
              {['Home', 'Properties', 'Journal', 'Contact'].map((item) => (
                <li key={item}>
                  <Link to={item === 'Home' ? '/' : item === 'Properties' ? '/listings' : `/${item.toLowerCase()}`} className="text-concrete hover:text-industrial transition-colors duration-300">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-brutalist text-xs uppercase tracking-widest mb-8">Social</h4>
            <ul className="space-y-4">
              {['Instagram', 'LinkedIn', 'Twitter'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-concrete hover:text-industrial transition-colors duration-300">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-end border-t border-concrete/10 pt-10">
          <p className="text-concrete/50 text-xs uppercase tracking-widest">
            © {new Date().getFullYear()} LUX Real Estate. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-concrete/50 text-xs uppercase tracking-widest hover:text-brutalist transition-colors">Privacy</a>
            <a href="#" className="text-concrete/50 text-xs uppercase tracking-widest hover:text-brutalist transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;