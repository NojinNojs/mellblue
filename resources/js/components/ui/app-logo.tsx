import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

export default function AppLogo() {
    const { appData } = usePage<SharedData>().props;
    return (
        <>
            <img
                src="/transparant-logo.svg"
                alt="Logo"
                className="h-10 w-auto shrink-0 object-contain drop-shadow-sm"
            />
            <div className="ml-1 grid flex-1 text-left text-sm pt-1">
                <span className="mb-0.5 truncate leading-tight font-semibold tracking-tight">
                    {appData?.name || 'MELLBLUE'}
                </span>
            </div>
        </>
    );
}
