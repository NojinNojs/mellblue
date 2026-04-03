import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Eye, PackageOpen, ShoppingCart } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin Dashboard',
        href: '/admin',
    },
    {
        title: 'Orders',
        href: '/admin/orders',
    },
];

interface OrderItem {
    id: number;
    product_name: string;
    variant_name: string | null;
    unit_price: number;
    quantity: number;
    subtotal: number;
    image: string | null;
}

interface Order {
    id: number;
    order_number: string;
    status: string;
    total: number;
    created_at: string;
    customer?: {
        name: string;
        email: string;
    };
    items: OrderItem[];
}

export default function AdminOrderIndex({
    orders,
}: {
    orders: {
        data: Order[];
        links?: { url: string | null; label: string; active: boolean }[];
        current_page: number;
        last_page: number;
    };
}) {
    const getStatusBadge = (status: string) => {
        const variants: Record<string, string> = {
            pending: 'bg-yellow-50 text-yellow-700 border-yellow-400',
            pending_payment: 'bg-yellow-50 text-yellow-700 border-yellow-400',
            waiting_confirmation: 'bg-amber-50 text-amber-700 border-amber-400',
            paid: 'bg-green-50 text-green-700 border-green-400',
            processing: 'bg-blue-50 text-blue-700 border-blue-400',
            shipping: 'bg-indigo-50 text-indigo-700 border-indigo-400',
            completed: 'bg-green-100 text-green-800 border-green-500',
            cancelled: 'bg-red-50 text-red-700 border-red-400',
            payment_rejected: 'bg-red-100 text-red-800 border-red-500',
        };

        return (
            <Badge
                variant="outline"
                className={`${variants[status] || 'bg-gray-100 text-gray-800'} text-xs whitespace-nowrap capitalize`}
            >
                {status.replace('_', ' ')}
            </Badge>
        );
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatPrice = (price: number) => {
        return `Rp ${Math.round(price).toLocaleString('id-ID', {
            maximumFractionDigits: 0,
        })}`;
    };

    return (
        <>
            <Head title="Manage Orders" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4 sm:gap-6 sm:p-6">
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                            Orders
                        </h1>
                        <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                            <ShoppingCart className="h-4 w-4" />
                            Manage and process customer orders
                        </p>
                    </div>
                </div>

                <Card className="flex-1 shadow-sm">
                    <CardHeader className="border-b px-4 py-3 sm:px-6 sm:py-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <CardTitle className="text-base sm:text-lg">
                                Order List
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {orders.data && orders.data.length > 0 ? (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader className="bg-muted/50">
                                        <TableRow>
                                            <TableHead className="w-[120px] whitespace-nowrap">
                                                Order ID
                                            </TableHead>
                                            <TableHead className="min-w-[200px]">
                                                Customer
                                            </TableHead>
                                            <TableHead className="min-w-[250px]">
                                                Items
                                            </TableHead>
                                            <TableHead className="w-[120px] text-right">
                                                Total
                                            </TableHead>
                                            <TableHead className="w-[120px]">
                                                Status
                                            </TableHead>
                                            <TableHead className="w-[150px] whitespace-nowrap">
                                                Date
                                            </TableHead>
                                            <TableHead className="w-[80px] text-right">
                                                Actions
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {orders.data.map((order) => (
                                            <TableRow key={order.id}>
                                                <TableCell className="font-medium">
                                                    #
                                                    {order.order_number ||
                                                        String(
                                                            order.id,
                                                        ).padStart(6, '0')}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-foreground">
                                                            {order.customer
                                                                ?.name ||
                                                                'Unknown'}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {order.customer
                                                                ?.email ||
                                                                'N/A'}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-muted">
                                                            {order.items &&
                                                            order.items[0]
                                                                ?.image ? (
                                                                <img
                                                                    src={
                                                                        order
                                                                            .items[0]
                                                                            .image
                                                                    }
                                                                    alt={
                                                                        order
                                                                            .items[0]
                                                                            .product_name
                                                                    }
                                                                    className="h-full w-full object-cover"
                                                                />
                                                            ) : (
                                                                <PackageOpen className="h-5 w-5 text-muted-foreground" />
                                                            )}
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <p className="truncate text-sm font-medium">
                                                                {order
                                                                    .items?.[0]
                                                                    ?.product_name ||
                                                                    'Unknown Product'}
                                                            </p>
                                                            <p className="truncate text-xs text-muted-foreground">
                                                                {order.items
                                                                    ?.length > 1
                                                                    ? `+ ${order.items.length - 1} more items`
                                                                    : order
                                                                          .items?.[0]
                                                                          ?.variant_name ||
                                                                      '1 item'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right font-medium">
                                                    {formatPrice(order.total)}
                                                </TableCell>
                                                <TableCell>
                                                    {getStatusBadge(
                                                        order.status,
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-xs text-muted-foreground">
                                                    {formatDate(
                                                        order.created_at,
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Link
                                                        href={`/admin/orders/${order.order_number || order.id}`}
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 hover:bg-violet-50 hover:text-violet-600"
                                                            title="View Order"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/50">
                                    <ShoppingCart className="h-8 w-8 text-muted-foreground/50" />
                                </div>
                                <h3 className="mt-4 text-lg font-semibold">
                                    No orders found
                                </h3>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    There are no orders matching your criteria.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Pagination (can be added later if needed based on the response format) */}
                {orders.links && orders.links.length > 3 && (
                    <div className="flex items-center justify-center py-4">
                        <div className="flex gap-1">
                            {orders.links.map(
                                (
                                    link: {
                                        url: string | null;
                                        label: string;
                                        active: boolean;
                                    },
                                    i: number,
                                ) => (
                                    <Link
                                        key={i}
                                        href={link.url || '#'}
                                        className={`flex h-9 min-w-[36px] items-center justify-center rounded-md border px-3 text-sm transition-colors ${
                                            link.active
                                                ? 'bg-primary font-medium text-primary-foreground'
                                                : link.url
                                                  ? 'bg-background text-foreground hover:bg-muted'
                                                  : 'cursor-not-allowed bg-muted/50 opacity-50'
                                        }`}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                ),
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

AdminOrderIndex.layout = (page: React.ReactNode) => (
    <AdminLayout breadcrumbs={breadcrumbs}>{page}</AdminLayout>
);
