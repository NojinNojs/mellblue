import { Button } from '@/components/ui/button';
import { SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Home, RefreshCw } from 'lucide-react';

export default function ServerError() {
    const { appData } = usePage<SharedData>().props;
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-brand-ivory via-[#EAF0FF] to-brand-ivory p-4">
            <Head title="500 - Server Error" />

            <div className="text-center">
                <div className="mb-8 flex justify-center">
                    <div className="relative">
                        <div className="h-48 w-48 rounded-full bg-gradient-to-br from-brand-blue to-brand-blue-dark shadow-2xl">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <img
                                    src="/transparant-logo.svg"
                                    alt="Logo"
                                    className="h-24 w-24 object-contain brightness-0 invert opacity-50"
                                />
                            </div>
                        </div>
                        <div
                            className="absolute top-8 -right-8 h-6 w-6 animate-bounce rounded-full bg-brand-blue-light/80 shadow-lg"
                            style={{ animationDelay: '0s' }}
                        ></div>
                        <div
                            className="absolute top-16 -left-8 h-4 w-4 animate-bounce rounded-full bg-brand-blue-light/60 shadow-lg"
                            style={{ animationDelay: '0.2s' }}
                        ></div>
                        <div
                            className="absolute right-4 -bottom-4 h-5 w-5 animate-bounce rounded-full bg-brand-blue-light/70 shadow-lg"
                            style={{ animationDelay: '0.4s' }}
                        ></div>
                    </div>
                </div>

                <h1 className="mb-4 text-8xl font-bold text-brand-blue">500</h1>
                <h2 className="mb-4 text-3xl font-semibold text-foreground">
                    Something Went Wrong 💥
                </h2>
                <p className="mb-8 max-w-md text-lg text-muted-foreground">
                    There was an unexpected hiccup on our end. Our team is
                    already working to fix it. Please try again in a moment.
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
                        variant="outline"
                        size="lg"
                        className="gap-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                        onClick={() => window.location.reload()}
                    >
                        <RefreshCw className="h-5 w-5" />
                        Try Again
                    </Button>
                </div>

                <div className="mt-12 rounded-2xl bg-white/60 p-6 shadow-lg">
                    <p className="text-sm text-foreground/70 italic">
                        "Even the ocean has turbulent days. We'll be smooth
                        sailing soon."
                        <span className="mt-2 block text-xs text-primary">
                            — {appData?.name || 'MELLBLUE'}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}
