import { Button } from '@/components/ui/button';
import {
    ImageUploader,
    type ExistingImage,
} from '@/components/ui/image-uploader';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { router, useForm } from '@inertiajs/react';
import { Minus, Package, Plus, Tag } from 'lucide-react';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

interface Category {
    id: number;
    name: string;
}

export interface Product {
    id: number;
    name: string;
    description: string;
    base_price: number;
    stock: number;
    status: 'active' | 'draft' | 'archived';
    category_id: number;
    images?: ExistingImage[];
}

interface ProductFormProps {
    product?: Product | null;
    categories: Category[];
    onSuccess: () => void;
    onCancel: () => void;
}

// --- Helper: format number to "1.000.000" IDR style ---
function formatIDR(value: number | string): string {
    const num =
        typeof value === 'string'
            ? parseInt(Number(value).toString(), 10)
            : Math.floor(value);
    if (isNaN(num) || num === 0) return '';
    return num.toLocaleString('id-ID');
}


export function ProductForm({
    product,
    categories,
    onSuccess,
    onCancel,
}: ProductFormProps) {
    const isEdit = !!product;

    const [previewImages, setPreviewImages] = useState<string[]>([]);
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [existingImagesToKeep, setExistingImagesToKeep] = useState<
        ExistingImage[]
    >(product?.images || []);
    const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);

    // Display value for the price field (formatted string)
    const [priceDisplay, setPriceDisplay] = useState<string>(
        product?.base_price ? formatIDR(product.base_price) : '',
    );

    const form = useForm({
        name: product?.name || '',
        category_id: product?.category_id ? String(product.category_id) : '',
        description: product?.description || '',
        base_price: product?.base_price ? Math.floor(Number(product.base_price)) : 0,
        stock: product?.stock || 0,
        status: product?.status || 'active',
        images: [] as File[],
        delete_images: [] as number[],
    });

    // --- Price change handler with IDR formatting ---
    const handlePriceChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const raw = e.target.value.replace(/\D/g, '');
            const numericValue = parseInt(raw, 10) || 0;
            setPriceDisplay(raw === '' ? '' : formatIDR(numericValue));
            form.setData('base_price', numericValue);
        },
        [form],
    );

    // --- Stock stepper handlers ---
    const incrementStock = useCallback(() => {
        form.setData('stock', (form.data.stock || 0) + 1);
    }, [form]);

    const decrementStock = useCallback(() => {
        form.setData('stock', Math.max(0, (form.data.stock || 0) - 1));
    }, [form]);

    const handleStockChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const val = parseInt(e.target.value.replace(/\D/g, ''), 10);
            form.setData('stock', isNaN(val) ? 0 : Math.max(0, val));
        },
        [form],
    );

    // --- Image handlers ---
    const handleImageSelect = (file: File) => {
        const totalImages =
            existingImagesToKeep.length + selectedImages.length + 1;
        if (totalImages > 5) {
            toast.error('You can only upload up to 5 images per product.');
            return;
        }

        setSelectedImages((prev) => [...prev, file]);
        const previewUrl = URL.createObjectURL(file);
        setPreviewImages((prev) => [...prev, previewUrl]);
    };

    const removeNewImage = (index: number) => {
        setSelectedImages((prev) => prev.filter((_, i) => i !== index));
        setPreviewImages((prev) => {
            URL.revokeObjectURL(prev[index]);
            return prev.filter((_, i) => i !== index);
        });
    };

    const removeExistingImage = (imageId: number) => {
        setExistingImagesToKeep((prev) =>
            prev.filter((img) => img.id !== imageId),
        );
        setDeletedImageIds((prev) => [...prev, imageId]);
    };

    // --- Submit ---
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEdit) {
            const formData = new FormData();
            formData.append('_method', 'PUT');
            formData.append('name', form.data.name);
            formData.append('category_id', form.data.category_id);
            formData.append('description', form.data.description);
            formData.append('base_price', String(form.data.base_price));
            formData.append('stock', String(form.data.stock));
            formData.append('status', form.data.status);

            deletedImageIds.forEach((id) => {
                formData.append('delete_images[]', String(id));
            });

            selectedImages.forEach((file) => {
                formData.append('images[]', file);
            });

            router.post(`/admin/products/${product.id}`, formData, {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Product updated successfully');
                    onSuccess();
                },
                onError: (errors) => {
                    if (errors.images) toast.error(errors.images);
                },
            });
        } else {
            form.transform((data) => ({
                ...data,
                images: selectedImages,
            }));

            form.post('/admin/products', {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Product created successfully');
                    onSuccess();
                },
                onError: (errors) => {
                    if (errors.images) toast.error(errors.images);
                },
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* --- Product Name --- */}
            <div className="space-y-1.5">
                <Label
                    htmlFor="name"
                    className="flex items-center gap-1.5 text-sm font-medium"
                >
                    <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                    Product Name <span className="text-destructive">*</span>
                </Label>
                <Input
                    id="name"
                    placeholder="e.g. Fudgy Brownies Premium"
                    value={form.data.name}
                    onChange={(e) => form.setData('name', e.target.value)}
                    required
                />
                {form.errors.name && (
                    <p className="text-xs text-destructive">
                        {form.errors.name}
                    </p>
                )}
            </div>

            {/* --- Category + Status (edit) --- */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                    <Label htmlFor="category" className="text-sm font-medium">
                        Category <span className="text-destructive">*</span>
                    </Label>
                    <Select
                        value={form.data.category_id}
                        onValueChange={(val) =>
                            form.setData('category_id', val)
                        }
                        required
                    >
                        <SelectTrigger id="category">
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map((cat) => (
                                <SelectItem key={cat.id} value={String(cat.id)}>
                                    {cat.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {form.errors.category_id && (
                        <p className="text-xs text-destructive">
                            {form.errors.category_id}
                        </p>
                    )}
                </div>

                {isEdit && (
                    <div className="space-y-1.5">
                        <Label htmlFor="status" className="text-sm font-medium">
                            Status
                        </Label>
                        <Select
                            value={form.data.status}
                            onValueChange={(val) =>
                                form.setData(
                                    'status',
                                    val as 'active' | 'draft' | 'archived',
                                )
                            }
                        >
                            <SelectTrigger id="status">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="archived">
                                    Archived
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                )}
            </div>

            {/* --- Price + Stock row --- */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* IDR Price Input */}
                <div className="space-y-1.5">
                    <Label htmlFor="base_price" className="text-sm font-medium">
                        Base Price <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center rounded-l-md border-r bg-muted px-3">
                            <span className="text-sm font-semibold text-muted-foreground">
                                Rp
                            </span>
                        </div>
                        <Input
                            id="base_price"
                            type="text"
                            inputMode="numeric"
                            placeholder="0"
                            className="pl-14 text-right font-mono tracking-wide tabular-nums"
                            value={priceDisplay}
                            onChange={handlePriceChange}
                            required
                        />
                    </div>
                    {form.data.base_price > 0 && (
                        <p className="text-xs text-muted-foreground">
                            Rp {formatIDR(form.data.base_price)}
                        </p>
                    )}
                    {form.errors.base_price && (
                        <p className="text-xs text-destructive">
                            {form.errors.base_price}
                        </p>
                    )}
                </div>

                {/* Stock Stepper Input */}
                <div className="space-y-1.5">
                    <Label
                        htmlFor="stock"
                        className="flex items-center gap-1.5 text-sm font-medium"
                    >
                        <Package className="h-3.5 w-3.5 text-muted-foreground" />
                        {isEdit ? 'Stock' : 'Initial Stock'}{' '}
                        <span className="text-destructive">*</span>
                    </Label>
                    <div className="flex items-center gap-0">
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-9 w-9 shrink-0 rounded-r-none border-r-0"
                            onClick={decrementStock}
                            disabled={form.data.stock <= 0}
                        >
                            <Minus className="h-3.5 w-3.5" />
                        </Button>
                        <Input
                            id="stock"
                            type="text"
                            inputMode="numeric"
                            className="[appearance:textfield] rounded-none text-center font-mono tabular-nums [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                            value={form.data.stock || ''}
                            onChange={handleStockChange}
                            required
                        />
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-9 w-9 shrink-0 rounded-l-none border-l-0"
                            onClick={incrementStock}
                        >
                            <Plus className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                    {form.data.stock > 0 && (
                        <p className="text-xs text-muted-foreground">
                            {form.data.stock} unit
                            {form.data.stock > 1 ? 's' : ''} available
                        </p>
                    )}
                    {form.errors.stock && (
                        <p className="text-xs text-destructive">
                            {form.errors.stock}
                        </p>
                    )}
                </div>
            </div>

            {/* --- Description --- */}
            <div className="space-y-1.5">
                <Label htmlFor="description" className="text-sm font-medium">
                    Description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                    id="description"
                    className="min-h-[120px] resize-y"
                    placeholder="Describe the product, ingredients, weight, etc."
                    value={form.data.description}
                    maxLength={500}
                    onChange={(e) =>
                        form.setData('description', e.target.value)
                    }
                    required
                />
                <div className="flex items-center justify-between">
                    {form.errors.description ? (
                        <p className="text-xs text-destructive">
                            {form.errors.description}
                        </p>
                    ) : (
                        <span />
                    )}
                    <span className="text-xs text-muted-foreground">
                        {form.data.description.length} / 500
                    </span>
                </div>
            </div>

            {/* --- Images --- */}
            <ImageUploader
                existingImages={existingImagesToKeep}
                previewImages={previewImages}
                onImageSelect={handleImageSelect}
                onRemoveExisting={removeExistingImage}
                onRemoveNew={removeNewImage}
                aspectRatio={3 / 4}
                error={form.errors.images as string}
            />

            {/* --- Actions --- */}
            <div className="flex items-center justify-end gap-3 border-t pt-4">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" disabled={form.processing}>
                    {form.processing
                        ? 'Saving...'
                        : isEdit
                          ? 'Save Changes'
                          : 'Create Product'}
                </Button>
            </div>
        </form>
    );
}
