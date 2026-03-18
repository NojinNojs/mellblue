import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, CheckCircle2, CreditCard, XCircle } from 'lucide-react';
import { ReactNode } from 'react';

// Extend Payment interface
interface AdminPayment {
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

interface PaymentVerificationCardProps {
    orderStatus: string;
    payment: AdminPayment;
    action: 'approve' | 'reject' | null;
    setAction: (action: 'approve' | 'reject' | null) => void;
    rejectReason: string;
    setRejectReason: (reason: string) => void;
    isVerifying: boolean;
    handleVerify: (action: 'approve' | 'reject') => void;
    formatPrice: (price: number | undefined) => string;
    formatDate: (date: string | null | undefined) => string;
    getStatusBadge: (status: string) => ReactNode;
}

export function PaymentVerificationCard({
    orderStatus,
    payment,
    action,
    setAction,
    rejectReason,
    setRejectReason,
    isVerifying,
    handleVerify,
    formatPrice,
    formatDate,
    getStatusBadge,
}: PaymentVerificationCardProps) {
    return (
        <Card className="overflow-hidden border-brand-blue/20 shadow-sm">
            <CardHeader className="bg-brand-blue/5 px-5 py-4">
                <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-brand-blue" />
                    <CardTitle className="text-lg">Payment Details</CardTitle>
                </div>
                <CardDescription>
                    Method: {payment.method.toUpperCase()} • Account:{' '}
                    {payment.sender_account}
                </CardDescription>
            </CardHeader>
            <CardContent className="p-5">
                <div className="flex flex-col gap-6 md:flex-row md:items-start lg:gap-10">
                    <div className="flex flex-1 flex-col gap-5">
                        <div className="grid grid-cols-2 gap-4 rounded-lg bg-muted/40 p-4">
                            <div>
                                <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                    Status
                                </p>
                                {getStatusBadge(payment.status)}
                            </div>
                            <div>
                                <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                    Amount Paid
                                </p>
                                <p className="text-lg font-bold text-brand-blue">
                                    {formatPrice(payment.amount)}
                                </p>
                            </div>
                            {payment.verified_at && (
                                <div className="col-span-2 mt-2 border-t pt-3">
                                    <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                        Verified On
                                    </p>
                                    <p className="font-medium text-foreground">
                                        {formatDate(payment.verified_at)}
                                    </p>
                                    <p className="mt-0.5 text-xs text-muted-foreground">
                                        By {payment.verifier || 'System Admin'}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons merged here for desktop */}
                        {orderStatus === 'waiting_confirmation' && (
                            <div className="hidden rounded-lg border border-brand-blue/20 bg-brand-blue/5 p-4 md:block">
                                <h4 className="mb-3 text-sm font-semibold text-brand-blue">
                                    Verify Payment
                                </h4>
                                {action === 'reject' ? (
                                    <div className="flex animate-in flex-col gap-3 fade-in slide-in-from-bottom-2">
                                        <Textarea
                                            placeholder="Reason for rejection (e.g., Image unclear)..."
                                            value={rejectReason}
                                            onChange={(e) =>
                                                setRejectReason(e.target.value)
                                            }
                                            className="min-h-[80px] resize-none bg-background shadow-sm"
                                        />
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleVerify('reject')}
                                                disabled={
                                                    isVerifying || !rejectReason.trim()
                                                }
                                                className="flex-1"
                                            >
                                                {isVerifying
                                                    ? 'Rejecting...'
                                                    : 'Confirm'}
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    setAction(null);
                                                    setRejectReason('');
                                                }}
                                                disabled={isVerifying}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-3 sm:flex-row">
                                        <Button
                                            className="flex-1 bg-green-600 text-white shadow-sm hover:bg-green-700"
                                            onClick={() => handleVerify('approve')}
                                            disabled={isVerifying}
                                        >
                                            <CheckCircle2 className="mr-2 h-4 w-4" />
                                            Approve
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                                            onClick={() => setAction('reject')}
                                            disabled={isVerifying}
                                        >
                                            <XCircle className="mr-2 h-4 w-4" />
                                            Reject
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex w-full shrink-0 flex-col items-center sm:max-w-[280px] sm:items-start md:w-1/3 xl:w-1/4">
                        <p className="mb-3 text-sm font-semibold text-foreground">
                            Proof of Payment
                        </p>
                        <div className="group relative aspect-[3/4] w-full overflow-hidden rounded-xl border border-muted bg-muted/30 shadow-sm transition-all hover:border-brand-blue/30">
                            {payment.proof_image_url ? (
                                <a
                                    href={payment.proof_image_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block h-full w-full cursor-zoom-in p-1"
                                >
                                    <img
                                        src={payment.proof_image_url}
                                        alt="Payment Proof"
                                        className="h-full w-full rounded-lg object-contain transition-transform duration-300 group-hover:scale-105"
                                    />
                                </a>
                            ) : (
                                <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
                                    <AlertCircle className="mb-2 h-10 w-10 opacity-50" />
                                    <span className="text-sm font-medium">No image provided</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile version of Action Buttons for Pending Verification */}
                {orderStatus === 'waiting_confirmation' && (
                    <div className="mt-8 rounded-lg border border-brand-blue/20 bg-brand-blue/5 p-4 md:hidden">
                        <h4 className="mb-4 text-sm font-semibold text-brand-blue">
                            Verify Payment
                        </h4>

                        {action === 'reject' ? (
                            <div className="flex animate-in flex-col gap-3 fade-in slide-in-from-bottom-2">
                                <Textarea
                                    placeholder="Provide a reason for rejecting this payment (e.g., Image unclear, amount does not match)..."
                                    value={rejectReason}
                                    onChange={(e) =>
                                        setRejectReason(e.target.value)
                                    }
                                    className="min-h-[100px] resize-none bg-background shadow-sm"
                                />
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="destructive"
                                        onClick={() => handleVerify('reject')}
                                        disabled={
                                            isVerifying || !rejectReason.trim()
                                        }
                                        className="flex-1"
                                    >
                                        {isVerifying
                                            ? 'Rejecting...'
                                            : 'Confirm Reject'}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        onClick={() => {
                                            setAction(null);
                                            setRejectReason('');
                                        }}
                                        disabled={isVerifying}
                                        className="flex-1"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                <Button
                                    className="w-full bg-green-600 text-white shadow-sm hover:bg-green-700 sm:w-auto"
                                    onClick={() => handleVerify('approve')}
                                    disabled={isVerifying}
                                >
                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                    Approve Payment
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 sm:w-auto"
                                    onClick={() => setAction('reject')}
                                    disabled={isVerifying}
                                >
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Reject Payment
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
