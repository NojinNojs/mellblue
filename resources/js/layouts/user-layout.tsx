import Footer from '@/components/layout/footer';
import Navbar from '@/components/nav/navbar/navbar';
import { Toaster } from '@/components/ui/sonner';
import { type ReactNode } from 'react';

interface UserLayoutProps {
    children: ReactNode;
}

export default function UserLayout({ children }: UserLayoutProps) {
    return (
        <div className="relative flex min-h-screen flex-col bg-background font-sans text-foreground antialiased">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <Toaster richColors position="top-right" />
        </div>
    );
}
