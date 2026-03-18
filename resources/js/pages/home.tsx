import { BrandMarquee } from '@/components/sections/home/brand-marquee';
import { CtaSection } from '@/components/sections/home/cta-section';
import { HeroSection } from '@/components/sections/home/hero-section';
import { LatestProducts } from '@/components/sections/home/latest-products';
import UserLayout from '@/layouts/user-layout';
import { SharedData, type Product } from '@/types';
import { Head, usePage } from '@inertiajs/react';

interface HomeProps {
    latestProducts: Product[];
}

export default function Home({ latestProducts }: HomeProps) {
    const { appData } = usePage<SharedData>().props;
    return (
        <UserLayout>
            <Head
                title={`${appData?.name || 'MELLBLUE'} — The Deep Ocean Blue`}
            />

            <HeroSection />
            <BrandMarquee />
            <LatestProducts latestProducts={latestProducts} />
            <CtaSection />
        </UserLayout>
    );
}
