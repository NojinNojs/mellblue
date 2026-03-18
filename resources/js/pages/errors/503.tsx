import { Button } from '@/components/ui/button';
import { SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Clock, Home } from 'lucide-react';

export default function ServiceUnavailable() {
    const { appData } = usePage<SharedData>().props;
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-brand-ivory via-[#EAF0FF] to-brand-ivory p-4">
            <Head title="503 - Service Unavailable" />

            <div className="text-center">
                <div className="mb-8 flex justify-center">
                    <div className="relative">
                        <div className="h-48 w-48 rounded-full bg-gradient-to-br from-brand-blue to-brand-blue-dark shadow-2xl">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <img
                                    src="/transparant-logo.svg"
                                    alt="Logo"
                                    className="h-24 w-24 object-contain"
                                />
                            </div>
                        </div>
                        <div className="absolute top-0 -right-4 animate-pulse">
                            <Clock className="h-12 w-12 text-brand-blue" />
                        </div>
                    </div>
                </div>

                <h1 className="mb-4 text-8xl font-bold text-brand-blue">503</h1>
                <h2 className="mb-4 text-3xl font-semibold text-foreground">
                    Back Soon — We're Crafting Something! 🔧
                </h2>
                <p className="mb-8 max-w-md text-lg text-muted-foreground">
                    Our kitchen is closed for a bit while we prepare something
                    even better for you. We'll be right back!
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
                </div>

                <div className="mt-12 rounded-2xl bg-white/60 p-6 shadow-lg">
                    <p className="text-sm text-foreground/70 italic">
                        "Great things take a little time. Hang tight!"
                        <span className="mt-2 block text-xs text-primary">
                            — {appData?.name || 'MELLBLUE'}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}
