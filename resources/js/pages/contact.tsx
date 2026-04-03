import { SharedData } from '@/types';
import UserLayout from '@/layouts/user-layout';
import { Head, usePage } from '@inertiajs/react';
import { Clock, Instagram, Phone } from 'lucide-react';

export default function Contact() {
    const { appData } = usePage<SharedData>().props;
    const phoneClean = (appData?.phone || '').replace(/[^0-9]/g, '');
    const waUrl = `https://wa.me/${phoneClean}?text=${encodeURIComponent('Halo! Saya ingin mengetahui lebih lanjut tentang produk MELLBLUE.')}`;

    return (
        <UserLayout>
            <Head title="Contact – MELLBLUE" />

            <div className="mx-auto max-w-2xl px-6 py-20">
                {/* Header */}
                <div className="mb-12">
                    <p className="mb-2 text-xs font-bold tracking-[0.2em] text-brand-blue-dark/60 uppercase">
                        Hubungi Kami
                    </p>
                    <h1 className="text-4xl font-bold tracking-tight text-foreground">
                        Kontak
                    </h1>
                    <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                        Untuk pemesanan, pertanyaan, atau hal lainnya — kami siap membantu. Cara tercepat menghubungi kami adalah melalui WhatsApp.
                    </p>
                </div>

                {/* WhatsApp — Primary CTA */}
                <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 rounded-2xl bg-[#25D366] px-6 py-5 text-white shadow-lg transition-all duration-200 hover:bg-[#1db954] hover:shadow-xl"
                >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/20">
                        <svg
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="h-6 w-6"
                        >
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-semibold opacity-80">
                            Chat bersama kami
                        </p>
                        <p className="text-lg font-bold">
                            {appData?.phone || 'WhatsApp'}
                        </p>
                    </div>
                    <svg
                        className="h-5 w-5 opacity-60 transition-transform duration-200 group-hover:translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                </a>

                {/* Contact Details */}
                <div className="mt-6 divide-y divide-border rounded-2xl border bg-card">
                    {/* Phone */}
                    <div className="flex items-center gap-4 px-6 py-4">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">
                                Telepon
                            </p>
                            <p className="text-sm font-medium text-foreground">
                                {appData?.phone || '-'}
                            </p>
                        </div>
                    </div>

                    {/* Instagram */}
                    {appData?.instagram && (
                        <a
                            href={appData.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-muted/40"
                        >
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                                <Instagram className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-muted-foreground">
                                    Instagram
                                </p>
                                <p className="text-sm font-medium text-foreground">
                                    @mellocianblue
                                </p>
                            </div>
                            <svg
                                className="h-4 w-4 text-muted-foreground"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                />
                            </svg>
                        </a>
                    )}

                    {/* Hours */}
                    <div className="flex items-center gap-4 px-6 py-4">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">
                                Jam Operasional
                            </p>
                            <p className="text-sm font-medium text-foreground">
                                Senin – Sabtu, 09.00 – 18.00 WIB
                            </p>
                        </div>
                    </div>
                </div>

                {/* FAQ */}
                <div className="mt-10">
                    <h2 className="mb-4 text-base font-semibold text-foreground">
                        Pertanyaan Umum
                    </h2>
                    <div className="space-y-4">
                        {[
                            {
                                q: 'Bagaimana cara memesan?',
                                a: 'Kunjungi halaman produk kami dan pilih item yang diinginkan, atau hubungi kami melalui WhatsApp untuk pesanan khusus.',
                            },
                            {
                                q: 'Apakah bisa pesan di luar Jakarta?',
                                a: 'Saat ini kami hanya melayani pengiriman di wilayah Jakarta.',
                            },
                            {
                                q: 'Apakah menerima pesanan dalam jumlah banyak?',
                                a: 'Ya. Hubungi kami melalui WhatsApp untuk informasi harga dan ketersediaan.',
                            },
                        ].map((faq) => (
                            <div
                                key={faq.q}
                                className="rounded-xl border bg-card px-5 py-4"
                            >
                                <p className="text-sm font-semibold text-foreground">
                                    {faq.q}
                                </p>
                                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                                    {faq.a}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
