import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/format';
import { type OrderItem } from '@/types';
import { Package, PackageOpen } from 'lucide-react';
import { ReactNode } from 'react';

interface OrderSummaryCardProps {
    items: OrderItem[];
    total: number;
    uniqueCode?: number;
    shippingCost?: number;
    action?: ReactNode; // E.g., Cancel Button for customers
}

export function OrderSummaryCard({
    items,
    total,
    uniqueCode = 0,
    shippingCost = 0,
    action,
}: OrderSummaryCardProps) {
    return (
        <Card className="border-2 shadow-sm">
            <CardHeader className="p-6">
                <CardTitle className="flex items-center gap-2 text-xl">
                    <Package className="h-5 w-5 text-muted-foreground" />
                    Items Ordered
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <div className="space-y-6">
                    {items.map((item) => {
                        const snapshot = item.product_snapshot as {
                            images?: Array<{ url: string }>;
                            image?: string;
                        };
                        const imageUrl = snapshot?.images?.[0]?.url || snapshot?.image;

                        return (
                            <div key={item.id} className="flex gap-4">
                                <div className="aspect-[3/4] w-16 flex-shrink-0 overflow-hidden rounded-md border bg-muted">
                                    {imageUrl ? (
                                        <img
                                            src={imageUrl}
                                            alt={item.product_name}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200 text-zinc-400">
                                            <PackageOpen className="h-6 w-6 opacity-40" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-1 flex-col justify-between py-1">
                                    <div>
                                        <h4 className="line-clamp-2 font-semibold">
                                            {item.product_name}
                                        </h4>
                                        {item.variant_name && (
                                            <p className="text-sm font-medium text-muted-foreground">
                                                Variant: {item.variant_name}
                                            </p>
                                        )}
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            {formatCurrency(item.unit_price)} x{' '}
                                            {item.quantity}
                                        </p>
                                    </div>
                                    <p className="text-right font-medium">
                                        {formatCurrency(
                                            item.unit_price * item.quantity,
                                        )}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <Separator className="my-6" />
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>
                            {formatCurrency(
                                total - (uniqueCode || 0) - shippingCost,
                            )}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">
                            Shipping Cost
                        </span>
                        <span className="font-medium text-green-600">
                            {shippingCost === 0
                                ? 'Free'
                                : formatCurrency(shippingCost)}
                        </span>
                    </div>
                    {uniqueCode > 0 && (
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">
                                Unique Code (Admin Fee)
                            </span>
                            <span>{formatCurrency(uniqueCode)}</span>
                        </div>
                    )}
                    <Separator className="my-2" />
                    <div className="flex items-center justify-between text-lg font-bold">
                        <span>Total Amount</span>
                        <span className="text-primary">
                            {formatCurrency(total)}
                        </span>
                    </div>
                </div>

                {action && (
                    <>
                        <Separator className="my-6" />
                        <div className="mt-6 p-0 px-6 pb-6">{action}</div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
