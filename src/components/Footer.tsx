import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-charcoal border-t border-concrete/20">
      {/* Newsletter Section */}
      <div className="max-w-[1920px] mx-auto px-6 py-20 border-b border-concrete/10">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4">
            STAY <span className="text-concrete">INFORMED</span>
          </h3>
          <p className="text-concrete mb-8">
            Be the first to know about new listings and exclusive architectural finds.
          </p>

          {subscribed ? (
            <div className="flex items-center justify-center gap-3 text-industrial">
              <CheckCircle size={20} />
              <span className="uppercase tracking-widest text-sm font-bold">You're on the list</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 bg-transparent border-b-2 border-concrete/30 py-3 px-1 text-brutalist focus:border-industrial focus:outline-none transition-colors text-center sm:text-left"
              />
              <button
                type="submit"
                className="flex items-center justify-center gap-2 bg-brutalist text-charcoal px-8 py-3 uppercase tracking-widest text-xs font-bold hover:bg-industrial hover:text-white transition-colors duration-300 shrink-0"
              >
                Subscribe <ArrowRight size={14} />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Footer Grid */}
      <div className="max-w-[1920px] mx-auto px-6 pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="text-brutalist text-6xl font-bold tracking-tighter block mb-6">
              DEALS HUB
            </Link>
            <p className="text-concrete max-w-md text-lg leading-relaxed">
              Curating the world's most exceptional brutalist and modern architectural properties for the discerning few.
            </p>
          </div>

          <div>
            <h4 className="text-brutalist text-xs uppercase tracking-widest mb-8">Navigation</h4>
            <ul className="space-y-4">
              {['Home', 'Properties', 'About', 'Contact'].map((item) => (
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
            © {new Date().getFullYear()} Deals Hub Real Estate. All rights reserved.
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