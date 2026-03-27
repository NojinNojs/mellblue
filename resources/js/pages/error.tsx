import { Link } from '@inertiajs/react';
import { Head } from '@inertiajs/react';

interface ErrorPageProps {
    status: number;
}

const errorConfig: Record<
    number,
    { title: string; description: string }
> = {
    301: {
        title: 'Moved Permanently',
        description: 'This page has moved to a new location.',
    },
    302: {
        title: 'Redirecting',
        description: "You're being redirected.",
    },
    400: {
        title: 'Bad Request',
        description:
            'The request could not be understood. Please check your input and try again.',
    },
    401: {
        title: 'Unauthorized',
        description: "You need to log in to access this page.",
    },
    403: {
        title: 'Forbidden',
        description: "You don't have permission to access this page.",
    },
    404: {
        title: 'Page Not Found',
        description:
            "The page you're looking for doesn't exist or has been moved.",
    },
    419: {
        title: 'Session Expired',
        description: 'Your session has expired. Please refresh and try again.',
    },
    429: {
        title: 'Too Many Requests',
        description:
            "You've made too many requests. Please wait a moment and try again.",
    },
    500: {
        title: 'Server Error',
        description:
            "Something went wrong on our end. We're working on fixing it.",
    },
    503: {
        title: 'Service Unavailable',
        description:
            'The service is temporarily down for maintenance. Please check back soon.',
    },
};

export default function ErrorPage({ status }: ErrorPageProps) {
    const { title, description } = errorConfig[status] ?? {
        title: 'Unexpected Error',
        description: 'Something went wrong. Please try again.',
    };

    const isClientError = status >= 400 && status < 500;
    const isServerError = status >= 500;

    return (
        <>
            <Head title={`${status} – ${title}`} />

            <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
                <div className="w-full max-w-md text-center">
                    {/* Status code */}
                    <p
                        className="text-8xl font-bold tracking-tight"
                        style={{
                            color: isServerError
                                ? 'hsl(var(--destructive))'
                                : isClientError
                                  ? 'var(--color-brand-blue-dark, #1a3a5c)'
                                  : 'hsl(var(--muted-foreground))',
                        }}
                    >
                        {status}
                    </p>

                    {/* Divider */}
                    <div className="mx-auto my-6 h-px w-16 bg-border" />

                    {/* Title */}
                    <h1 className="text-2xl font-semibold text-foreground">
                        {title}
                    </h1>

                    {/* Description */}
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {description}
                    </p>

                    {/* Actions */}
                    <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                        <Link
                            href="/"
                            className="inline-flex items-center rounded-lg bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-80"
                        >
                            Go to Homepage
                        </Link>
                        <button
                            onClick={() => window.history.back()}
                            className="inline-flex items-center rounded-lg border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
