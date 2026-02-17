import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, Quote } from 'lucide-react';
import { properties } from '../data/properties';

import PropertyCard from '../components/PropertyCard';
import { ScrollReveal } from '../components/ScrollReveal';

const Home: React.FC = () => {
  const featuredProperties = properties.filter(p => p.featured).slice(0, 3);
  const heroRef = useRef<HTMLElement>(null);
  
  // Gather all images for the hero slider
  const heroImages = properties.flatMap(p => p.images);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  // Background moves slower (parallax)
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  // Text moves faster (creates depth)
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const textOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const testimonials = [
    {
      text: "Deals Hub transformed our understanding of what a home could be. Their curated collection is simply unmatched in the market.",
      author: "Sarah Jenkins",
      role: "Art Collector"
    },
    {
      text: "The buying process was seamless, but it was the architectural quality of the properties that truly set them apart.",
      author: "Marcus Thorne",
      role: "Architect"
    },
    {
      text: "For the first time, I found a real estate agency that speaks the language of design. Highly recommended.",
      author: "Elena Rodriguez",
      role: "Interior Designer"
    }
  ];

  return (
    <>
      {/* Hero Section - Parallax */}
      <section ref={heroRef} className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <motion.div
          className="absolute inset-0 z-0"
          style={{ y: bgY }}
        >
          <AnimatePresence mode="popLayout">
            <motion.img
              key={currentImageIndex}
              src={heroImages[currentImageIndex]}
              alt="Hero Background"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-[120%] object-cover"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal/30 via-transparent to-charcoal z-10"></div>
        </motion.div>

        <motion.div
          className="relative z-10 text-center max-w-5xl mx-auto px-6"
          style={{ y: textY, opacity: textOpacity }}
        >
          <motion.h1
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-6 leading-[0.9]"
          >
            CONCRETE <br /> <span className="text-transparent stroke-text">DREAMS</span>
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
        </motion.div>
      </section>

      {/* Featured Listings */}
      <section className="py-32 px-6 max-w-[1920px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 border-b border-concrete/20 pb-8">
          <ScrollReveal>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter">
              SELECTED <span className="text-concrete">WORKS</span>
            </h2>
          </ScrollReveal>
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
            <ScrollReveal>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-8 leading-tight">
                DESIGNED FOR <br /> THE EXTRAORDINARY
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <p className="text-concrete text-lg leading-relaxed mb-8 max-w-xl">
                We specialize in properties that push the boundaries of conventional architecture.
                From brutalist concrete structures to ethereal glass pavilions, our portfolio is
                curated for those who see their home as a work of art.
              </p>
              <Link to="/about" className="text-industrial uppercase tracking-widest text-sm font-bold hover:underline underline-offset-4">
                Our Philosophy
              </Link>
            </ScrollReveal>
          </div>
          <div className="relative h-[600px] overflow-hidden">
            <ScrollReveal delay={0.4} width="100%">
              <img
                src="/images/properties/house-img-16.webp"
                alt="Architectural Detail"
                className="w-full h-full object-cover"
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 px-6 max-w-[1920px] mx-auto">
        <ScrollReveal>
          <h2 className="text-center text-4xl md:text-6xl font-bold tracking-tighter mb-20">
            CLIENT <span className="text-concrete">STORIES</span>
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <ScrollReveal key={idx} delay={idx * 0.2}>
              <div className="bg-concrete/5 p-10 border border-concrete/10 h-full flex flex-col relative group hover:border-industrial/30 transition-colors">
                <Quote className="text-industrial mb-6 opacity-50 block" size={32} />
                <p className="text-lg text-brutalist/80 italic mb-8 flex-grow leading-relaxed">
                  "{testimonial.text}"
                </p>
                <div>
                  <div className="font-bold text-brutalist uppercase tracking-wider">{testimonial.author}</div>
                  <div className="text-xs text-concrete uppercase tracking-widest mt-1">{testimonial.role}</div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </>
  );
};

export default Home;