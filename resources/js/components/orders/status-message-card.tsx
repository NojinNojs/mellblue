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
            title: 'Order in Progress',
            gradient: 'from-amber-50 to-orange-50',
            border: 'border-amber-200',
            iconBg: 'bg-amber-600',
            message:
                "Your items are being carefully prepared for shipment. We're ensuring everything is perfect before it reaches you!",
            quote: 'Good things take time.',
            author: 'MELLBLUE',
        },
        shipping: {
            icon: Truck,
            title: 'On the Way!',
            gradient: 'from-blue-50 to-cyan-50',
            border: 'border-blue-200',
            iconBg: 'bg-blue-600',
            message:
                'Your order is on its way! Track your package using the tracking number below.',
            quote: 'Every journey begins with a single step.',
            author: 'Lao Tzu',
        },
        completed: {
            icon: CheckCircle,
            title: 'Order Delivered',
            gradient: 'from-green-50 to-emerald-50',
            border: 'border-green-200',
            iconBg: 'bg-green-600',
            message:
                'Your order has been successfully delivered! We hope you enjoy our products. Thank you for choosing MELLBLUE!',
            quote: 'Sweet treats make sweet memories.',
            author: 'MELLBLUE',
        },
        cancelled: {
            icon: XCircle,
            title: 'Order Cancelled',
            gradient: 'from-red-50 to-rose-50',
            border: 'border-red-200',
            iconBg: 'bg-red-600',
            message:
                'This order has been cancelled. If you have any questions or would like to place a new order, please do not hesitate to contact us.',
            quote: '',
            author: '',
        },
        payment_rejected: {
            icon: AlertCircle,
            title: 'Payment Rejected',
            gradient: 'from-red-50 to-orange-50',
            border: 'border-red-200',
            iconBg: 'bg-red-600',
            message:
                'We could not verify your payment. Please check your payment details or try uploading the proof again. If you believe this is an error, please contact support.',
            quote: 'Failure is simply the opportunity to begin again, this time more intelligently.',
            author: 'Henry Ford',
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
