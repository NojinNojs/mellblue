import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export function CtaSection() {
    return (
        <section className="py-16 sm:py-24">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-blue via-[#002E80] to-brand-blue-dark px-6 py-16 text-center shadow-2xl sm:px-16 sm:py-24"
                >
                    {/* Decorative blobs */}
                    <div className="pointer-events-none absolute inset-0 overflow-hidden">
                        <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-white/5 blur-2xl" />
                        <div className="absolute -right-20 -bottom-20 h-72 w-72 rounded-full bg-[#003399]/30 blur-3xl" />
                    </div>

                    <div className="relative z-10 mx-auto max-w-2xl">
                        <span className="mb-4 inline-block text-xs font-semibold tracking-widest text-white/60 uppercase">
                            Untuk kamu yang butuh reward hari ini
                        </span>
                        <h2 className="mb-4 font-display text-3xl font-normal text-white italic sm:text-4xl md:text-5xl">
                            "Manjakan Dirimu"
                        </h2>
                        <p className="mb-10 text-sm leading-relaxed text-white/70 sm:text-base">
                            Nikmati kesegaran Ocean Milk yang berpadu sempurna dengan dessert premium kami. Hadirkan keseimbangan rasa yang pas di setiap tegukan dan gigitan.
                        </p>
                        <Link
                            href="/products"
                            className="group inline-flex h-13 items-center justify-center gap-2.5 rounded-xl bg-white px-10 text-base font-semibold text-brand-blue-dark shadow-lg transition-all hover:-translate-y-0.5 hover:bg-brand-muted hover:shadow-xl"
                        >
                            Pesan Sekarang
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
