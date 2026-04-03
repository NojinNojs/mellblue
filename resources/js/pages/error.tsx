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
        title: 'Halaman Pindah',
        description: 'Wah, sepertinya halaman yang kamu cari sudah pindah ke tempat baru.',
    },
    302: {
        title: 'Lagi Dialihkan',
        description: "Tunggu sebentar ya, kami sedang mengarahkanmu.",
    },
    400: {
        title: 'Permintaan Keliru',
        description:
            'Aduh, sistem kami agak bingung dengan permintaan ini. Coba cek lagi ya.',
    },
    401: {
        title: 'Belum Masuk Nih',
        description: "Kamu harus login dulu ya buat akses halaman ini.",
    },
    403: {
        title: 'Akses Dibatasi',
        description: "Waduh, sepertinya kamu belum punya izin buat masuk ke halaman ini.",
    },
    404: {
        title: 'Waduh, Kesasar?',
        description:
            "Halaman yang kamu cari sepertinya nggak ada atau udah dipindah nih. Yuk balik ke jalan yang benar.",
    },
    419: {
        title: 'Sesi Habis',
        description: 'Sesi kamu udah habis. Coba refresh halaman ini dan masuk lagi ya.',
    },
    429: {
        title: 'Terlalu Cepat!',
        description:
            "Wah, permintaanmu terlalu banyak nih. Istirahat sebentar dan coba lagi nanti ya.",
    },
    500: {
        title: 'Sistem Lagi Rewel',
        description:
            "Aduh, dapur kami lagi ada sedikit kendala teknis. Teknisi kami lagi beresin kok, tunggu sebentar ya.",
    },
    503: {
        title: 'Lagi Berbenah',
        description:
            'Kami sedang melakukan perbaikan agar pelayanan lebih maksimal. Coba balik lagi nanti ya.',
    },
};

export default function ErrorPage({ status }: ErrorPageProps) {
    const { title, description } = errorConfig[status] ?? {
        title: 'Ada yang Salah Nih',
        description: 'Duh, terjadi kesalahan yang nggak terduga. Coba lagi atau hubungi kami ya.',
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
                            Balik ke Beranda
                        </Link>
                        <button
                            onClick={() => window.history.back()}
                            className="inline-flex items-center rounded-lg border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                        >
                            Kembali ke Sebelumnya
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
