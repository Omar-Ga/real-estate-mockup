import React from 'react';
import { motion } from 'framer-motion';

const About: React.FC = () => {
  return (
    <div className="min-h-screen pt-20 pb-32 px-6 max-w-[1920px] mx-auto">
      <div className="max-w-4xl mx-auto text-center mb-20">
        <motion.h1 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 leading-tight"
        >
          REDEFINING <br/> <span className="text-concrete">LUXURY</span>
        </motion.h1>
        <motion.p 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-xl md:text-2xl text-brutalist/80 font-light leading-relaxed"
        >
          LUX is a boutique real estate firm dedicated to the curation of architectural masterpieces. 
          We believe that a home is not just a place to live, but a statement of art and design.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-32">
        <motion.div 
          initial={{ x: -50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="aspect-square relative overflow-hidden"
        >
          <img 
            src="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Brutalist%20architecture%20office%20minimalist%20design%20concrete%20and%20glass&image_size=square_hd" 
            alt="Our Philosophy" 
            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
          />
        </motion.div>
        <motion.div 
          initial={{ x: 50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <h2 className="text-3xl font-bold tracking-tight border-b border-concrete/20 pb-4">Our Philosophy</h2>
          <p className="text-concrete text-lg leading-relaxed">
            We reject the ordinary. Our portfolio consists exclusively of properties that possess a distinct architectural character. 
            From mid-century modern gems to contemporary concrete fortresses, every listing is hand-picked for its design integrity.
          </p>
          <p className="text-concrete text-lg leading-relaxed">
            Our approach is rooted in brutalist principles: honesty in materials, clarity in structure, and an unyielding commitment to aesthetics.
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
        {[
          { number: '50+', label: 'Exclusive Listings' },
          { number: '$2B+', label: 'Total Sales Volume' },
          { number: '15', label: 'Design Awards' }
        ].map((stat, index) => (
          <motion.div 
            key={index}
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2, duration: 0.8 }}
            className="border border-concrete/10 p-12 bg-concrete/5"
          >
            <div className="text-6xl font-bold text-industrial mb-4">{stat.number}</div>
            <div className="text-sm uppercase tracking-widest text-concrete">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default About;