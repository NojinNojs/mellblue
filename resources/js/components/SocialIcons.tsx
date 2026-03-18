import { cn } from '@/lib/utils';
import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { Instagram } from 'lucide-react';

interface SocialIconsProps {
    variant?: 'dark' | 'light';
    className?: string;
}

export default function SocialIcons({
    variant = 'dark',
    className,
}: SocialIconsProps) {
    const { appData } = usePage<SharedData>().props;
    const iconClass = cn(
        'size-5 transition-colors',
        variant === 'light'
            ? 'text-[#F2EFE9]/70 hover:text-[#F2EFE9]'
            : 'text-muted-foreground hover:text-primary',
    );

    return (
        <div className={cn('flex items-center gap-4', className)}>
            <a
                href={appData.instagram || '#'}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
            >
                <Instagram className={iconClass} />
            </a>
            <a
                href={appData.tiktok || '#'}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
            >
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={iconClass}
                >
                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                </svg>
            </a>
        </div>
    );
}
