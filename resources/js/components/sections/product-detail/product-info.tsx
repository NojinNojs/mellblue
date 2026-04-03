import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { type Product } from '@/types';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Check, PackageX, ShoppingBag } from 'lucide-react';
import { useState } from 'react';

interface ProductInfoProps {
    product: Product;
}

// Format price to Indonesian format
function formatPrice(price: number): string {
    return new Intl.NumberFormat('id-ID', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
}

export function ProductInfo({ product }: ProductInfoProps) {
    const [selectedVariant, setSelectedVariant] = useState(
        product.variants && product.variants.length > 0
            ? product.variants[0]
            : null,
    );

    const isAvailable = product.status === 'active';
    const hasVariants = product.variants && product.variants.length > 0;

    // Determine the current stock and price based on selected variant (if any)
    const currentPrice = selectedVariant
        ? product.base_price + selectedVariant.price_adjustment
        : product.base_price;

    const currentStock = selectedVariant
        ? selectedVariant.stock
        : product.available_stock;

    const isCurrentlyInStock = isAvailable && currentStock > 0;

    return (
        <div className="flex flex-col sm:px-2 lg:px-4">
            {/* Headers & Badges */}
            <div className="mb-6 flex flex-wrap items-center gap-2">
                {isCurrentlyInStock ? (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                        <Check className="mr-1 h-3 w-3" /> Tersedia
                    </Badge>
                ) : (
                    <Badge variant="destructive">
                        <PackageX className="mr-1 h-3 w-3" /> Habis
                    </Badge>
                )}
                <Badge variant="outline" className="text-muted-foreground">
                    {product.category || 'Tanpa Kategori'}
                </Badge>
            </div>

            <h1 className="mb-2 text-3xl leading-tight font-bold sm:text-4xl">
                {product.name}
            </h1>

            <div className="mb-6 flex items-baseline gap-2">
                <span className="text-xl font-medium text-muted-foreground">
                    Rp
                </span>
                <span className="text-4xl font-bold tracking-tight text-foreground">
                    {formatPrice(currentPrice)}
                </span>
            </div>

            <Separator className="mb-6" />

            {/* Description */}
            <div className="mb-8 space-y-4">
                <h3 className="text-lg font-semibold">Tentang Produk Ini</h3>
                <p className="leading-relaxed whitespace-pre-wrap text-muted-foreground">
                    {product.description}
                </p>
            </div>

            {/* Variants Selector */}
            {hasVariants && (
                <div className="mb-8 space-y-4">
                    <h3 className="text-lg font-semibold">Pilih Varian</h3>
                    <div className="flex flex-wrap gap-2">
                        {product
                            .variants!.filter((v) => v.status !== 'archived')
                            .map((variant) => (
                                <Button
                                    key={variant.id}
                                    variant={
                                        selectedVariant?.id === variant.id
                                            ? 'default'
                                            : 'outline'
                                    }
                                    onClick={() => setSelectedVariant(variant)}
                                    className={cn(
                                        selectedVariant?.id === variant.id
                                            ? 'ring-2 ring-primary ring-offset-1'
                                            : '',
                                        variant.status === 'out_of_stock' ||
                                            variant.stock <= 0
                                            ? 'opacity-50'
                                            : '',
                                    )}
                                    disabled={
                                        variant.status === 'out_of_stock' ||
                                        variant.stock <= 0
                                    }
                                >
                                    {variant.name}
                                    {variant.price_adjustment > 0
                                        ? ` (+Rp${formatPrice(variant.price_adjustment)})`
                                        : ''}
                                    {variant.price_adjustment < 0
                                        ? ` (-Rp${formatPrice(Math.abs(variant.price_adjustment))})`
                                        : ''}
                                </Button>
                            ))}
                    </div>
                </div>
            )}

            <Separator className="mb-8" />

            {/* Actions */}
            <motion.div
                whileHover={isCurrentlyInStock ? { scale: 1.01 } : {}}
                whileTap={isCurrentlyInStock ? { scale: 0.99 } : {}}
                className="mt-auto md:mt-0"
            >
                <Button
                    size="lg"
                    className="w-full sm:h-14 sm:text-lg"
                    disabled={!isCurrentlyInStock}
                    asChild={isCurrentlyInStock}
                >
                    {isCurrentlyInStock ? (
                        <Link
                            href={`/checkout?product_id=${product.public_id}${selectedVariant ? `&variant_id=${selectedVariant.id}` : ''}`}
                        >
                            <ShoppingBag className="mr-2 h-5 w-5" />
                            Pesan Sekarang
                        </Link>
                    ) : (
                        <span>Saat Ini Tidak Tersedia</span>
                    )}
                </Button>
            </motion.div>

            <p className="mt-4 text-center text-sm text-muted-foreground">
                Sisa stok:{' '}
                <span className="font-semibold">{currentStock}</span>
            </p>
        </div>
    );
}
