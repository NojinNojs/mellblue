import { Button } from '@/components/ui/button';
import { SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
    const { appData } = usePage<SharedData>().props;
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-brand-ivory via-[#EAF0FF] to-brand-ivory p-4">
            <Head title="404 - Page Not Found" />

            <div className="text-center">
                <div className="mb-8 flex justify-center">
                    <div className="relative">
                        <div className="h-48 w-48 animate-bounce rounded-full bg-gradient-to-br from-brand-blue to-brand-blue-dark shadow-2xl">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <img
                                    src="/transparant-logo.svg"
                                    alt="Logo"
                                    className="h-24 w-24 object-contain"
                                />
                            </div>
                        </div>
                        <div className="absolute top-4 -right-8 h-8 w-8 animate-pulse rounded-full bg-brand-blue-light/80 shadow-lg"></div>
                        <div className="absolute bottom-8 -left-8 h-6 w-6 animate-pulse rounded-full bg-brand-blue-light/60 shadow-lg"></div>
                    </div>
                </div>

                <h1 className="mb-4 text-8xl font-bold text-brand-blue">404</h1>
                <h2 className="mb-4 text-3xl font-semibold text-foreground">
                    Page Not Found 🌊
                </h2>
                <p className="mb-8 max-w-md text-lg text-muted-foreground">
                    Looks like this page has drifted away with the current.
                    Let's get you back to something delicious.
                </p>

                <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                    <Button
                        asChild
                        size="lg"
                        className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                        <Link href="/">
                            <Home className="h-5 w-5" />
                            Back to Home
                        </Link>
                    </Button>
                    <Button
                        asChild
                        variant="outline"
                        size="lg"
                        className="gap-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    >
                        <Link href="/products">
                            <Search className="h-5 w-5" />
                            Browse Products
                        </Link>
                    </Button>
                </div>

                <div className="mt-12 rounded-2xl bg-white/60 p-6 shadow-lg">
                    <p className="text-sm text-foreground/70 italic">
                        "Even on a detour, good things find their way to you."
                        <span className="mt-2 block text-xs text-primary">
                            — {appData?.name || 'MELLBLUE'}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}
