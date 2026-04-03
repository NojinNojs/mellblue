import { OrderStatusBadge } from '@/components/ui/order-status-badge';
import UserLayout from '@/layouts/user-layout';
import { formatCurrency } from '@/lib/format';
import { type Order, type OrderItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    Ban,
    CheckCircle2,
    Clock,
    Package,
    PackageOpen,
    ShoppingBag,
    Truck,
} from 'lucide-react';
import { useMemo, useState } from 'react';

type StatusFilter =
    | 'all'
    | 'pending'
    | 'processing'
    | 'shipped'
    | 'completed'
    | 'cancelled';

export interface MyOrdersPageProps {
    orders: Order[];
}

const TAB_CONFIG: {
    value: StatusFilter;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
}[] = [
    { value: 'all', label: 'Semua', icon: ShoppingBag },
    { value: 'pending', label: 'Menunggu', icon: Clock },
    { value: 'processing', label: 'Diproses', icon: Package },
    { value: 'shipped', label: 'Dikirim', icon: Truck },
    { value: 'completed', label: 'Selesai', icon: CheckCircle2 },
    { value: 'cancelled', label: 'Dibatalkan', icon: Ban },
];

const STEP_LABELS: Record<Order['status'], string> = {
    pending: 'Pesanan dibuat',
    pending_payment: 'Menunggu pembayaran',
    waiting_confirmation: 'Pembayaran sedang ditinjau',
    paid: 'Pembayaran dikonfirmasi',
    payment_rejected: 'Pembayaran ditolak',
    processing: 'Sedang disiapkan',
    shipping: 'Dalam perjalanan',
    completed: 'Pesanan diterima',
    cancelled: 'Dibatalkan',
};

const PROGRESS: Record<Order['status'], number> = {
    pending: 10,
    pending_payment: 20,
    waiting_confirmation: 35,
    paid: 50,
    payment_rejected: 0,
    processing: 65,
    shipping: 80,
    completed: 100,
    cancelled: 0,
};

const PROGRESS_COLOR: Record<Order['status'], string> = {
    pending: 'bg-yellow-400',
    pending_payment: 'bg-yellow-400',
    waiting_confirmation: 'bg-amber-400',
    paid: 'bg-green-400',
    payment_rejected: 'bg-red-400',
    processing: 'bg-blue-400',
    shipping: 'bg-indigo-500',
    completed: 'bg-green-500',
    cancelled: 'bg-red-400',
};

export default function MyOrders({ orders }: MyOrdersPageProps) {
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

    const counts = useMemo(() => {
        const c: Record<StatusFilter, number> = {
            all: orders.length,
            pending: 0,
            processing: 0,
            shipped: 0,
            completed: 0,
            cancelled: 0,
        };
        orders.forEach((o) => {
            if (
                o.status === 'pending' ||
                o.status === 'pending_payment' ||
                o.status === 'waiting_confirmation'
            )
                c.pending++;
            else if (o.status === 'paid' || o.status === 'processing')
                c.processing++;
            else if (o.status === 'shipping') c.shipped++;
            else if (o.status === 'completed') c.completed++;
            else if (
                o.status === 'cancelled' ||
                o.status === 'payment_rejected'
            )
                c.cancelled++;
        });
        return c;
    }, [orders]);

    const filteredOrders = useMemo(() => {
        if (statusFilter === 'all') return orders;
        if (statusFilter === 'pending')
            return orders.filter(
                (o) =>
                    o.status === 'pending' ||
                    o.status === 'pending_payment' ||
                    o.status === 'waiting_confirmation',
            );
        if (statusFilter === 'processing')
            return orders.filter(
                (o) => o.status === 'paid' || o.status === 'processing',
            );
        if (statusFilter === 'shipped')
            return orders.filter((o) => o.status === 'shipping');
        if (statusFilter === 'completed')
            return orders.filter((o) => o.status === 'completed');
        if (statusFilter === 'cancelled')
            return orders.filter(
                (o) =>
                    o.status === 'cancelled' ||
                    o.status === 'payment_rejected',
            );
        return orders;
    }, [orders, statusFilter]);

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <UserLayout>
            <Head title="Pesanan Saya" />
            <div className="bg-muted/30">
                <div className="container mx-auto max-w-3xl px-4 py-8 sm:py-12">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                            Pesanan Saya
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {orders.length} total pesanan
                        </p>
                    </div>

                    {/* Tab Filter */}
                    <div className="mb-6 overflow-x-auto">
                        <div className="flex min-w-max gap-1 rounded-xl border bg-background p-1 shadow-sm">
                            {TAB_CONFIG.map(({ value, label, icon: Icon }) => {
                                const isActive = statusFilter === value;
                                const count = counts[value];
                                return (
                                    <button
                                        key={value}
                                        onClick={() => setStatusFilter(value)}
                                        className={`relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                                            isActive
                                                ? 'bg-primary text-primary-foreground shadow-sm'
                                                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                        }`}
                                    >
                                        <Icon className="h-3.5 w-3.5 shrink-0" />
                                        <span className="hidden sm:inline">
                                            {label}
                                        </span>
                                        <span className="inline sm:hidden text-xs">
                                            {label.slice(0, 3)}
                                        </span>
                                        {count > 0 && (
                                            <span
                                                className={`ml-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none tabular-nums ${
                                                    isActive
                                                        ? 'bg-white/20 text-white'
                                                        : 'bg-muted text-muted-foreground'
                                                }`}
                                            >
                                                {count}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Orders List */}
                    {filteredOrders.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-background py-20 text-center shadow-sm">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                                <ShoppingBag className="h-7 w-7 text-muted-foreground" />
                            </div>
                            <p className="mt-4 text-base font-semibold text-foreground">
                                {statusFilter === 'all'
                                    ? 'Belum ada pesanan'
                                    : `Tidak ada pesanan yang ${TAB_CONFIG.find(t => t.value === statusFilter)?.label.toLowerCase()}`}
                            </p>
                            <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                                {statusFilter === 'all'
                                    ? 'Ayo mulai belanja! Barisan kelezatan sudah menunggumu.'
                                    : `Wah, sepertinya kamu belum punya pesanan di kategori ini.`}
                            </p>
                            {statusFilter === 'all' && (
                                <Link
                                    href="/products"
                                    className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow transition hover:opacity-90"
                                >
                                    <ShoppingBag className="h-4 w-4" />
                                    Mulai Belanja
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {filteredOrders.map((order) => {
                                const progress = PROGRESS[order.status] ?? 0;
                                const progressColor =
                                    PROGRESS_COLOR[order.status] ??
                                    'bg-primary';
                                const stepLabel =
                                    STEP_LABELS[order.status] ?? order.status;
                                const firstItem = order.items[0] as OrderItem;
                                const firstImage = (firstItem as unknown as { image?: string })?.image;
                                const extraCount = order.items.length - 1;
                                const isCancelled =
                                    order.status === 'cancelled' ||
                                    order.status === 'payment_rejected';

                                return (
                                    <Link
                                        key={order.id}
                                        href={`/orders/${order.order_number}`}
                                        className="group block"
                                    >
                                        <div className="overflow-hidden rounded-2xl border bg-background shadow-sm transition-all duration-200 hover:border-primary/40 hover:shadow-md">
                                            {/* Card Top: Order meta */}
                                            <div className="flex items-center justify-between border-b bg-muted/40 px-4 py-2.5">
                                                <div className="flex items-center gap-2">
                                                    <Package className="h-3.5 w-3.5 text-muted-foreground" />
                                                    <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                                                        {order.order_number}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="hidden text-xs text-muted-foreground sm:block">
                                                        {formatDate(
                                                            order.created_at,
                                                        )}
                                                    </span>
                                                    <OrderStatusBadge
                                                        status={order.status}
                                                        showIcon={false}
                                                        className="text-[11px] py-0.5 px-2"
                                                    />
                                                </div>
                                            </div>

                                            {/* Card Body: Product + Progress */}
                                            <div className="px-4 py-4">
                                                {/* Product row */}
                                                <div className="flex items-center gap-4">
                                                    <div className="relative shrink-0">
                                                        {firstImage ? (
                                                            <img
                                                                src={firstImage}
                                                                alt={
                                                                    firstItem?.product_name
                                                                }
                                                                className="h-14 w-14 rounded-lg border object-cover shadow-sm"
                                                            />
                                                        ) : (
                                                            <div className="flex h-14 w-14 items-center justify-center rounded-lg border bg-muted">
                                                                <PackageOpen className="h-5 w-5 text-muted-foreground" />
                                                            </div>
                                                        )}
                                                        {extraCount > 0 && (
                                                            <div className="absolute -bottom-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-background bg-primary text-[10px] font-bold text-primary-foreground">
                                                                +{extraCount}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="min-w-0 flex-1">
                                                        <p className="line-clamp-1 text-sm font-semibold text-foreground">
                                                            {firstItem?.product_name ||
                                                                'Produk'}
                                                            {firstItem?.variant_name
                                                                ? ` · ${firstItem.variant_name}`
                                                                : ''}
                                                        </p>
                                                        <p className="mt-0.5 text-xs text-muted-foreground">
                                                            {order.items.length}{' '}
                                                            item
                                                            {order.items
                                                                .length !== 1
                                                                ? 's'
                                                                : ''}
                                                        </p>

                                                        {/* Progress bar */}
                                                        {!isCancelled && (
                                                            <div className="mt-3">
                                                                <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1">
                                                                    <span>
                                                                        {
                                                                            stepLabel
                                                                        }
                                                                    </span>
                                                                    <span className="font-semibold tabular-nums">
                                                                        {
                                                                            progress
                                                                        }
                                                                        %
                                                                    </span>
                                                                </div>
                                                                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                                                                    <div
                                                                        className={`h-full rounded-full transition-all duration-700 ${progressColor}`}
                                                                        style={{
                                                                            width: `${progress}%`,
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        )}

                                                        {isCancelled && (
                                                            <p className="mt-2 text-xs font-medium text-red-600">
                                                                {stepLabel}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Card Footer: Total + CTA */}
                                            <div className="flex items-center justify-between border-t bg-muted/20 px-4 py-3">
                                                <div>
                                                    <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                                                        Total
                                                    </p>
                                                    <p className="text-base font-bold tabular-nums">
                                                        {formatCurrency(
                                                            order.total,
                                                        )}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-sm font-semibold text-primary transition-all group-hover:gap-2.5">
                                                    Lihat Detail
                                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </UserLayout>
    );
}
