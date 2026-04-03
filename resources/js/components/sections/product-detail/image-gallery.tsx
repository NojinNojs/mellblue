import { cn } from '@/lib/utils';
import { type Product } from '@/types';
import { useState } from 'react';

interface ImageGalleryProps {
    product: Product;
}

export function ImageGallery({ product }: ImageGalleryProps) {
    const hasImages = product.images && product.images.length > 0;
    const [selectedImage, setSelectedImage] = useState(
        hasImages ? product.images![0] : null,
    );

    if (!hasImages) {
        return (
            <div className="flex aspect-[3/4] w-full flex-col items-center justify-center rounded-xl border bg-muted/30">
                <div className="h-16 w-16 opacity-20" />
                <span className="mt-4 text-sm font-medium tracking-wider text-muted-foreground uppercase">
                    Gambar Tidak Tersedia
                </span>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 lg:max-w-md lg:mx-auto w-full">
            {/* Main Image */}
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl border bg-muted/30">
                <img
                    src={selectedImage?.url}
                    alt={product.name}
                    className="h-full w-full object-cover transition-all duration-300"
                />
            </div>

            {/* Thumbnail Navigation */}
            {product.images!.length > 1 && (
                <div className="grid grid-cols-4 gap-3 sm:gap-4">
                    {product.images!.map((image) => (
                        <button
                            key={image.id}
                            onClick={() => setSelectedImage(image)}
                            className={cn(
                                'relative aspect-[3/4] overflow-hidden rounded-lg border-2 transition-all hover:opacity-100',
                                selectedImage?.id === image.id
                                    ? 'border-primary opacity-100 ring-2 ring-primary/20 ring-offset-1'
                                    : 'border-transparent opacity-60',
                            )}
                        >
                            <img
                                src={image.url}
                                alt={`${product.name} thumbnail`}
                                className="h-full w-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
