import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type Payment } from '@/types';
import { CheckCircle } from 'lucide-react';
import { type FormEventHandler } from 'react';

interface PaymentProofCardProps {
    orderStatus: string;
    payment?: Payment | null;
    processing: boolean;
    data: { sender_account_number: string; proof_image: File | null };
    setData: (field: 'sender_account_number' | 'proof_image', value: string | File | null) => void;
    onSubmit: FormEventHandler;
}

export function PaymentProofCard({
    orderStatus,
    payment,
    processing,
    data,
    setData,
    onSubmit,
}: PaymentProofCardProps) {
    if (orderStatus !== 'pending_payment' && orderStatus !== 'pending') {
        return null;
    }

    return (
        <Card className="border-2 shadow-sm">
            <CardHeader className="bg-muted/30 p-6 pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                    <CheckCircle className="h-5 w-5 text-muted-foreground" />
                    Payment Confirmation
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                {payment ? (
                    <div className="rounded-lg border bg-green-50 p-4 text-center">
                        <div className="mb-2 flex justify-center">
                            <div className="rounded-full bg-green-100 p-2 text-green-600">
                                <CheckCircle className="h-6 w-6" />
                            </div>
                        </div>
                        <h4 className="font-semibold text-green-900">
                            Payment Uploaded
                        </h4>
                        <p className="text-sm text-green-700">
                            We are verifying your payment. This usually takes
                            1-2 hours.
                        </p>
                        <p className="mt-2 text-xs text-green-600">
                            Uploaded on{' '}
                            {payment.created_at
                                ? new Date(payment.created_at).toLocaleString()
                                : 'just now'}
                        </p>
                    </div>
                ) : (
                    <form onSubmit={onSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="sender_account">
                                Sender Account Name
                            </Label>
                            <Input
                                id="sender_account"
                                placeholder="e.g. John Doe"
                                value={data.sender_account_number}
                                onChange={(e) =>
                                    setData(
                                        'sender_account_number',
                                        e.target.value,
                                    )
                                }
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="proof_image">
                                Upload Transfer Receipt
                            </Label>
                            <Input
                                id="proof_image"
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    setData(
                                        'proof_image',
                                        e.target.files
                                            ? e.target.files[0]
                                            : null,
                                    )
                                }
                                required
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={processing}
                        >
                            {processing ? 'Uploading...' : 'Confirm Payment'}
                        </Button>
                    </form>
                )}
            </CardContent>
        </Card>
    );
}
