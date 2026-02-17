import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface LightboxProps {
    images: string[];
    isOpen: boolean;
    onClose: () => void;
    currentIndex: number;
    onNavigate: (index: number) => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
    images,
    isOpen,
    onClose,
    currentIndex,
    onNavigate
}) => {
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (!isOpen) return;

        if (e.key === 'Escape') onClose();
        if (e.key === 'ArrowLeft') onNavigate((currentIndex - 1 + images.length) % images.length);
        if (e.key === 'ArrowRight') onNavigate((currentIndex + 1) % images.length);
    }, [isOpen, onClose, currentIndex, onNavigate, images.length]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-charcoal/95 backdrop-blur-xl flex items-center justify-center"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 text-brutalist hover:text-industrial transition-colors"
                    >
                        <X size={32} />
                    </button>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onNavigate((currentIndex - 1 + images.length) % images.length);
                        }}
                        className="absolute left-6 text-brutalist hover:text-industrial transition-colors p-2"
                    >
                        <ChevronLeft size={48} />
                    </button>

                    <motion.img
                        key={currentIndex}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        src={images[currentIndex]}
                        alt={`Property view ${currentIndex + 1}`}
                        className="max-h-[90vh] max-w-[90vw] object-contain shadow-2xl"
                    />

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onNavigate((currentIndex + 1) % images.length);
                        }}
                        className="absolute right-6 text-brutalist hover:text-industrial transition-colors p-2"
                    >
                        <ChevronRight size={48} />
                    </button>

                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-concrete font-mono text-sm">
                        {currentIndex + 1} / {images.length}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
