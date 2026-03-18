import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { type Product } from '@/types';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Box } from 'lucide-react';

interface ProductCardProps {
    product: Product;
    className?: string;
}

const statusLabels: Record<string, string> = {
    active: 'Available',
    sold_out: 'Sold Out',
    archived: 'Archived',
};

// Format price to Indonesian format
function formatPrice(price: number): string {
    return new Intl.NumberFormat('id-ID', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
}

export function ProductCard({ product, className }: ProductCardProps) {
    const hasImage = product.images && product.images.length > 0;
    const coverImage = hasImage ? product.images![0].url : null;
    const isAvailable = product.status === 'active';

    return (
        <Link href={`/products/${product.public_id || product.slug}`}>
            <motion.div
                whileHover={isAvailable ? { y: -5 } : {}}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className={cn('h-full', !isAvailable && 'opacity-80')}
            >
                <Card
                    className={cn(
                        'group h-full overflow-hidden border bg-card shadow-sm transition-shadow',
                        isAvailable && 'hover:shadow-md',
                        className,
                    )}
                >
                    {/* Image Container - Full width at top */}
                    <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-50">
                        {/* Status Badge */}
                        {!isAvailable && (
                            <div className="absolute top-2 right-2 z-10 rounded-full bg-black/70 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
                                {statusLabels[product.status] || product.status}
                            </div>
                        )}

                        {hasImage ? (
                            <img
                                src={coverImage!}
                                alt={product.name}
                                className={cn(
                                    'h-full w-full object-cover transition-transform duration-500',
                                    isAvailable && 'group-hover:scale-105',
                                    !isAvailable && 'grayscale-[0.5]',
                                )}
                            />
                        ) : (
                            <div className="flex h-full w-full flex-col items-center justify-center bg-brand-muted text-muted-foreground">
                                <Box className="h-12 w-12 opacity-40" />
                                <span className="mt-2 text-xs font-medium tracking-wider uppercase opacity-40">
                                    No Image
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col gap-2 px-4 pt-3 pb-4">
                        {/* Title */}
                        <h3 className="line-clamp-2 text-xl leading-snug font-bold text-foreground transition-colors group-hover:text-foreground/80">
                            {product.name}
                        </h3>

                        {/* Category & Stock */}
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{product.category || 'Uncategorized'}</span>
                            <span
                                className={cn(
                                    'font-medium',
                                    product.available_stock > 0
                                        ? 'text-green-600'
                                        : 'text-red-500',
                                )}
                            >
                                {product.available_stock > 0
                                    ? `Stock: ${product.available_stock}`
                                    : 'Out of Stock'}
                            </span>
                        </div>

                        {/* Price */}
                        <div className="mt-1 flex items-baseline gap-1">
                            <span className="text-sm font-semibold text-muted-foreground">
                                Rp
                            </span>
                            <span className="text-2xl font-bold text-foreground">
                                {formatPrice(product.base_price)}
                            </span>
                        </div>
                    </div>
                </Card>
            </motion.div>
        </Link>
    );
}

export function ProductCardSkeleton() {
    return (
        <Card className="h-full overflow-hidden border shadow-sm">
            <div className="aspect-[3/4] w-full animate-pulse bg-brand-muted" />
            <div className="flex flex-col gap-2 p-4">
                <div className="h-6 w-full animate-pulse rounded bg-brand-muted" />
                <div className="h-4 w-1/3 animate-pulse rounded bg-brand-muted" />
                <div className="h-8 w-1/2 animate-pulse rounded bg-brand-muted" />
            </div>
        </Card>
    );
}
