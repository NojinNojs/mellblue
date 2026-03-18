import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Clock, MapPin, User } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

// Extracted Components
import { AdminOrderSummaryCard } from '@/components/admin/orders/admin-order-summary-card';
import { PaymentVerificationCard } from '@/components/admin/orders/payment-verification-card';

interface OrderItem {
    id: number;
    product_name: string;
    variant_name: string | null;
    unit_price: number;
    quantity: number;
    subtotal: number;
    image: string | null;
}

interface Payment {
    id: number;
    type: string;
    method: string;
    proof_image_url: string;
    sender_account: string;
    amount: number;
    status: string;
    reject_reason: string | null;
    verified_at: string | null;
    verifier: string | null;
}

interface Order {
    id: number;
    order_number: string;
    status: string;
    shipping_name: string;
    shipping_phone: string;
    shipping_address: string;
    shipping_city: string;
    subtotal: number;
    shipping_cost: number;
    total: number;
    payment_deadline: string;
    notes: string | null;
    created_at: string;
    customer: {
        id: number;
        name: string;
        email: string;
    } | null;
    items: OrderItem[];
    latest_payment: Payment | null;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Dashboard', href: '/admin' },
    { title: 'Orders', href: '/admin/orders' },
    { title: 'Order Details', href: '#' },
];

export default function AdminOrderShow({ order }: { order: Order }) {
    const [isVerifying, setIsVerifying] = useState(false);
    const [action, setAction] = useState<'approve' | 'reject' | null>(null);
    const [rejectReason, setRejectReason] = useState('');

    const handleVerify = (selectedAction: 'approve' | 'reject') => {
        if (selectedAction === 'reject' && !rejectReason.trim()) {
            toast.error('Please provide a reason for rejection.');
            return;
        }

        setIsVerifying(true);
        router.post(
            `/admin/orders/${order.order_number}/verify`,
            { action: selectedAction, reject_reason: rejectReason },
            {
                onSuccess: () => {
                    toast.success(
                        `Payment has been ${selectedAction}d successfully.`,
                    );
                    setIsVerifying(false);
                    setAction(null);
                },
                onError: (errors) => {
                    toast.error(
                        errors.error ||
                            'Failed to verify payment. Please try again.',
                    );
                    setIsVerifying(false);
                },
                preserveScroll: true,
            },
        );
    };

    const handleUpdateStatus = (status: string) => {
        router.patch(
            `/admin/orders/${order.order_number}/status`,
            { status },
            {
                onSuccess: () =>
                    toast.success('Order status updated successfully.'),
                onError: () => toast.error('Failed to update order status.'),
                preserveScroll: true,
            },
        );
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<string, string> = {
            pending: 'bg-zinc-100 text-zinc-800 border-zinc-200',
            pending_payment: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            waiting_confirmation:
                'bg-orange-100 text-orange-800 border-orange-200',
            paid: 'bg-blue-100 text-blue-800 border-blue-200',
            processing: 'bg-indigo-100 text-indigo-800 border-indigo-200',
            shipping: 'bg-cyan-100 text-cyan-800 border-cyan-200',
            completed: 'bg-green-100 text-green-800 border-green-200',
            cancelled: 'bg-red-100 text-red-800 border-red-200',
            payment_rejected: 'bg-red-200 text-red-900 border-red-300',
        };

        return (
            <Badge
                variant="outline"
                className={`${variants[status] || 'bg-gray-100 text-gray-800'} border px-2 py-1 text-xs capitalize sm:px-3 sm:text-sm`}
            >
                {status.replace('_', ' ')}
            </Badge>
        );
    };

    const formatDate = (dateString: string | undefined | null) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatPrice = (price: number | undefined) => {
        if (price === undefined) return 'Rp 0';
        return `Rp ${Math.round(price).toLocaleString('id-ID', {
            maximumFractionDigits: 0,
        })}`;
    };

    return (
        <>
            <Head title={`Order #${order.order_number || order.id}`} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4 sm:gap-6 sm:p-6">
                {/* Header Actions */}
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/orders">
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-9 w-9 shrink-0 rounded-full bg-background shadow-sm hover:bg-muted"
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div className="min-w-0">
                            <h1 className="truncate text-xl font-bold tracking-tight text-foreground sm:text-2xl md:text-3xl">
                                Order #{order.order_number}
                            </h1>
                            <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                                <Clock className="h-3.5 w-3.5" />
                                {formatDate(
                                    order.created_at ||
                                        new Date().toISOString(),
                                )}
                            </p>
                        </div>
                    </div>
                    <div className="flex shrink-0 items-center justify-start sm:justify-end">
                        {getStatusBadge(order.status)}
                    </div>
                </div>

                <div className="grid gap-4 sm:gap-6 lg:grid-cols-3 xl:gap-8">
                    {/* Left Column - Order details */}
                    <div className="flex flex-col gap-4 sm:gap-6 lg:col-span-2">
                        <AdminOrderSummaryCard
                            items={order.items}
                            subtotal={order.subtotal}
                            shippingCost={order.shipping_cost}
                            total={order.total}
                            formatPrice={formatPrice}
                        />

                        {/* Payment Verification Section */}
                        {order.latest_payment && (
                            <PaymentVerificationCard
                                orderStatus={order.status}
                                payment={order.latest_payment}
                                action={action}
                                setAction={setAction}
                                rejectReason={rejectReason}
                                setRejectReason={setRejectReason}
                                isVerifying={isVerifying}
                                handleVerify={handleVerify}
                                formatPrice={formatPrice}
                                formatDate={formatDate}
                                getStatusBadge={getStatusBadge}
                            />
                        )}

                        {!order.latest_payment && (
                            <Card className="overflow-hidden border-dashed shadow-sm">
                                <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                                    <Clock className="mb-3 h-10 w-10 text-yellow-500 opacity-50" />
                                    <h3 className="text-lg font-medium text-foreground">
                                        Awaiting Payment
                                    </h3>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        The customer has not uploaded a payment
                                        proof yet.
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Right Column - Customer Info & Actions */}
                    <div className="flex flex-col gap-4 sm:gap-6">
                        {/* Status Update Card */}
                        <Card className="shadow-sm">
                            <CardHeader className="bg-muted/30 px-5 py-4">
                                <CardTitle className="text-base">
                                    Update Order Status
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-5">
                                <div className="flex flex-col gap-3">
                                    <select
                                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:ring-1 focus:ring-ring focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                        value={order.status}
                                        onChange={(e) =>
                                            handleUpdateStatus(e.target.value)
                                        }
                                    >
                                        <option value="pending">
                                            Pending
                                        </option>
                                        <option value="pending_payment">
                                            Pending Payment
                                        </option>
                                        <option value="waiting_confirmation">
                                            Waiting Confirmation
                                        </option>
                                        <option value="paid">
                                            Paid
                                        </option>
                                        <option value="processing">
                                            Processing
                                        </option>
                                        <option value="shipping">Shipping (Dikirim)</option>
                                        <option value="completed">
                                            Completed
                                        </option>
                                        <option value="cancelled">
                                            Cancelled
                                        </option>
                                    </select>
                                    <p className="text-xs text-muted-foreground">
                                        Updating status will immediately reflect
                                        on the customer's end.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Customer Info */}
                        <Card className="border-violet-100 shadow-sm transition-all hover:shadow-md">
                            <CardHeader className="bg-violet-50/50 px-5 py-4">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100">
                                        <User className="h-4 w-4 text-violet-600" />
                                    </div>
                                    <CardTitle className="text-base text-violet-900">
                                        Customer Details
                                    </CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="p-5">
                                <div className="space-y-5">
                                    <div className="rounded-lg bg-muted/30 p-3 transition-colors hover:bg-muted/50">
                                        <p className="mb-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                            Account
                                        </p>
                                        <p className="font-medium text-foreground">
                                            {order.customer?.name || 'Guest'}
                                        </p>
                                        <p className="text-sm font-medium text-brand-blue">
                                            {order.customer?.email || 'N/A'}
                                        </p>
                                    </div>
                                    <Separator className="bg-muted/60" />
                                    <div className="px-1">
                                        <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                            <MapPin className="h-3.5 w-3.5" />{' '}
                                            Shipping Contact
                                        </p>
                                        <p className="font-medium text-foreground">
                                            {order.shipping_name}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {order.shipping_phone}
                                        </p>
                                    </div>
                                    <div className="rounded-lg border border-dashed border-muted-foreground/20 bg-muted/10 p-3 px-1">
                                        <p className="mb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                            Delivery Address
                                        </p>
                                        <p className="text-sm leading-relaxed text-foreground">
                                            {order.shipping_address}
                                            {order.shipping_city && (
                                                <>
                                                    <br />
                                                    <span className="font-medium text-foreground/80">{order.shipping_city}</span>
                                                </>
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Order Notes */}
                        {order.notes && (
                            <Card className="border-amber-200 shadow-sm">
                                <CardHeader className="bg-amber-50 px-5 py-4">
                                    <CardTitle className="text-base text-amber-800">
                                        Customer Notes
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="bg-amber-50/50 p-5">
                                    <p className="border-l-2 border-amber-400 pl-3 text-sm leading-relaxed text-amber-900">
                                        {order.notes}
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

AdminOrderShow.layout = (page: React.ReactNode) => (
    <AdminLayout breadcrumbs={breadcrumbs}>{page}</AdminLayout>
);
