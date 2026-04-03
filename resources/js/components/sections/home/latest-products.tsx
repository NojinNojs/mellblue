import { ProductCard } from '@/components/sections/products/product-card';
import { type Product } from '@/types';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface LatestProductsProps {
    latestProducts: Product[];
}

export function LatestProducts({ latestProducts }: LatestProductsProps) {
    return (
        <section className="py-16 sm:py-24">
            <div className="container mx-auto px-4">
                <div className="mb-12 flex items-end justify-between">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="mb-2 inline-block text-xs font-semibold tracking-widest text-brand-blue-dark uppercase">
                            Segar dari Dapur
                        </span>
                        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                            Produk Unggulan Kami
                        </h2>
                        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                            Dibuat dengan penuh cinta untuk menemani harimu.
                        </p>
                    </motion.div>
                    <Link
                        href="/products"
                        className="hidden items-center gap-2 text-sm font-semibold text-brand-blue-dark hover:underline sm:flex"
                    >
                        Lihat semua <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
                    {latestProducts.map((product, index) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{
                                duration: 0.5,
                                delay: index * 0.08,
                            }}
                        >
                            <ProductCard product={product} />
                        </motion.div>
                    ))}
                </div>

                <div className="mt-8 flex justify-center sm:hidden">
                    <Link
                        href="/products"
                        className="flex items-center gap-2 text-sm font-semibold text-brand-blue-dark hover:underline"
                    >
                        Lihat semua produk <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
