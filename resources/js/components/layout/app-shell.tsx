import { SidebarProvider } from '@/components/ui/sidebar';
import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

interface AppShellProps {
    children: React.ReactNode;
    variant?: 'header' | 'sidebar';
}

export function AppShell({ children, variant = 'header' }: AppShellProps) {
    const serverIsOpen = usePage<SharedData>().props.sidebarOpen;

    // Read directly from cookie on client to prevent state jumping/reverting
    // during Inertia unmount/remount cycles.
    const getSidebarState = () => {
        if (typeof document !== 'undefined') {
            const match = document.cookie.match(
                new RegExp('(^| )sidebar_state=([^;]+)'),
            );
            if (match) {
                return match[2] === 'true';
            }
        }
        return serverIsOpen;
    };

    const isOpen = getSidebarState();

    if (variant === 'header') {
        return (
            <div className="flex min-h-screen w-full flex-col">{children}</div>
        );
    }

    return <SidebarProvider defaultOpen={isOpen}>{children}</SidebarProvider>;
}
