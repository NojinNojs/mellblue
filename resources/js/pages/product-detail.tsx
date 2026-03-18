import { ImageGallery } from '@/components/sections/product-detail/image-gallery';
import { ProductInfo } from '@/components/sections/product-detail/product-info';
import { Button } from '@/components/ui/button';
import UserLayout from '@/layouts/user-layout';
import { type Product } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

interface ProductDetailProps {
    product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
    return (
        <UserLayout>
            <Head title={product.name} />

            <div className="container mx-auto px-4 py-8 pb-32 sm:py-12 sm:pb-12">
                {/* Back Button */}
                <div className="mb-6 sm:mb-8">
                    <Button
                        variant="ghost"
                        asChild
                        className="-ml-4 text-muted-foreground hover:text-foreground"
                    >
                        <Link href="/products">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Products
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-6 lg:grid-cols-2 lg:gap-6">
                    <ImageGallery product={product} />
                    <ProductInfo product={product} />
                </div>
            </div>
        </UserLayout>
    );
}
