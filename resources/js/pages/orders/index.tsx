import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { OrderStatusBadge } from '@/components/ui/order-status-badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserLayout from '@/layouts/user-layout';
import { formatCurrency, formatOrderDate } from '@/lib/format';
import { type Order, type OrderItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Package, PackageOpen, ShoppingBag } from 'lucide-react';
import { useMemo, useState } from 'react';

type StatusFilter = 'all' | 'pending' | 'processing' | 'shipped' | 'completed';

export interface MyOrdersPageProps {
    orders: Order[];
}

export default function MyOrders({ orders }: MyOrdersPageProps) {
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

    const filteredOrders = useMemo(() => {
        if (statusFilter === 'all') return orders;

        if (statusFilter === 'pending') {
            return orders.filter(
                (o) =>
                    o.status === 'pending_payment' ||
                    o.status === 'waiting_confirmation',
            );
        }

        if (statusFilter === 'processing') {
            return orders.filter(
                (o) => o.status === 'paid' || o.status === 'processing',
            );
        }
        if (statusFilter === 'shipped') {
            return orders.filter((o) => o.status === 'shipping');
        }

        return orders.filter((o) => o.status === statusFilter);
    }, [orders, statusFilter]);

    const getOrderProgress = (status: Order['status']): number => {
        const progressMap: Record<Order['status'], number> = {
            pending: 10,
            pending_payment: 20,
            waiting_confirmation: 30,
            paid: 40,
            payment_rejected: 0,
            processing: 60,
            shipping: 80,
            completed: 100,
            cancelled: 0,
        };
        return progressMap[status];
    };

    return (
        <UserLayout>
            <Head title="My Orders" />
            <div className="container mx-auto px-4 py-8 sm:py-12">
                <div className="flex flex-col gap-6">
                    {/* Header */}
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                            My Orders
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
                            Track and manage your purchases
                        </p>
                    </div>

                    {/* Status Filter Tabs */}
                    <Tabs
                        value={statusFilter}
                        onValueChange={(v: string) =>
                            setStatusFilter(v as StatusFilter)
                        }
                    >
                        <TabsList className="grid w-full grid-cols-5">
                            <TabsTrigger
                                value="all"
                                className="text-xs sm:text-sm"
                            >
                                All
                            </TabsTrigger>
                            <TabsTrigger
                                value="pending"
                                className="text-xs sm:text-sm"
                            >
                                Pending
                            </TabsTrigger>
                            <TabsTrigger
                                value="processing"
                                className="text-xs sm:text-sm"
                            >
                                Processing
                            </TabsTrigger>
                            <TabsTrigger
                                value="shipped"
                                className="text-xs sm:text-sm"
                            >
                                Shipped
                            </TabsTrigger>
                            <TabsTrigger
                                value="completed"
                                className="text-xs sm:text-sm"
                            >
                                Completed
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>

                    {/* Orders List */}
                    {filteredOrders.length === 0 ? (
                        <Card>
                            <CardContent className="pt-6">
                                <EmptyState
                                    icon={ShoppingBag}
                                    title={
                                        statusFilter === 'all'
                                            ? 'No orders yet'
                                            : `No ${statusFilter} orders`
                                    }
                                    description={
                                        statusFilter === 'all'
                                            ? 'Start shopping to see your orders here'
                                            : `You don't have any ${statusFilter} orders at the moment`
                                    }
                                    action={
                                        statusFilter === 'all' ? (
                                            <Button asChild>
                                                <Link href="/products">
                                                    <ShoppingBag className="mr-2 h-4 w-4" />
                                                    Browse Products
                                                </Link>
                                            </Button>
                                        ) : undefined
                                    }
                                />
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                            {filteredOrders.map((order) => {
                                const progress = getOrderProgress(order.status);
                                const firstItem = order.items[0] as OrderItem;
                                const firstImage = (firstItem as any)?.image;

                                return (
                                    <Link
                                        key={order.id}
                                        href={`/orders/${order.order_number}`}
                                        className="group"
                                    >
                                        <Card className="h-full overflow-hidden transition-all hover:border-primary/50 hover:shadow-md">
                                            <CardContent className="flex h-full flex-col p-6">
                                                {/* Header with Order ID and Status */}
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="min-w-0 flex-1">
                                                        <p className="truncate text-base font-semibold">
                                                            Order #{order.order_number}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {formatOrderDate(
                                                                order.created_at,
                                                            )}
                                                        </p>
                                                    </div>
                                                    <OrderStatusBadge
                                                        status={order.status}
                                                        className="shrink-0"
                                                    />
                                                </div>

                                                {/* Product Preview */}
                                                <div className="mt-5 flex items-start gap-4">
                                                    {firstImage ? (
                                                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md border bg-muted shadow-sm">
                                                            <img
                                                                src={firstImage}
                                                                alt={
                                                                    firstItem?.product_name
                                                                }
                                                                className="h-full w-full object-cover"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md border bg-muted">
                                                            <PackageOpen className="h-6 w-6 text-muted-foreground" />
                                                        </div>
                                                    )}
                                                    <div className="min-w-0 flex-1 py-1">
                                                        <p className="line-clamp-2 text-base leading-snug font-medium">
                                                            {firstItem?.product_name ||
                                                                'Product'}{' '}
                                                            {firstItem?.variant_name
                                                                ? `(${firstItem.variant_name})`
                                                                : ''}
                                                        </p>
                                                        {order.items.length >
                                                            1 && (
                                                            <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                                                                <Package className="h-4 w-4" />
                                                                +
                                                                {order.items
                                                                    .length -
                                                                    1}{' '}
                                                                more item
                                                                {order.items
                                                                    .length > 2
                                                                    ? 's'
                                                                    : ''}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Progress Bar */}
                                                <div className="mt-6">
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="text-muted-foreground">
                                                            Order Progress
                                                        </span>
                                                        <span className="font-medium tabular-nums">
                                                            {progress}%
                                                        </span>
                                                    </div>
                                                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary/50">
                                                        <div
                                                            className="h-full rounded-full bg-primary transition-all duration-500"
                                                            style={{
                                                                width: `${progress}%`,
                                                            }}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Total and Action */}
                                                <div className="mt-6 mt-auto flex items-center justify-between border-t pt-4">
                                                    <div>
                                                        <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                                                            Total Amount
                                                        </p>
                                                        <p className="text-lg font-bold tabular-nums">
                                                            {formatCurrency(
                                                                order.total,
                                                            )}
                                                        </p>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="gap-2 group-hover:bg-primary group-hover:text-primary-foreground"
                                                    >
                                                        View Details
                                                        <ArrowRight className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
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
