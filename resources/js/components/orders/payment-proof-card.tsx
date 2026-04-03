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
                    Konfirmasi Pembayaran
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
                            Bukti Udah Diterima
                        </h4>
                        <p className="text-sm text-green-700">
                            Sabar ya, kami lagi ngecek pembayaranmu. Biasanya sih cepat, sekitar 1-2 jaman.
                        </p>
                        <p className="mt-2 text-xs text-green-600">
                            Terunggah pada{' '}
                            {payment.created_at
                                ? new Date(payment.created_at).toLocaleString('id-ID')
                                : 'baru aja banget'}
                        </p>
                    </div>
                ) : (
                    <form onSubmit={onSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="sender_account">
                                Nama Pengirim di Rekening
                            </Label>
                            <Input
                                id="sender_account"
                                placeholder="Misal: Rina Melati"
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
                                Upload Bukti Transfer
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
                            {processing ? 'Bentar ya, lagi dikirim...' : 'Kirim Bukti Pembayaran'}
                        </Button>
                    </form>
                )}
            </CardContent>
        </Card>
    );
}
