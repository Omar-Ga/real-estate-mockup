import React from "react";
import { motion } from "framer-motion";

const Contact: React.FC = () => {
  return (
    <div className="min-h-screen pt-20 pb-32 px-6 max-w-[1920px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        {/* Contact Info */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col"
        >
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-16 leading-[0.85]">
            GET IN <span className="text-concrete">TOUCH</span>
          </h1>

          <div className="space-y-16 lg:space-y-24 mt-12 lg:mt-20">
            <div>
              <h3 className="text-xs uppercase tracking-widest text-concrete mb-4">
                Headquarters
              </h3>
              <p className="text-2xl md:text-3xl font-light">
                99 Palace Road <br />
                Garden City, Cairo, Egypt
              </p>
            </div>

            <div>
              <h3 className="text-xs uppercase tracking-widest text-concrete mb-4">
                Contact
              </h3>
              <p className="text-2xl md:text-3xl font-light">
                <a
                  href="mailto:hello@lux.com.eg"
                  className="hover:text-industrial transition-colors"
                >
                  hello@lux.com.eg
                </a>{" "}
                <br />
                <a
                  href="tel:+20223456789"
                  className="hover:text-industrial transition-colors"
                >
                  +20 (2) 2345-6789
                </a>
              </p>
            </div>

            <div>
              <h3 className="text-xs uppercase tracking-widest text-concrete mb-4">
                Press
              </h3>
              <p className="text-2xl md:text-3xl font-light">
                <a
                  href="mailto:press@DealsHub.eg"
                  className="hover:text-industrial transition-colors"
                >
                  press@DealsHub.eg
                </a>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="bg-concrete/5 p-8 md:p-12 border border-concrete/10"
        >
          <h2 className="text-2xl font-bold mb-8 uppercase tracking-widest">
            Inquiry Form
          </h2>
          <form className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-xs uppercase tracking-widest text-concrete mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  className="w-full bg-transparent border-b border-concrete/30 py-3 text-brutalist focus:border-industrial focus:outline-none transition-colors"
                  placeholder="Jane"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-concrete mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  className="w-full bg-transparent border-b border-concrete/30 py-3 text-brutalist focus:border-industrial focus:outline-none transition-colors"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-concrete mb-2">
                Email
              </label>
              <input
                type="email"
                className="w-full bg-transparent border-b border-concrete/30 py-3 text-brutalist focus:border-industrial focus:outline-none transition-colors"
                placeholder="jane@example.com"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-concrete mb-2">
                Subject
              </label>
              <select className="w-full bg-transparent border-b border-concrete/30 py-3 text-brutalist focus:border-industrial focus:outline-none transition-colors">
                <option className="bg-charcoal">General Inquiry</option>
                <option className="bg-charcoal">Sell a Property</option>
                <option className="bg-charcoal">Buy a Property</option>
                <option className="bg-charcoal">Press</option>
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-concrete mb-2">
                Message
              </label>
              <textarea
                rows={4}
                className="w-full bg-transparent border-b border-concrete/30 py-3 text-brutalist focus:border-industrial focus:outline-none transition-colors"
                placeholder="How can we help you?"
              ></textarea>
            </div>

            <button
              type="submit"
              className="inline-block w-full md:w-auto bg-brutalist text-charcoal px-12 py-4 uppercase tracking-widest font-bold hover:bg-industrial hover:text-white transition-colors duration-300"
            >
              Submit Inquiry
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
