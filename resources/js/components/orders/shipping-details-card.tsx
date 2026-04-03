import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Copy, Truck } from 'lucide-react';
import { toast } from 'sonner';

interface ShippingDetailsCardProps {
    status: string;
    shippingName: string;
    shippingPhone: string;
    shippingAddress: string;
    shippingMethod?: string;
    trackingNumber?: string;
}

export function ShippingDetailsCard({
    status,
    shippingName,
    shippingPhone,
    shippingAddress,
    shippingMethod,
    trackingNumber,
}: ShippingDetailsCardProps) {
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard!');
    };

    const isShipped = status === 'shipping' || status === 'completed';

    return (
        <Card className="border-2 shadow-sm">
            <CardHeader className="bg-muted/30 p-6 pb-4">
                <CardTitle className="flex items-center justify-between text-xl">
                    <div className="flex items-center gap-2">
                        <Truck className="h-5 w-5 text-muted-foreground" />
                        Detail Pengiriman
                    </div>
                    {status === 'completed' && (
                        <Badge className="bg-green-600 hover:bg-green-700">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Pesanan Sampai
                        </Badge>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
                <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-1">
                        <Label className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                            Nama Penerima
                        </Label>
                        <p className="text-base font-semibold">
                            {shippingName}
                        </p>
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                            Nomor HP
                        </Label>
                        <p className="text-base font-medium">{shippingPhone}</p>
                    </div>
                </div>

                <Separator />

                <div className="space-y-1">
                    <Label className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                        Alamat Pengiriman
                    </Label>
                    <p className="text-base leading-relaxed font-medium">
                        {shippingAddress}
                    </p>
                </div>

                {isShipped && trackingNumber && (
                    <>
                        <Separator />
                        <div className="rounded-lg border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/50 p-5">
                            <div className="mb-3 flex items-center gap-2">
                                <div className="rounded-full bg-blue-600 p-1.5">
                                    <Truck className="h-4 w-4 text-white" />
                                </div>
                                <Label className="text-sm font-semibold text-blue-900">
                                    Lacak Pengiriman
                                </Label>
                            </div>
                            <div className="space-y-3">
                                {shippingMethod && (
                                    <div>
                                        <p className="text-xs font-medium text-blue-700">
                                            Jasa Ekspedisi
                                        </p>
                                        <p className="text-sm font-bold text-blue-900">
                                            {shippingMethod}
                                        </p>
                                    </div>
                                )}
                                <div>
                                    <p className="text-xs font-medium text-blue-700">
                                        Nomor Resi
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <p className="font-mono text-lg font-bold tracking-wider text-blue-900">
                                            {trackingNumber}
                                        </p>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-8 border-blue-300 bg-transparent bg-white text-blue-700 hover:bg-blue-50"
                                            onClick={() =>
                                                copyToClipboard(trackingNumber)
                                            }
                                        >
                                            <Copy className="mr-1.5 h-3.5 w-3.5" />
                                            Salin
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
