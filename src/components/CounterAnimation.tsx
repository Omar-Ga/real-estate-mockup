import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

interface CounterAnimationProps {
    value: number;
    prefix?: string;
    suffix?: string;
    duration?: number;
}

export const CounterAnimation = ({
    value,
    prefix = '',
    suffix = '',
    duration = 2
}: CounterAnimationProps) => {
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        if (!isInView) return;

        let startTime: number | null = null;
        let animationFrame: number;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);

            // Ease out cubic for a satisfying deceleration
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * value);

            setDisplayValue(current);

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        animationFrame = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrame);
    }, [isInView, value, duration]);

    return (
        <span ref={ref}>
            {prefix}{displayValue.toLocaleString()}{suffix}
        </span>
    );
};
