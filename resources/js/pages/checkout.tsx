import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { formatCurrency } from '@/lib/format';
import { type Product, type ProductVariant, type User } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, PackageOpen } from 'lucide-react';
import { FormEventHandler, useEffect } from 'react';

export interface CheckoutPageProps {
    product: Product;
    variant: ProductVariant | null;
    user: User;
}

export default function Checkout({
    product,
    variant,
    user,
}: CheckoutPageProps) {
    const { data, setData, post, processing, errors, transform } = useForm({
        product_id: product.id,
        variant_id: variant?.id || null,
        quantity: 1,
        shipping_name: (user.full_name as string) || user.name,
        shipping_phone: (user.phone as string) || '+62',
        address_street: '',
        address_province: '',
        address_city: '',
        address_postal: '',
        shipping_address: '',
        shipping_city: '',
    });

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value;
        // Ensure it always starts with +62
        if (!val.startsWith('+62')) {
            val = '+62' + val.replace(/^[+0]+[62]*/, '');
        }
        // Only allow numbers after +62
        const stripped = val.substring(3).replace(/[^\d]/g, '');
        setData('shipping_phone', '+62' + stripped);
    };

    const isAvailable =
        product.status === 'active' &&
        (variant ? variant.stock > 0 : product.available_stock > 0);

    useEffect(() => {
        if (!isAvailable) {
            router.visit(`/products/${product.public_id || product.slug}`, {
                method: 'get',
                replace: true,
            });
        }
    }, [product, variant, isAvailable]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        
        transform((data) => ({
            ...data,
            shipping_address: `${data.address_street}, ${data.address_city}, ${data.address_province} ${data.address_postal}`.trim(),
            shipping_city: data.address_city,
        }));

        post('/orders');
    };

    const currentPrice = variant
        ? product.base_price + variant.price_adjustment
        : product.base_price;

    return (
        <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-muted/20">
            <Head title="Checkout" />

            <div className="container mx-auto max-w-6xl px-4 py-8 md:py-12">
                {/* Header with Back Button */}
                <div className="mb-10 flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-full border shadow-sm hover:shadow-md"
                        asChild
                    >
                        <Link
                            href={`/products/${product.public_id || product.slug}`}
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Checkout
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            Complete your purchase securely
                        </p>
                    </div>
                </div>

                <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
                    {/* Left Column: Shipping Form */}
                    <div className="space-y-8 lg:col-span-7">
                        <Card className="border-2 shadow-lg">
                            <CardHeader className="space-y-2 p-6 pb-0">
                                <CardTitle className="text-2xl">
                                    Shipping Information
                                </CardTitle>
                                <CardDescription className="text-base">
                                    Enter your delivery details carefully.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-8 pt-6">
                                <form
                                    id="checkout-form"
                                    onSubmit={submit}
                                    className="space-y-6"
                                >
                                    <div className="space-y-3">
                                        <Label
                                            htmlFor="shipping_name"
                                            className="text-base font-semibold"
                                        >
                                            Recipient Name
                                        </Label>
                                        <Input
                                            id="shipping_name"
                                            placeholder="Enter recipient's full name"
                                            className="h-12 text-base"
                                            value={data.shipping_name}
                                            onChange={(e) =>
                                                setData(
                                                    'shipping_name',
                                                    e.target.value,
                                                )
                                            }
                                            required
                                        />
                                        {errors.shipping_name && (
                                            <p className="text-sm font-medium text-red-500">
                                                {errors.shipping_name}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-3 relative">
                                        <Label
                                            htmlFor="shipping_phone"
                                            className="text-base font-semibold"
                                        >
                                            Phone / WhatsApp Number
                                        </Label>
                                        <Input
                                            id="shipping_phone"
                                            placeholder="+62 812 3456 7890"
                                            className="h-12 text-base font-medium tracking-wide"
                                            value={data.shipping_phone}
                                            onChange={handlePhoneChange}
                                            required
                                        />
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Format: +62 followed by your number (e.g. +62812...)
                                        </p>
                                        {errors.shipping_phone && (
                                            <p className="text-sm font-medium text-red-500">
                                                {errors.shipping_phone}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-5 rounded-lg border bg-muted/20 p-5 mt-6">
                                        <h3 className="text-lg font-semibold border-b pb-3">Delivery Address</h3>
                                        
                                        <div className="space-y-3">
                                            <Label htmlFor="address_street">
                                                Street Address & Details
                                            </Label>
                                            <Textarea
                                                id="address_street"
                                                placeholder="Nama Jalan, Gedung, No. Rumah, RT/RW, Patokan"
                                                className="min-h-[80px] resize-none text-base"
                                                value={data.address_street}
                                                onChange={(e) => setData('address_street', e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-3">
                                                <Label htmlFor="address_province">
                                                    Province / Provinsi
                                                </Label>
                                                <Input
                                                    id="address_province"
                                                    placeholder="e.g. Jawa Barat"
                                                    className="h-12"
                                                    value={data.address_province}
                                                    onChange={(e) => setData('address_province', e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <Label htmlFor="address_city">
                                                    City / Kota/Kabupaten
                                                </Label>
                                                <Input
                                                    id="address_city"
                                                    placeholder="e.g. Bandung"
                                                    className="h-12"
                                                    value={data.address_city}
                                                    onChange={(e) => setData('address_city', e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <Label htmlFor="address_postal">
                                                Kode Pos (Postal Code)
                                            </Label>
                                            <Input
                                                id="address_postal"
                                                type="number"
                                                placeholder="e.g. 40123"
                                                className="h-12 w-full md:w-1/2"
                                                value={data.address_postal}
                                                onChange={(e) => setData('address_postal', e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <Label
                                            htmlFor="quantity"
                                            className="text-base font-semibold"
                                        >
                                            Quantity
                                        </Label>
                                        <Input
                                            id="quantity"
                                            type="number"
                                            min="1"
                                            max={
                                                variant
                                                    ? variant.stock
                                                    : product.available_stock
                                            }
                                            className="h-12 w-32 text-base"
                                            value={data.quantity}
                                            onChange={(e) =>
                                                setData(
                                                    'quantity',
                                                    parseInt(e.target.value) ||
                                                        1,
                                                )
                                            }
                                            required
                                        />
                                        {errors.quantity && (
                                            <p className="text-sm font-medium text-red-500">
                                                {errors.quantity}
                                            </p>
                                        )}
                                        <p className="text-xs text-muted-foreground">
                                            Available stock:{' '}
                                            {variant
                                                ? variant.stock
                                                : product.available_stock}
                                        </p>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-8 space-y-6">
                            <Card className="overflow-hidden border-2 shadow-xl">
                                <CardHeader className="space-y-2 bg-muted/50 p-6 pb-6">
                                    <CardTitle className="text-2xl">
                                        Order Summary
                                    </CardTitle>
                                    <CardDescription className="text-base">
                                        Review your order details
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-8 p-8">
                                    {/* Product Details */}
                                    <div className="flex gap-6">
                                        <div className="aspect-[3/4] w-28 flex-shrink-0 overflow-hidden rounded-lg border-2 bg-muted shadow-md">
                                            {product.images &&
                                            product.images.length > 0 ? (
                                                <img
                                                    src={product.images[0].url}
                                                    alt={product.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200 text-zinc-400">
                                                    <PackageOpen className="h-10 w-10 opacity-40" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-1 flex-col justify-between space-y-3 py-1">
                                            <div className="space-y-2">
                                                <h3 className="line-clamp-2 text-lg leading-tight font-bold">
                                                    {product.name}
                                                </h3>
                                                {variant && (
                                                    <p className="text-sm font-medium text-muted-foreground">
                                                        Variant: {variant.name}
                                                    </p>
                                                )}
                                                <p className="text-sm text-muted-foreground">
                                                    {product.category}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <Separator className="my-6" />

                                    {/* Price Breakdown */}
                                    <div className="space-y-4">
                                        <div className="flex justify-between text-base">
                                            <span className="font-medium text-muted-foreground">
                                                Price
                                            </span>
                                            <span className="font-semibold">
                                                {formatCurrency(currentPrice)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-base">
                                            <span className="font-medium text-muted-foreground">
                                                Quantity
                                            </span>
                                            <span className="font-semibold">
                                                {data.quantity}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-base">
                                            <span className="font-medium text-muted-foreground">
                                                Shipping
                                            </span>
                                            <span className="font-bold text-green-600">
                                                Free
                                            </span>
                                        </div>
                                    </div>

                                    <Separator className="my-6" />

                                    {/* Total */}
                                    <div className="flex items-center justify-between rounded-lg bg-primary/5 p-4">
                                        <span className="text-lg font-bold">
                                            Total
                                        </span>
                                        <span className="text-2xl font-bold text-primary">
                                            {formatCurrency(
                                                currentPrice * data.quantity,
                                            )}
                                        </span>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex flex-col gap-4 bg-muted/50 p-8 pt-6">
                                    <Button
                                        className="h-14 w-full text-lg font-semibold shadow-lg transition-all hover:shadow-xl"
                                        size="lg"
                                        type="submit"
                                        form="checkout-form"
                                        disabled={processing}
                                    >
                                        {processing
                                            ? 'Processing...'
                                            : 'Confirm Order'}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="h-12 w-full border-2 text-base font-semibold"
                                        asChild
                                    >
                                        <Link
                                            href={`/products/${product.public_id || product.slug}`}
                                        >
                                            Cancel
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
