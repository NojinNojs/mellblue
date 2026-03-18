import {
    ProductCard,
    ProductCardSkeleton,
} from '@/components/sections/products/product-card';
import { type Product } from '@/types';
import { PackageOpen } from 'lucide-react';

interface ProductGridProps {
    products: Product[];
    isLoading?: boolean;
}

export function ProductGrid({ products, isLoading }: ProductGridProps) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                    <ProductCardSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border-2 border-dashed p-12">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100">
                    <PackageOpen className="h-10 w-10 text-zinc-400" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">
                    No Products Found
                </h3>
                <p className="text-center text-sm text-muted-foreground">
                    We couldn't find any products matching your criteria.
                    <br />
                    Try adjusting your filters or search query.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
}
