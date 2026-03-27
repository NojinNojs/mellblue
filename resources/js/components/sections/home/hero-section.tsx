import CTAButton from '@/components/CTAButton';
import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { motion, type Variants } from 'framer-motion';

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.18, delayChildren: 0.3 },
    },
};

const textVariants: Variants = {
    hidden: { opacity: 0, y: 35 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: 'easeOut' },
    },
};

const imageVariants: Variants = {
    hidden: { opacity: 0, scale: 0.93, x: 30 },
    visible: {
        opacity: 1,
        scale: 1,
        x: 0,
        transition: { duration: 0.9, ease: 'easeOut', delay: 0.5 },
    },
};

const taglineVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.5, ease: 'easeOut' },
    },
};

export function HeroSection() {
    const { appData } = usePage<SharedData>().props;
    const brandName = appData?.name || 'MELLBLUE';

    return (
        <section className="relative flex items-center overflow-hidden bg-background py-16 sm:py-20 lg:py-28">
            {/* Background decorative elements */}
            <div className="pointer-events-none absolute top-0 right-0 h-full w-2/3 bg-gradient-to-l from-primary/5 to-transparent" />
            <div
                className="pointer-events-none absolute bottom-0 left-0 h-80 w-80 rounded-full opacity-5"
                style={{
                    background:
                        'radial-gradient(circle, var(--color-brand-blue) 0%, transparent 70%)',
                    transform: 'translate(-30%, 30%)',
                }}
            />
            <div
                className="pointer-events-none absolute top-20 right-10 h-96 w-96 rounded-full opacity-[0.04]"
                style={{
                    background:
                        'radial-gradient(circle, var(--color-brand-dark) 0%, transparent 70%)',
                }}
            />

            <div className="mx-auto w-full max-w-7xl px-6 lg:px-10">
                <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
                    {/* LEFT: Text Content */}
                    <motion.div
                        className="z-10 flex flex-col items-center gap-6 text-center lg:items-start lg:text-left"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {/* Eyebrow label */}
                        <motion.div variants={taglineVariants}>
                            <span className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.22em] text-brand-blue-dark/80 uppercase">
                                <span className="inline-block h-px w-6 bg-brand-blue-dark/60" />
                                {brandName}
                            </span>
                        </motion.div>

                        {/* Main headline */}
                        <motion.h1
                            variants={textVariants}
                            className="font-display text-5xl leading-[1.08] font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl"
                        >
                            Refresh your{' '}
                            <span className="relative inline-block">
                                day
                                {/* Decorative animated underline — layered strokes */}
                                <svg
                                    viewBox="0 0 220 18"
                                    className="absolute -bottom-2 left-0 w-full overflow-visible"
                                    aria-hidden="true"
                                >                                    {/* Shadow / glow stroke */}
                                    <motion.path
                                        d="M 4 13 Q 55 3, 110 10 Q 165 17, 216 7"
                                        stroke="var(--color-brand-blue)"
                                        strokeWidth="7"
                                        fill="none"
                                        strokeLinecap="round"
                                        opacity={0.18}
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ duration: 0.9, delay: 1.0, ease: 'easeOut' }}
                                    />
                                    {/* Main blue wave */}
                                    <motion.path
                                        d="M 4 13 Q 55 3, 110 10 Q 165 17, 216 7"
                                        stroke="var(--color-brand-blue-dark)"
                                        strokeWidth="3.5"
                                        fill="none"
                                        strokeLinecap="round"
                                        initial={{ pathLength: 0, opacity: 0 }}
                                        animate={{ pathLength: 1, opacity: 1 }}
                                        transition={{ duration: 0.85, delay: 1.15, ease: 'easeOut' }}
                                    />
                                    {/* Shimmer highlight */}
                                    <motion.path
                                        d="M 4 13 Q 55 3, 110 10 Q 165 17, 216 7"
                                        stroke="white"
                                        strokeWidth="1.2"
                                        fill="none"
                                        strokeLinecap="round"
                                        opacity={0.5}
                                        initial={{ pathLength: 0, opacity: 0 }}
                                        animate={{ pathLength: 1, opacity: 0.5 }}
                                        transition={{ duration: 0.7, delay: 1.4, ease: 'easeOut' }}
                                    />
                                </svg>
                            </span>
                            <br />
                            with Ocean Milk.
                        </motion.h1>

                        {/* Sub-copy using our established narrative copy */}
                        <motion.p
                            variants={textVariants}
                            className="max-w-md text-base leading-relaxed text-foreground/80 md:text-lg"
                        >
                            Experience the clear, crystalline freshness of our signature{' '}
                            <span className="font-semibold text-brand-blue-dark">
                                Ocean Milk
                            </span>
                            , perfectly paired with the dense, legit richness of our artisanal{' '}
                            <span className="font-semibold text-foreground">
                                Fudgy Brownies
                            </span>
                            . Your ultimate daily escape.
                        </motion.p>

                        {/* CTA row */}
                        <motion.div
                            variants={textVariants}
                            className="mt-2 flex flex-wrap items-center justify-center gap-4 lg:justify-start"
                        >
                            <CTAButton
                                label="Explore Our Treats"
                                href="/products"
                                variant="primary"
                            />
                            <CTAButton
                                label="Contact Us"
                                href="/contact"
                                variant="outline"
                                showArrow={false}
                            />
                        </motion.div>
                    </motion.div>

                    {/* RIGHT: Product Image */}
                    <motion.div
                        className="relative z-10 mt-8 flex items-center justify-center lg:mt-0 lg:justify-end"
                        variants={imageVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {/* Glow blob behind image */}
                        <div
                            className="absolute inset-0 rounded-3xl opacity-20 blur-3xl"
                            style={{
                                background:
                                    'radial-gradient(ellipse at center, var(--color-brand-blue) 0%, var(--color-brand-dark) 60%, transparent 100%)',
                            }}
                        />

                        <div className="relative aspect-[4/5] w-full max-w-sm overflow-hidden rounded-3xl border border-white/20 shadow-2xl shadow-foreground/10 lg:max-w-md">
                            <img
                                src="/ocean-milk.webp"
                                alt="MELLBLUE signature Ocean Milk — perfectly fresh"
                                className="h-full w-full object-cover"
                            />
                            {/* Subtle image overlay for brand feel */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

                            {/* Floating badge */}
                            <motion.div
                                className="absolute top-5 right-5 rounded-2xl bg-background/95 px-3 py-2 shadow-lg backdrop-blur-sm"
                                initial={{ opacity: 0, scale: 0.7, y: -10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{
                                    delay: 1.3,
                                    type: 'spring',
                                    stiffness: 300,
                                    damping: 20,
                                }}
                            >
                                <p className="text-[10px] font-bold tracking-wider text-brand-blue-dark uppercase">
                                    Since 2026
                                </p>
                                <p className="text-xs font-semibold text-foreground">
                                    {brandName}
                                </p>
                            </motion.div>

                            {/* Bottom floating info card */}
                            <motion.div
                                className="absolute right-5 bottom-5 left-5 rounded-2xl border border-white/40 bg-white/70 px-4 py-3 shadow-xl backdrop-blur-md"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    delay: 1.5,
                                    type: 'spring',
                                    stiffness: 250,
                                    damping: 22,
                                }}
                            >
                                <p className="mb-0.5 text-[10px] font-bold tracking-wider text-brand-blue-dark/70 uppercase">
                                    Signature Drink
                                </p>
                                <p className="text-sm font-bold text-brand-blue-dark">
                                    Ocean Milk
                                </p>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Bottom scroll indicator */}
            <motion.div
                className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 0.6 }}
            >
                <span className="text-[10px] font-medium tracking-[0.2em] text-foreground/40 uppercase">
                    Scroll
                </span>
                <motion.div
                    className="h-8 w-px bg-gradient-to-b from-foreground/40 to-transparent"
                    animate={{ scaleY: [1, 0.5, 1] }}
                    transition={{
                        duration: 1.4,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
            </motion.div>
        </section>
    );
}
