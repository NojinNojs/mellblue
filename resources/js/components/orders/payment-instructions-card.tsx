import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/lib/format';
import { AlertCircle, Copy, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

interface PaymentInstructionsCardProps {
    total: number;
}

export function PaymentInstructionsCard({
    total,
}: PaymentInstructionsCardProps) {
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard!');
    };

    return (
        <Card className="border-2 shadow-sm">
            <CardHeader className="bg-muted/30 p-6 pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    Payment Instructions
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
                <div className="rounded-lg border bg-yellow-50 p-4 text-yellow-900">
                    <div className="flex gap-3">
                        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                        <div className="text-sm">
                            <p className="font-medium">Important!</p>
                            <p>
                                Transfer exactly up to the last 3 digits to
                                verify your payment automatically.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-muted-foreground">
                            Bank Destination
                        </Label>
                        <div className="flex items-center justify-between rounded-lg border p-3">
                            <div className="flex items-center gap-3">
                                <div className="flex h-8 w-12 items-center justify-center rounded bg-blue-600 font-bold text-white">
                                    BCA
                                </div>
                                <span className="font-medium">
                                    Bank Central Asia
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-muted-foreground">
                            Account Number
                        </Label>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 rounded-lg border bg-muted/50 p-3 font-mono text-lg font-bold tracking-wider">
                                1234567890
                            </div>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-12 w-12 shrink-0"
                                onClick={() => copyToClipboard('1234567890')}
                            >
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            a.n. PT MELLBLUE
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-muted-foreground">
                            Total Amount
                        </Label>
                        <div className="relative">
                            <div
                                className="group flex cursor-pointer items-center justify-between rounded-lg border-2 border-dashed border-primary/50 bg-primary/5 p-4 transition-colors hover:bg-primary/10"
                                onClick={() =>
                                    copyToClipboard(total.toString())
                                }
                            >
                                <span className="text-2xl font-bold text-primary">
                                    {formatCurrency(total)}
                                </span>
                                <div className="flex items-center gap-2 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                                    <Copy className="h-4 w-4" />
                                    Click to Copy
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
