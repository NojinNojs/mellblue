import { Button } from '@/components/ui/button';
import { SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Home, Shield } from 'lucide-react';

export default function Forbidden() {
    const { appData } = usePage<SharedData>().props;
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-brand-ivory via-[#EAF0FF] to-brand-ivory p-4">
            <Head title="403 - Access Denied" />

            <div className="text-center">
                <div className="mb-8 flex justify-center">
                    <div className="relative">
                        <div className="h-48 w-48 rounded-full bg-gradient-to-br from-brand-cocoa to-[#5C4033] shadow-2xl">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <img
                                    src="/transparant-logo.svg"
                                    alt="Logo"
                                    className="h-24 w-24 object-contain brightness-0 invert opacity-60"
                                />
                            </div>
                        </div>
                        <div className="absolute top-0 -right-4 animate-bounce">
                            <Shield className="h-12 w-12 text-brand-cocoa" />
                        </div>
                    </div>
                </div>

                <h1 className="mb-4 text-8xl font-bold text-brand-cocoa">
                    403
                </h1>
                <h2 className="mb-4 text-3xl font-semibold text-foreground">
                    Access Restricted 🔒
                </h2>
                <p className="mb-8 max-w-md text-lg text-muted-foreground">
                    You don't have permission to access this area. If you
                    believe this is a mistake, please contact us.
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
                            <img
                                src="/transparant-logo.svg"
                                alt=""
                                className="h-5 w-5 object-contain"
                            />
                            Browse Products
                        </Link>
                    </Button>
                </div>

                <div className="mt-12 rounded-2xl bg-white/60 p-6 shadow-lg">
                    <p className="text-sm text-foreground/70 italic">
                        "Some paths are reserved. But there's always a sweeter
                        one waiting."
                        <span className="mt-2 block text-xs text-primary">
                            — {appData?.name || 'MELLBLUE'}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}
