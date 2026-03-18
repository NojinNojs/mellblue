import { cn } from '@/lib/utils';
import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';


interface BrandLogoProps {
    variant?: 'dark' | 'light';
    className?: string;
}

export default function BrandLogo({
    variant = 'dark',
    className,
}: BrandLogoProps) {
    const { appData } = usePage<SharedData>().props;
    return (
        <div className={cn('flex items-center gap-2', className)}>
            <img
                src="/transparant-logo.svg"
                alt="Logo"
                className={cn(
                    "h-10 w-auto shrink-0 object-contain",
                    variant === 'light' && "brightness-0 invert"
                )}
            />
            <div className="flex flex-col justify-center pt-1">
                <span
                    className={cn(
                        'text-xl font-bold tracking-tight uppercase leading-none',
                        variant === 'light' ? 'text-white' : 'text-foreground',
                    )}
                >
                    {appData?.name || 'MELLBLUE'}
                </span>
                <span
                    className={cn(
                        'text-[0.7rem] font-semibold tracking-[0.2em] uppercase mt-0.5',
                        variant === 'light' ? 'text-white/70' : 'text-foreground/70',
                    )}
                >
                    Ocean Milk & Dessert
                </span>
            </div>
        </div>
    );
}
