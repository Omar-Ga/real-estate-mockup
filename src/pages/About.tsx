import React from 'react';
import { motion } from 'framer-motion';
import { CounterAnimation } from '../components/CounterAnimation';
import { ScrollReveal } from '../components/ScrollReveal';

const About: React.FC = () => {
  const stats = [
    { value: 50, prefix: '', suffix: '+', label: 'Exclusive Listings' },
    { value: 2, prefix: '$', suffix: 'B+', label: 'Total Sales Volume' },
    { value: 15, prefix: '', suffix: '', label: 'Design Awards' }
  ];

  return (
    <div className="min-h-screen pt-20 pb-32 px-6 max-w-[1920px] mx-auto">
      <div className="max-w-4xl mx-auto text-center mb-20">
        <motion.h1
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 leading-tight"
        >
          REDEFINING <br /> <span className="text-concrete">LUXURY</span>
        </motion.h1>
        <motion.p
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-xl md:text-2xl text-brutalist/80 font-light leading-relaxed"
        >
          Deals Hub is a boutique real estate firm dedicated to the curation of architectural masterpieces.
          We believe that a home is not just a place to live, but a statement of art and design.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-32">
        <ScrollReveal width="100%">
          <div className="aspect-square relative overflow-hidden">
            <img
              src="/images/properties/house-img-17.webp"
              alt="Our Philosophy"
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
            />
          </div>
        </ScrollReveal>
        <ScrollReveal delay={0.2}>
          <div className="space-y-8">
            <h2 className="text-3xl font-bold tracking-tight border-b border-concrete/20 pb-4">Our Philosophy</h2>
            <p className="text-concrete text-lg leading-relaxed">
              We reject the ordinary. Our portfolio consists exclusively of properties that possess a distinct architectural character.
              From mid-century modern gems to contemporary concrete fortresses, every listing is hand-picked for its design integrity.
            </p>
            <p className="text-concrete text-lg leading-relaxed">
              Our approach is rooted in brutalist principles: honesty in materials, clarity in structure, and an unyielding commitment to aesthetics.
            </p>
          </div>
        </ScrollReveal>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
        {stats.map((stat, index) => (
          <ScrollReveal key={index} delay={index * 0.2} width="100%">
            <div className="border border-concrete/10 p-12 bg-concrete/5 h-64 flex flex-col justify-center items-center">
              <div className="text-6xl font-bold text-industrial mb-4">
                <CounterAnimation
                  value={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                />
              </div>
              <div className="text-sm uppercase tracking-widest text-concrete">{stat.label}</div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
};

export default About;