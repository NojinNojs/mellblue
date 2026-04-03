import { OrderTimeline } from '@/components/sections/order-timeline';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CountdownTimer } from '@/components/ui/countdown-timer';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Order } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowLeft,
    CheckCircle,
    Clock,
    Download,
    Package,
    XCircle,
} from 'lucide-react';
import { FormEventHandler, useState } from 'react';

// Extracted DRY Components
import { OrderSummaryCard } from '@/components/orders/order-summary-card';
import { PaymentInstructionsCard } from '@/components/orders/payment-instructions-card';
import { PaymentProofCard } from '@/components/orders/payment-proof-card';
import { ShippingDetailsCard } from '@/components/orders/shipping-details-card';
import { StatusMessageCard } from '@/components/orders/status-message-card';

export interface OrderDetailPageProps {
    order: Order;
}

export default function OrderDetail({ order }: OrderDetailPageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'My Orders', href: '/orders' },
        { title: `Order #${order.order_number}`, href: `/orders/${order.order_number}` },
    ];

    // Payment proof — use manual FormData + router.post for reliable file upload
    const [proofImage, setProofImage] = useState<File | null>(null);
    const [senderAccount, setSenderAccount] = useState('');
    const [uploadProcessing, setUploadProcessing] = useState(false);

    const data = { proof_image: proofImage, sender_account_number: senderAccount };
    const setData = (field: 'proof_image' | 'sender_account_number', value: string | File | null) => {
        if (field === 'proof_image') setProofImage(value as File | null);
        else setSenderAccount(value as string);
    };
    const processing = uploadProcessing;

    const { post: cancelOrder, processing: cancelProcessing } = useForm();
    const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
    // Fallback deadline if not provided by backend
    const [fallbackDeadline] = useState(() =>
        new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    );

    const confirmCancel = () => {
        cancelOrder(`/orders/${order.order_number}/cancel`, {
            onSuccess: () => setIsCancelDialogOpen(false),
        });
    };

    const submitPaymentProof: FormEventHandler = (e) => {
        e.preventDefault();
        if (!proofImage) return;

        const formData = new FormData();
        formData.append('proof_image', proofImage);
        formData.append('sender_account_number', senderAccount);

        setUploadProcessing(true);
        router.post(`/orders/${order.order_number}/payment`, formData, {
            forceFormData: true,
            onFinish: () => setUploadProcessing(false),
        });
    };

    const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);
    const { patch: completeOrder, processing: completeProcessing } = useForm();

    const handleCompleteOrder = () => {
        completeOrder(`/orders/${order.order_number}/complete`, {
            onSuccess: () => setIsCompleteDialogOpen(false),
        });
    };

    const isPendingPayment = order.status === 'pending' || order.status === 'pending_payment';

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'paid':
            case 'completed':
                return 'default';
            case 'cancelled':
            case 'payment_rejected':
                return 'destructive';
            case 'pending_payment':
                return 'secondary';
            default:
                return 'secondary';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'paid':
            case 'completed':
                return <CheckCircle className="h-4 w-4" />;
            case 'cancelled':
            case 'payment_rejected':
                return <AlertCircle className="h-4 w-4" />;
            case 'pending_payment':
                return <Clock className="h-4 w-4" />;
            default:
                return <Package className="h-4 w-4" />;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Order ${order.order_number}`} />

            <div className="container mx-auto max-w-5xl space-y-8 px-4 py-8">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            asChild
                            className="h-10 w-10 shrink-0 rounded-full border shadow-sm hover:shadow-md"
                        >
                            <Link href="/orders">
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                                Detail Pesanan
                            </h1>
                            <p className="text-sm text-muted-foreground sm:text-base">
                                {order.order_number} • Dipesan pada{' '}
                                {order.created_at
                                    ? new Date(order.created_at).toLocaleDateString(
                                          'id-ID',
                                          {
                                              year: 'numeric',
                                              month: 'long',
                                              day: 'numeric',
                                          },
                                      )
                                    : '—'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {!isPendingPayment && order.status !== 'cancelled' && order.status !== 'payment_rejected' && (
                            <a
                                href={`/orders/${order.order_number}/receipt`}
                                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:shadow-lg active:scale-95"
                            >
                                <Download className="h-4 w-4" />
                                Unduh Resi
                            </a>
                        )}
                        <Badge
                            variant={getStatusColor(order.status) as 'default' | 'secondary' | 'destructive' | 'outline'}
                            className="flex items-center justify-center gap-2 px-4 py-1.5 text-sm font-medium tracking-wide"
                        >
                            {getStatusIcon(order.status)}
                            {order.status === 'pending' || order.status === 'pending_payment' ? 'Menunggu' 
                                : order.status === 'paid' ? 'Sudah Dibayar' 
                                : order.status === 'shipping' ? 'Dikirim' 
                                : order.status === 'completed' ? 'Selesai' 
                                : order.status === 'cancelled' ? 'Batal' 
                                : order.status === 'payment_rejected' ? 'Ditolak' 
                                : order.status}
                        </Badge>
                    </div>
                </div>

                {/* Timeline */}
                <Card className="border-2 shadow-sm">
                    <CardContent className="p-6">
                        <OrderTimeline status={order.status} />
                    </CardContent>
                </Card>

                <div className="flex flex-col gap-8 lg:grid lg:grid-cols-12">
                    {/* Left Column: Order Info (Second on Mobile) */}
                    <div className="order-2 space-y-8 lg:order-1 lg:col-span-7">
                        <OrderSummaryCard
                            items={order.items}
                            total={order.total}
                            uniqueCode={order.unique_code}
                            action={
                                isPendingPayment ? (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            setIsCancelDialogOpen(true)
                                        }
                                        disabled={cancelProcessing}
                                        className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                                    >
                                        <XCircle className="mr-2 h-4 w-4" />
                                        Batalkan Pesanan
                                    </Button>
                                ) : undefined
                            }
                        />

                        <ShippingDetailsCard
                            status={order.status}
                            shippingName={order.shipping_name}
                            shippingPhone={order.shipping_phone}
                            shippingAddress={order.shipping_address}
                            shippingMethod={order.shipping_method ?? undefined}
                            trackingNumber={order.tracking_number ?? undefined}
                        />
                    </div>

                    {/* Right Column: Payment & Actions (First on Mobile) */}
                    <div className="order-1 flex flex-col gap-6 lg:order-2 lg:col-span-5">
                        <div className="sticky top-8 space-y-6">
                            <StatusMessageCard status={order.status} />

                            {isPendingPayment && (
                                <Card className="border-2 border-primary/20 shadow-lg ring-4 ring-primary/5">
                                    <CardHeader className="bg-primary/5 p-6 pb-4 text-center">
                                        <CardTitle className="text-lg font-medium text-primary">
                                            Batas Waktu Pembayaran
                                        </CardTitle>
                                        <div className="flex justify-center pt-2">
                                            <CountdownTimer
                                                deadline={
                                                    order.payment_deadline ||
                                                    fallbackDeadline
                                                }
                                            />
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-6 text-center">
                                        <p className="text-sm text-muted-foreground">
                                            Yuk selesaikan belanjamu sebelum waktunya habis, biar pesananmu nggak otomatis jadi batal ya.
                                        </p>
                                    </CardContent>
                                </Card>
                            )}

                            {isPendingPayment && (
                                <PaymentInstructionsCard total={order.total} />
                            )}

                            <PaymentProofCard
                                orderStatus={order.status}
                                payment={order.payment as import('@/types').Payment}
                                processing={processing}
                                data={data}
                                setData={setData}
                                onSubmit={submitPaymentProof}
                            />

                            {/* Waiting Confirmation Message - Show when payment proof uploaded */}
                            {order.status === 'waiting_confirmation' && (
                                <Card className="overflow-hidden border-2 border-primary/20 shadow-lg">
                                    <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-6">
                                        <div className="mb-4 flex items-start gap-3">
                                            <div className="rounded-full bg-primary p-2">
                                                <Clock className="h-5 w-5 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-lg font-bold text-foreground">
                                                    Pembayaran Lagi Dicek
                                                </h3>
                                                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                                    Makasih ya udah unggah bukti tf mu! Tim kami sekarang lagi nge-verifikasi. Biasanya cuma butuh sekitar 1-2 jam pada jam operasional kok.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            )}

                            {/* Shipping Action - Confirm Receipt */}
                            {order.status === 'shipping' && (
                                <Card className="overflow-hidden border-2 border-primary/20 shadow-lg ring-4 ring-primary/5">
                                    <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-6">
                                        <div className="mb-6 flex items-start gap-4">
                                            <div className="rounded-full bg-primary p-3 shadow-md">
                                                <Package className="h-6 w-6 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-foreground">
                                                    Pesanan Sudah Sampai?
                                                </h3>
                                                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                                    Kalau semua pesananmu udah sampai dengan aman, bantu kami dengan konfirmasi di sini ya biar pesananmu berstatus selesai.
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            className="w-full py-6 text-lg font-bold shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
                                            onClick={() => setIsCompleteDialogOpen(true)}
                                            disabled={completeProcessing}
                                        >
                                            <CheckCircle className="mr-2 h-5 w-5" />
                                            Konfirmasi Pesanan Sampai
                                        </Button>
                                    </div>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Dialog
                open={isCancelDialogOpen}
                onOpenChange={setIsCancelDialogOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Batalkan Pesanan</DialogTitle>
                        <DialogDescription>
                            Apakah kamu yakin ingin membatalkan pesanan ini? Aksi ini tidak bisa dikembalikan lho.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Kembali</Button>
                        </DialogClose>
                        <Button
                            variant="destructive"
                            onClick={confirmCancel}
                            disabled={cancelProcessing}
                        >
                            {cancelProcessing
                                ? 'Membatalkan...'
                                : 'Ya, Batalkan'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Complete Order Dialog */}
            <Dialog
                open={isCompleteDialogOpen}
                onOpenChange={setIsCompleteDialogOpen}
            >
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">Konfirmasi Penerimaan</DialogTitle>
                        <DialogDescription className="pt-2 text-base">
                            Tandai pesanan ini selesai jika kamu sudah menerima semua barangnya dengan baik ya.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-4 py-4">
                        <div className="rounded-lg bg-muted/50 p-4 border border-border">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Info Orderan</p>
                            <p className="text-sm font-medium">{order.order_number}</p>
                        </div>
                    </div>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <DialogClose asChild>
                            <Button variant="outline" className="flex-1 py-6">Belum Sampai</Button>
                        </DialogClose>
                        <Button
                            className="flex-1 py-6 font-bold"
                            onClick={handleCompleteOrder}
                            disabled={completeProcessing}
                        >
                            {completeProcessing
                                ? 'Memproses...'
                                : 'Ya, Sudah Diterima'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
