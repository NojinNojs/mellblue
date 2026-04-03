import { cn } from '@/lib/utils';
import { type Product } from '@/types';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Box, Eye, ShoppingCart, Tag } from 'lucide-react';

interface ProductCardProps {
    product: Product;
    className?: string;
}

function formatPrice(price: number): string {
    return new Intl.NumberFormat('id-ID', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
}

function isNew(createdAt?: string | null): boolean {
    if (!createdAt) return false;
    const diff = Date.now() - new Date(createdAt).getTime();
    return diff < 1000 * 60 * 60 * 24 * 14; // within 14 days
}

export function ProductCard({ product, className }: ProductCardProps) {
    const hasImage = product.images && product.images.length > 0;
    const coverImage = hasImage ? product.images![0].url : null;
    const isAvailable = product.status === 'active';
    const stockLow =
        isAvailable &&
        product.available_stock > 0 &&
        product.available_stock <= 5;
    const outOfStock = !isAvailable || product.available_stock === 0;
    const newProduct = isNew(product.created_at);

    return (
        <Link href={`/products/${product.public_id || product.slug}`}>
            <motion.div
                whileHover={isAvailable ? { y: -4 } : {}}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className={cn('h-full', !isAvailable && 'opacity-75')}
            >
                <div
                    className={cn(
                        'group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-300',
                        isAvailable && 'hover:shadow-lg hover:border-primary/30',
                        className,
                    )}
                >
                    {/* Image */}
                    <div className="relative aspect-square w-full overflow-hidden bg-muted/30">
                        {/* Badges row */}
                        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                            {newProduct && isAvailable && (
                                <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground shadow">
                                    Baru
                                </span>
                            )}
                            {stockLow && (
                                <span className="rounded-full bg-orange-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow">
                                    Stok terbatas
                                </span>
                            )}
                        </div>

                        {outOfStock && (
                            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                                <span className="rounded-full bg-black/70 px-3 py-1 text-xs font-bold text-white">
                                    Habis Terjual
                                </span>
                            </div>
                        )}

                        {hasImage ? (
                            <img
                                src={coverImage!}
                                alt={product.name}
                                className={cn(
                                    'h-full w-full object-cover transition-transform duration-500',
                                    isAvailable && 'group-hover:scale-105',
                                    !isAvailable && 'grayscale-[0.4]',
                                )}
                            />
                        ) : (
                            <div className="flex h-full w-full flex-col items-center justify-center bg-muted text-muted-foreground">
                                <Box className="h-10 w-10 opacity-30" />
                                <span className="mt-2 text-[10px] font-medium uppercase tracking-widest opacity-30">
                                    No Image
                                </span>
                            </div>
                        )}

                        {/* Hover overlay */}
                        {isAvailable && (
                            <div className="absolute inset-0 z-10 flex items-end justify-center gap-2 bg-black/0 p-3 opacity-0 transition-all duration-300 group-hover:bg-primary/20 group-hover:opacity-100">
                                <div className="flex translate-y-2 gap-2 transition-transform duration-300 group-hover:translate-y-0">
                                    <div className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-foreground shadow-lg">
                                        <Eye className="h-3.5 w-3.5" />
                                        Lihat
                                    </div>
                                    <div className="flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-lg">
                                        <ShoppingCart className="h-3.5 w-3.5" />
                                        Pesan
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex flex-1 flex-col gap-2 p-3">
                        {/* Category pill */}
                        {product.category && (
                            <div className="flex items-center gap-1">
                                <Tag className="h-3 w-3 text-muted-foreground" />
                                <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                                    {product.category}
                                </span>
                            </div>
                        )}

                        {/* Name */}
                        <h3 className="line-clamp-2 text-sm font-bold leading-snug text-foreground transition-colors group-hover:text-primary">
                            {product.name}
                        </h3>

                        {/* Price + Stock */}
                        <div className="mt-auto flex items-end justify-between">
                            <div className="flex items-baseline gap-0.5">
                                <span className="text-xs font-semibold text-muted-foreground">
                                    Rp
                                </span>
                                <span className="text-lg font-bold text-foreground">
                                    {formatPrice(product.base_price)}
                                </span>
                            </div>
                            <span
                                className={cn(
                                    'text-[11px] font-semibold',
                                    outOfStock
                                        ? 'text-red-500'
                                        : stockLow
                                          ? 'text-orange-500'
                                          : 'text-green-600',
                                )}
                            >
                                {outOfStock
                                    ? 'Habis'
                                    : stockLow
                                      ? `Sisa ${product.available_stock}`
                                      : `${product.available_stock} tersedia`}
                            </span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
}

export function ProductCardSkeleton() {
    return (
        <div className="flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-sm">
            <div className="aspect-square w-full animate-pulse bg-muted" />
            <div className="flex flex-col gap-2 p-3">
                <div className="h-3 w-16 animate-pulse rounded-full bg-muted" />
                <div className="h-4 w-full animate-pulse rounded bg-muted" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
                <div className="mt-1 flex justify-between">
                    <div className="h-6 w-24 animate-pulse rounded bg-muted" />
                    <div className="h-4 w-16 animate-pulse rounded bg-muted" />
                </div>
            </div>
        </div>
    );
}
