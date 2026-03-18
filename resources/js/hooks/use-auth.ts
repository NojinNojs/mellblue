import type { SharedData, User } from '@/types';
import { usePage } from '@inertiajs/react';

export function useAuth() {
    const { auth } = usePage<SharedData>().props;

    return {
        user: auth.user as User | null,
        isAuthenticated: !!auth.user,
        isAdmin: auth.user?.role === 'admin',
    };
}
