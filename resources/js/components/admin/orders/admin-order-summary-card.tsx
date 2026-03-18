import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { PackageOpen } from 'lucide-react';

// In admin interface, order items include subtotal from backend directly usually
interface AdminOrderItem {
    id: number;
    product_name: string;
    variant_name: string | null;
    unit_price: number;
    quantity: number;
    subtotal: number;
    image: string | null;
}

interface AdminOrderSummaryCardProps {
    items: AdminOrderItem[];
    subtotal: number;
    shippingCost: number;
    total: number;
    formatPrice: (price: number | undefined) => string;
}

export function AdminOrderSummaryCard({
    items,
    subtotal,
    shippingCost,
    total,
    formatPrice,
}: AdminOrderSummaryCardProps) {
    return (
        <Card className="overflow-hidden shadow-sm">
            <CardHeader className="bg-muted/30 px-5 py-4">
                <div className="flex items-center gap-2">
                    <PackageOpen className="h-5 w-5 text-emerald-600" />
                    <CardTitle className="text-lg">Ordered Items</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="divide-y">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center"
                        >
                            <div className="flex shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-muted p-2 sm:h-20 sm:w-20">
                                {item.image ? (
                                    <img
                                        src={item.image}
                                        alt={item.product_name}
                                        className="h-full w-full rounded object-cover shadow-sm"
                                    />
                                ) : (
                                    <PackageOpen className="h-8 w-8 text-muted-foreground/50" />
                                )}
                            </div>
                            <div className="min-w-0 flex-1">
                                <h4 className="font-semibold text-foreground">
                                    {item.product_name}
                                </h4>
                                {item.variant_name && (
                                    <p className="mt-0.5 text-sm text-muted-foreground">
                                        Variant: {item.variant_name}
                                    </p>
                                )}
                                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                                    <span className="font-medium text-brand-blue">
                                        {formatPrice(item.unit_price)}
                                    </span>
                                    <span className="text-muted-foreground">
                                        x {item.quantity}
                                    </span>
                                </div>
                            </div>
                            <div className="shrink-0 text-right">
                                <p className="font-bold text-foreground">
                                    {formatPrice(item.subtotal)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="bg-muted/10 p-5">
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between text-sm text-muted-foreground">
                            <span>Subtotal</span>
                            <span className="font-medium text-foreground">
                                {formatPrice(subtotal)}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground">
                            <span>Shipping Cost</span>
                            <span className="font-medium text-foreground">
                                {formatPrice(shippingCost)}
                            </span>
                        </div>
                        <Separator className="my-2" />
                        <div className="flex justify-between text-base font-bold sm:text-lg">
                            <span>Total Amount</span>
                            <span className="text-brand-blue">
                                {formatPrice(total)}
                            </span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
