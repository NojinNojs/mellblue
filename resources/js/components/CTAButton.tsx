import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface CTAButtonProps {
    label?: string;
    href?: string;
    variant?: 'primary' | 'outline';
    showArrow?: boolean;
    className?: string;
    onClick?: () => void;
}

export default function CTAButton({
    label = 'Explore Our Menu',
    href,
    variant = 'primary',
    showArrow = true,
    className = '',
    onClick,
}: CTAButtonProps) {
    const baseClass = `inline-flex items-center justify-center gap-2 text-sm font-bold px-7 py-3.5 rounded-full transition-all duration-200 cursor-pointer ${className}`;
    const primaryClass =
        'bg-brand-blue-dark text-white shadow-lg shadow-brand-blue-dark/25 hover:shadow-xl hover:shadow-brand-blue-dark/30';
    const outlineClass =
        'border-2 border-brand-blue-dark text-brand-blue-dark hover:bg-brand-blue-dark/5';

    const combinedClass = `${baseClass} ${variant === 'primary' ? primaryClass : outlineClass}`;

    const MotionButton = (
        <motion.button
            className={combinedClass}
            onClick={onClick}
            whileHover={{ scale: 1.04, y: -1 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
            <span>{label}</span>
            {showArrow && (
                <motion.span
                    animate={{ x: [0, 3, 0] }}
                    transition={{
                        duration: 1.8,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                >
                    <ArrowRight className="h-4 w-4" />
                </motion.span>
            )}
        </motion.button>
    );

    if (href) {
        return (
            <Link href={href} className="inline-block">
                {MotionButton}
            </Link>
        );
    }

    return MotionButton;
}
