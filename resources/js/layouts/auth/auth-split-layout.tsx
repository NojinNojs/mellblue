import BrandLogo from '@/components/BrandLogo';
import { home } from '@/routes';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    title?: string;
    description?: string;
    quote?: {
        message: string;
        author: string;
    };
    bgImage?: string;
}

export default function AuthSplitLayout({
    children,
    title,
    description,
    quote,
    bgImage,
}: PropsWithChildren<AuthLayoutProps>) {
    const { quote: defaultQuote } = usePage<SharedData>().props;
    const displayQuote = quote || defaultQuote;

    return (
        <div className="relative flex min-h-screen flex-col bg-foreground lg:grid lg:grid-cols-2">
            {/* Top / Left Panel - Royal Blue brand panel */}
            <div className="relative flex min-h-[35vh] w-full flex-col overflow-hidden bg-black p-6 text-white sm:min-h-[40vh] lg:h-full lg:min-h-screen lg:justify-between lg:p-10">
                {/* Background image - clear and visible */}
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: `url(${bgImage || '/hero-brownie.png'})`,
                    }}
                />

                {/* Top gradient: black fading down for logo readability */}
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            'linear-gradient(to bottom, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.15) 30%, transparent 45%)',
                    }}
                />

                {/* Bottom gradient: black fading up for quote readability */}
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.40) 40%, transparent 60%)',
                    }}
                />

                <Link
                    href={home()}
                    className="relative z-20 mb-4 flex items-center lg:mb-8"
                >
                    <BrandLogo variant="light" />
                </Link>

                {/* Narrative - Hidden on smaller screens to save space, visible on large */}
                <div className="relative z-20 mt-auto hidden space-y-6 lg:block">
                    <div className="space-y-2">
                        <p className="text-sm font-medium tracking-wider text-primary uppercase">
                            Modern Artisanal · Bold by Nature
                        </p>
                        <h2 className="font-display text-4xl leading-tight font-normal text-white italic">
                            "You did a great job today."
                        </h2>
                        {displayQuote && (
                            <p className="max-w-md text-base leading-relaxed text-white/80">
                                {displayQuote.message}
                            </p>
                        )}
                    </div>
                </div>

                {/* Mobile simple narrative */}
                <div className="relative z-20 mt-auto mb-4 block lg:hidden">
                    <h2 className="font-display text-2xl leading-tight font-normal text-white italic">
                        "You did a great job today."
                    </h2>
                </div>
            </div>

            {/* Bottom / Right Panel - Form (BottomSheet style on mobile) */}
            <div className="relative z-20 -mt-8 flex w-full flex-1 flex-col items-center justify-center rounded-t-[2.5rem] bg-background px-6 py-10 shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.3)] sm:px-8 lg:-mt-0 lg:rounded-none lg:p-12 lg:shadow-none">
                <div className="mx-auto flex w-full max-w-md flex-col space-y-8">
                    {/* Header */}
                    <div className="flex flex-col space-y-2 text-center lg:text-left">
                        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
                            {title}
                        </h1>
                        <p className="text-sm text-foreground/60">
                            {description}
                        </p>
                    </div>

                    {/* Form Content */}
                    {children}
                </div>
            </div>
        </div>
    );
}
