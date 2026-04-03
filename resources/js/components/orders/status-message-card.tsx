import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
    AlertCircle,
    CheckCircle,
    Package,
    Truck,
    XCircle,
} from 'lucide-react';

interface StatusMessageCardProps {
    status: string;
}

export function StatusMessageCard({ status }: StatusMessageCardProps) {
    const validStatuses = [
        'processing',
        'shipping',
        'completed',
        'cancelled',
        'payment_rejected',
    ];

    if (!validStatuses.includes(status)) {
        return null;
    }

    const statusConfig = {
        processing: {
            icon: Package,
            title: 'Pesanan Lagi Dibuat',
            gradient: 'from-amber-50 to-orange-50',
            border: 'border-amber-200',
            iconBg: 'bg-amber-600',
            message:
                "Item pesananmu lagi kami bungkus rapi dengan standar kebersihan tertinggi. Makanan enak butuh proses, jadi sabar sedikit ya!",
            quote: 'Sabar ya, yang nikmat butuh waktu.',
            author: 'MELLBLUE',
        },
        shipping: {
            icon: Truck,
            title: 'Paket Sedang Meluncur!',
            gradient: 'from-blue-50 to-cyan-50',
            border: 'border-blue-200',
            iconBg: 'bg-blue-600',
            message:
                'Pesananmu sedang dalam perjalanan nih. Jangan lupa standby ya buat nerima paket dari abang kurir.',
            quote: 'Hari yang manis sudah semakin dekat.',
            author: 'MELLBLUE',
        },
        completed: {
            icon: CheckCircle,
            title: 'Pesanan Mendarat!',
            gradient: 'from-green-50 to-emerald-50',
            border: 'border-green-200',
            iconBg: 'bg-green-600',
            message:
                'Terima kasih sudah percayain cemilan dan minuman di MELLBLUE! Jangan lupa repeat order ya kalau ketagihan, karena ini enak banget.',
            quote: 'Cemilan manis membawa memori yang manis juga.',
            author: 'MELLBLUE',
        },
        cancelled: {
            icon: XCircle,
            title: 'Pesanan Dibatalkan',
            gradient: 'from-red-50 to-rose-50',
            border: 'border-red-200',
            iconBg: 'bg-red-600',
            message:
                'Sayang sekali orderan ini dibatalkan. Kalau ada kendala pemesanan atau bingung caranya, langsung kabari admin di WA ya.',
            quote: '',
            author: '',
        },
        payment_rejected: {
            icon: AlertCircle,
            title: 'Pembayaran Belum Berhasil',
            gradient: 'from-red-50 to-orange-50',
            border: 'border-red-200',
            iconBg: 'bg-red-600',
            message:
                'Mohon maaf, sistem kami belum bisa verifikasi pembayaranmu nih. Coba upload ulang foto buktinya yang lebih jelas ya. Kalau butuh bantuan, yuk chat WA kami.',
            quote: 'Jangan menyerah dulu, yang manis masih menantimu.',
            author: 'MELLBLUE',
        },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;

    return (
        <Card className={`overflow-hidden border-2 shadow-lg ${config.border}`}>
            <div className={`bg-gradient-to-br p-6 ${config.gradient}`}>
                <div className="mb-4 flex items-start gap-3">
                    <div className={`rounded-full p-2 ${config.iconBg}`}>
                        <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-foreground">
                            {config.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                            {config.message}
                        </p>
                    </div>
                </div>
                {config.quote && (
                    <>
                        <Separator className="my-4" />
                        <div className="rounded-lg bg-background/60 p-4 backdrop-blur-sm">
                            <p className="text-sm leading-relaxed text-foreground/80 italic">
                                "{config.quote}"
                            </p>
                            <p className="mt-2 text-xs font-semibold text-muted-foreground">
                                — {config.author}
                            </p>
                        </div>
                    </>
                )}
            </div>
        </Card>
    );
}
