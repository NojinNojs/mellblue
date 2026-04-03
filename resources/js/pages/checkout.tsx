import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { formatCurrency } from '@/lib/format';
import { type Product, type ProductVariant, type User } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    CheckCircle2,
    Minus,
    Package,
    PackageOpen,
    Phone,
    Plus,
    Shield,
    Truck,
    User as UserIcon,
} from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';

function FieldError({ msg }: { msg?: string }) {
    if (!msg) return null;
    return (
        <p className="mt-1 flex items-center gap-1 text-xs font-medium text-red-500">
            <span className="inline-block h-1 w-1 rounded-full bg-red-500" />
            {msg}
        </p>
    );
}

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
    const [phoneError, setPhoneError] = useState<string>('');

    // Indonesian domestic format: starts with 08, total 10–13 digits
    const validatePhone = (val: string): string => {
        if (!val || val === '0') return 'Nomor handphone wajib diisi.';
        if (!/^08/.test(val)) return 'Harus diawali dengan 08 (contoh: 081234567890).';
        if (val.length < 10) return 'Nomor terlalu pendek — minimal 10 digit.';
        if (val.length > 13) return 'Nomor terlalu panjang — maksimal 13 digit.';
        return '';
    };
    const { data, setData, post, processing, errors, transform } = useForm({
        product_id: product.id,
        variant_id: variant?.id || null,
        quantity: 1,
        shipping_name: (user.full_name as string) || user.name,
        shipping_phone: (user.phone as string) || '08',
        address_street: '',
        address_province: '',
        address_city: '',
        address_postal: '',
        shipping_address: '',
        shipping_city: '',
    });

    const maxStock = variant ? variant.stock : product.available_stock;

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Keep only digits, always ensure starts with 0
        let digits = e.target.value.replace(/[^\d]/g, '');
        if (!digits.startsWith('0')) digits = '0' + digits.replace(/^0*/, '');
        const newVal = digits.slice(0, 13); // cap at 13 chars
        setData('shipping_phone', newVal);
        setPhoneError(validatePhone(newVal));
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
        const err = validatePhone(data.shipping_phone);
        if (err) {
            setPhoneError(err);
            document.getElementById('shipping_phone')?.focus();
            return;
        }
        transform((data) => ({
            ...data,
            shipping_address:
                `${data.address_street}, ${data.address_city}, ${data.address_province} ${data.address_postal}`.trim(),
            shipping_city: data.address_city,
        }));
        post('/orders');
    };

    const currentPrice = variant
        ? product.base_price + variant.price_adjustment
        : product.base_price;

    const total = currentPrice * data.quantity;



    return (
        <div className="min-h-screen bg-muted/30">
            <Head title="Checkout" />

            <div className="container mx-auto max-w-5xl px-4 py-8 md:py-10">
                {/* Header */}
                <div className="mb-8 flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-full border bg-background shadow-sm"
                        asChild
                    >
                        <Link
                            href={`/products/${product.public_id || product.slug}`}
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
                            Kasir
                        </h1>
                        <p className="text-xs text-muted-foreground">
                            Selesaikan pembelianmu dengan aman
                        </p>
                    </div>
                </div>

                {/* Step indicator */}
                <div className="mb-8 flex items-center gap-0">
                    {[
                        { label: 'Detail', icon: UserIcon },
                        { label: 'Konfirmasi', icon: Package },
                        { label: 'Pembayaran', icon: CheckCircle2 },
                    ].map((step, i) => {
                        const Icon = step.icon;
                        const active = i === 0;
                        return (
                            <div key={step.label} className="flex items-center">
                                <div
                                    className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                                        active
                                            ? 'bg-primary text-primary-foreground'
                                            : 'text-muted-foreground'
                                    }`}
                                >
                                    <Icon className="h-3 w-3" />
                                    {step.label}
                                </div>
                                {i < 2 && (
                                    <div className="mx-1 h-px w-6 bg-border" />
                                )}
                            </div>
                        );
                    })}
                </div>

                <form
                    id="checkout-form"
                    onSubmit={submit}
                    className="grid gap-6 lg:grid-cols-12 lg:gap-8"
                >
                    {/* LEFT: Shipping Form */}
                    <div className="space-y-5 lg:col-span-7">
                        {/* Recipient Info */}
                        <div className="rounded-2xl border bg-background p-5 shadow-sm">
                            <div className="mb-4 flex items-center gap-2">
                                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                                    <UserIcon className="h-4 w-4 text-primary" />
                                </div>
                                <h2 className="text-base font-bold">
                                    Info Penerima
                                </h2>
                            </div>

                            <div className="space-y-4">
                                {/* Name */}
                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="shipping_name"
                                        className="text-sm font-semibold"
                                    >
                                        Nama Lengkap{' '}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="shipping_name"
                                        placeholder="e.g. Budi Santoso"
                                        className="h-10"
                                        value={data.shipping_name}
                                        onChange={(e) =>
                                            setData(
                                                'shipping_name',
                                                e.target.value,
                                            )
                                        }
                                        required
                                    />
                                    <FieldError msg={errors.shipping_name} />
                                </div>

                                {/* Phone — prominent */}
                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="shipping_phone"
                                        className="text-sm font-semibold"
                                    >
                                        Nomor HP / WhatsApp{' '}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="shipping_phone"
                                            placeholder="081234567890"
                                            className="h-11 pl-9 font-medium tracking-wide"
                                            value={data.shipping_phone}
                                            onChange={handlePhoneChange}
                                            required
                                        />
                                    </div>
                                    <p className="text-[11px] text-muted-foreground">
                                        Format nomor HP Indonesia, dimulai 08 (contoh: 081234567890)
                                    </p>
                                    <FieldError msg={phoneError || errors.shipping_phone} />
                                </div>
                            </div>
                        </div>

                        {/* Delivery Address */}
                        <div className="rounded-2xl border bg-background p-5 shadow-sm">
                            <div className="mb-4 flex items-center gap-2">
                                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                                    <Truck className="h-4 w-4 text-primary" />
                                </div>
                                <h2 className="text-base font-bold">
                                    Alamat Pengiriman
                                </h2>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="address_street" className="text-sm font-semibold">
                                        Alamat Lengkap{' '}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Textarea
                                        id="address_street"
                                        placeholder="Jalan, No. Rumah, RT/RW, Kecamatan, Patokan"
                                        className="min-h-[72px] resize-none text-sm"
                                        value={data.address_street}
                                        onChange={(e) =>
                                            setData(
                                                'address_street',
                                                e.target.value,
                                            )
                                        }
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="address_province" className="text-sm font-semibold">
                                            Provinsi{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="address_province"
                                            placeholder="e.g. Jawa Barat"
                                            className="h-10 text-sm"
                                            value={data.address_province}
                                            onChange={(e) =>
                                                setData(
                                                    'address_province',
                                                    e.target.value,
                                                )
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="address_city" className="text-sm font-semibold">
                                            City / Kota{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="address_city"
                                            placeholder="e.g. Bandung"
                                            className="h-10 text-sm"
                                            value={data.address_city}
                                            onChange={(e) =>
                                                setData(
                                                    'address_city',
                                                    e.target.value,
                                                )
                                            }
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="address_postal" className="text-sm font-semibold">
                                        Kode Pos{' '}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="address_postal"
                                        type="number"
                                        placeholder="e.g. 40123"
                                        className="h-10 w-40 text-sm"
                                        value={data.address_postal}
                                        onChange={(e) =>
                                            setData(
                                                'address_postal',
                                                e.target.value,
                                            )
                                        }
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Quantity stepper */}
                        <div className="rounded-2xl border bg-background p-5 shadow-sm">
                            <div className="mb-4 flex items-center gap-2">
                                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                                    <Package className="h-4 w-4 text-primary" />
                                </div>
                                <h2 className="text-base font-bold">
                                    Kuantitas
                                </h2>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setData(
                                                'quantity',
                                                Math.max(1, data.quantity - 1),
                                            )
                                        }
                                        disabled={data.quantity <= 1}
                                        className="flex h-9 w-9 items-center justify-center rounded-full border bg-muted text-foreground transition hover:bg-muted/80 disabled:opacity-40"
                                    >
                                        <Minus className="h-4 w-4" />
                                    </button>
                                    <span className="w-8 text-center text-xl font-bold tabular-nums">
                                        {data.quantity}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setData(
                                                'quantity',
                                                Math.min(
                                                    maxStock,
                                                    data.quantity + 1,
                                                ),
                                            )
                                        }
                                        disabled={data.quantity >= maxStock}
                                        className="flex h-9 w-9 items-center justify-center rounded-full border bg-muted text-foreground transition hover:bg-muted/80 disabled:opacity-40"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    <span className="font-semibold text-foreground">
                                        {maxStock}
                                    </span>{' '}
                                    tersedia
                                </p>
                            </div>
                            <FieldError msg={errors.quantity} />
                        </div>
                    </div>

                    {/* RIGHT: Order Summary sticky */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-6 space-y-4">
                            <div className="rounded-2xl border bg-background shadow-sm overflow-hidden">
                                {/* Product */}
                                <div className="p-5">
                                    <h2 className="mb-4 text-base font-bold">
                                        Ringkasan Pesanan
                                    </h2>
                                    <div className="flex gap-4">
                                        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border bg-muted shadow-sm">
                                            {product.images &&
                                            product.images.length > 0 ? (
                                                <img
                                                    src={product.images[0].url}
                                                    alt={product.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center bg-muted">
                                                    <PackageOpen className="h-6 w-6 text-muted-foreground" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="line-clamp-2 text-sm font-bold leading-snug">
                                                {product.name}
                                            </p>
                                            {variant && (
                                                <span className="mt-1 inline-block rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                                                    {variant.name}
                                                </span>
                                            )}
                                            {product.category && (
                                                <p className="mt-1 text-xs text-muted-foreground">
                                                    {product.category}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Price breakdown */}
                                <div className="border-t bg-muted/30 px-5 py-4 space-y-2.5">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            Harga
                                        </span>
                                        <span className="font-medium">
                                            {formatCurrency(currentPrice)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            Jml
                                        </span>
                                        <span className="font-medium">
                                            × {data.quantity}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            Pengiriman
                                        </span>
                                        <span className="font-semibold text-green-600">
                                            Gratis
                                        </span>
                                    </div>
                                    <div className="border-t pt-2.5 flex justify-between items-center">
                                        <span className="text-sm font-bold">
                                            Total
                                        </span>
                                        <span className="text-lg font-bold text-primary tabular-nums">
                                            {formatCurrency(total)}
                                        </span>
                                    </div>
                                </div>

                                {/* CTA */}
                                <div className="px-5 pb-5 pt-4 space-y-3">
                                    <Button
                                        className="h-12 w-full text-base font-bold shadow-sm"
                                        type="submit"
                                        form="checkout-form"
                                        disabled={processing}
                                    >
                                        {processing
                                            ? 'Memproses...'
                                            : '✓ Konfirmasi Pesanan'}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className="h-10 w-full text-sm text-muted-foreground"
                                        asChild
                                    >
                                        <Link
                                            href={`/products/${product.public_id || product.slug}`}
                                        >
                                            Batal
                                        </Link>
                                    </Button>
                                </div>
                            </div>

                            {/* Trust badges */}
                            <div className="rounded-2xl border bg-background px-4 py-3 shadow-sm">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Shield className="h-3.5 w-3.5 shrink-0 text-green-500" />
                                    <span>
                                        Data kamu aman dan hanya digunakan untuk
                                        pengiriman pesanan
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
