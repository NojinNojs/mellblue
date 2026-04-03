import BrandLogo from '@/components/BrandLogo';
import SocialIcons from '@/components/SocialIcons';
import { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';

const quickLinks = [
    { label: 'Beranda', href: '/' },
    { label: 'Katalog Menu', href: '/products' },
    { label: 'Tanya Kami', href: '/contact' },
];

export default function Footer() {
    const { appData } = usePage<SharedData>().props;
    const currentYear = new Date().getFullYear();
    const containerVariants: import('framer-motion').Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.12, delayChildren: 0.1 },
        },
    };

    const itemVariants: import('framer-motion').Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: 'easeOut' },
        },
    };

    return (
        <footer className="bg-brand-blue-dark text-white">
            {/* Decorative top wave divider */}
            <div
                className="w-full overflow-hidden leading-none -mt-[1px]"
                style={{ height: 40 }}
            >
                <svg
                    viewBox="0 0 1440 40"
                    preserveAspectRatio="none"
                    className="block h-full w-full fill-background"
                >
                    <path d="M0,20 C360,40 1080,0 1440,20 L1440,0 L0,0 Z" />
                </svg>
            </div>

            <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
                <motion.div
                    className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-80px' }}
                >
                    {/* Column 1: Brand narrative */}
                    <motion.div
                        variants={itemVariants}
                        className="flex flex-col gap-5"
                    >
                        <BrandLogo variant="light" />
                        <p className="max-w-xs text-sm leading-relaxed text-white/90">
                            Lahir dari kebiruan samudra — tempat cita rasa berani bertemu kreasi artisanal. Karena kamu berhak menikmati sesuatu yang luar biasa setiap harinya.
                        </p>
                        {/* WhatsApp CTA */}
                        <a
                            href={`https://wa.me/${(appData?.phone || '').replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-white/20"
                        >
                            <svg
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="h-4 w-4"
                            >
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                            </svg>
                            Ngobrol via WhatsApp
                        </a>
                    </motion.div>

                    {/* Column 2: Quick Links */}
                    <motion.div
                        variants={itemVariants}
                        className="flex flex-col gap-5"
                    >
                        <h3 className="text-xs font-bold tracking-[0.15em] text-white/80 uppercase">
                            Eksplor
                        </h3>
                        <nav
                            className="flex flex-col gap-3"
                            aria-label="Footer navigation"
                        >
                            {quickLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="inline-block text-sm text-white/90 transition-colors duration-200 hover:translate-x-0.5 hover:text-white"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </motion.div>

                    {/* Column 3: Contact & Socials */}
                    <motion.div
                        variants={itemVariants}
                        className="flex flex-col gap-5"
                    >
                        <h3 className="text-xs font-bold tracking-[0.15em] text-white/80 uppercase">
                            Ikuti Perjalanan Kami
                        </h3>
                        <SocialIcons variant="light" />
                        <div className="mt-2">
                            <p className="text-xs leading-relaxed text-white/70">
                                Pantau terus keseruannya! Dapatkan info menu baru, intip dapur kami, dan kejutan promo eksklusif tiap bulannya.
                            </p>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Bottom bar */}
                <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 sm:flex-row">
                    <p className="text-xs text-white/70">
                        © {currentYear} {appData?.name || 'MELLBLUE'}.
                        Hak Cipta Dilindungi.
                    </p>
                    <p className="text-xs text-white/60 italic">
                        Diramu sepenuh hati, dari Samudra untukmu.
                    </p>
                </div>
            </div>
        </footer>
    );
}
