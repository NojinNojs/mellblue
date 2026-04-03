import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AdminLayout from '@/layouts/admin-layout';

import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import {
    AlertTriangle,
    Archive,
    ArchiveRestore,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Clock,
    Edit2,
    Loader2,
    MoreHorizontal,
    Package,
    PackageOpen,
    Tag,
    Trash2,
    X,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

// Generic Components
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { DataTable } from '@/components/ui/data-table';
import { PageHeader } from '@/components/ui/page-header';
import {
    SearchFilters,
    type FilterConfig,
} from '@/components/ui/search-filters';

// Features
import {
    ProductForm,
    type Product,
} from '@/components/admin/products/product-form';
import { type ExistingImage } from '@/components/ui/image-uploader';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Dashboard', href: '/admin' },
    { title: 'Products', href: '/admin/products' },
];

interface Category {
    id: number;
    name: string;
}

interface PaginatedProducts {
    data: Product[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface ProductsPageProps {
    products: PaginatedProducts;
    categories: Category[];
}

interface PreviewableImageProps {
    images: ExistingImage[];
    alt: string;
}

function PreviewableImage({ images, alt }: PreviewableImageProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const hasImages = images && images.length > 0;
    const isMultiImage = images && images.length > 1;

    const handlePrevious = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation();
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    }, [images]);

    const handleNext = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation();
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, [images]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;
            if (e.key === 'ArrowLeft') handlePrevious();
            if (e.key === 'ArrowRight') handleNext();
            if (e.key === 'Escape') setIsOpen(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, handlePrevious, handleNext]);

    if (!hasImages) return null;

    const currentImage = images[currentIndex];
    const src = currentImage.url || `/storage/${currentImage.image_url}`;

    return (
        <>
            <div
                className="group relative h-10 w-10 cursor-zoom-in overflow-hidden rounded-md border bg-muted transition-all hover:ring-2 hover:ring-primary/40"
                onClick={() => {
                    setCurrentIndex(0);
                    setIsOpen(true);
                }}
                title="Click to enlarge"
            >
                <img
                    src={images[0].url || `/storage/${images[0].image_url}`}
                    alt={alt}
                    className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
                {isMultiImage && (
                    <div className="absolute bottom-0 right-0 rounded-tl bg-black/60 px-1 py-0.5 text-[8px] font-bold text-white backdrop-blur-sm">
                        {images.length}
                    </div>
                )}
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="!fixed !inset-0 !z-[100] !max-w-none !w-screen !h-screen !translate-x-0 !translate-y-0 !top-0 !left-0 !gap-0 flex flex-col items-center justify-center border-none bg-black/95 p-0 shadow-none outline-none backdrop-blur-xl [&>button]:hidden">
                    <DialogTitle className="sr-only">Product Image Gallery - {alt}</DialogTitle>
                    <DialogDescription className="sr-only">
                        Viewing image {currentIndex + 1} of {images.length} for {alt}
                    </DialogDescription>
                    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden">
                        {/* Static Backdrop for clicks */}
                        <div 
                            className="absolute inset-0 z-0 bg-transparent" 
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Top Controls: Close Button */}
                        <div className="absolute top-0 right-0 z-50 p-4 md:p-8">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-xl border border-white/20 transition-all hover:bg-white/20 hover:rotate-90 hover:scale-110 active:scale-95"
                                title="Close (Esc)"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        {/* Navigation Arrows (Large & Edge-to-Edge) */}
                        {isMultiImage && (
                            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-50 flex items-center justify-between px-2 md:px-8 pointer-events-none">
                                <button
                                    onClick={handlePrevious}
                                    className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full bg-black/20 md:bg-white/5 text-white backdrop-blur-md border border-white/10 transition-all hover:bg-white/20 hover:scale-110 active:scale-95"
                                >
                                    <ChevronLeft className="h-8 w-8" />
                                </button>
                                <button
                                    onClick={handleNext}
                                    className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full bg-black/20 md:bg-white/5 text-white backdrop-blur-md border border-white/10 transition-all hover:bg-white/20 hover:scale-110 active:scale-95"
                                >
                                    <ChevronRight className="h-8 w-8" />
                                </button>
                            </div>
                        )}

                        {/* Main Image Viewport */}
                        <div className="relative z-10 flex h-full w-full items-center justify-center p-4 md:p-12 lg:p-24 pointer-events-none">
                            <div className="relative flex items-center justify-center max-h-full max-w-full">
                                <img
                                    key={src}
                                    src={src}
                                    alt={alt}
                                    className="h-auto max-h-[75vh] md:max-h-[85vh] w-auto max-w-[90vw] rounded-lg shadow-2xl object-contain animate-in fade-in zoom-in-95 duration-500 pointer-events-auto select-none"
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>
                        </div>

                        {/* Bottom: Counter Badge */}
                        <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-50">
                            <div className="rounded-full bg-white/10 px-6 py-2 text-sm font-semibold text-white backdrop-blur-2xl border border-white/20 shadow-2xl tracking-[0.2em] uppercase">
                                {isMultiImage ? `${currentIndex + 1} / ${images.length}` : '1 / 1'}
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}


export default function Products({ products, categories }: ProductsPageProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    const [isDeleting, setIsDeleting] = useState(false);
    const [isRestoring, setIsRestoring] = useState(false);
    const [togglingId, setTogglingId] = useState<number | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(
        null,
    );

    // Client-side filtering
    const filteredProducts = useMemo(() => {
        return products.data.filter((product) => {
            const matchesSearch =
                searchTerm === '' ||
                product.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory =
                categoryFilter === 'all' ||
                String(product.category_id) === String(categoryFilter);
            const matchesStatus =
                statusFilter === 'all' || product.status === statusFilter;

            return matchesSearch && matchesCategory && matchesStatus;
        });
    }, [products.data, searchTerm, categoryFilter, statusFilter]);

    const handleClearFilters = () => {
        setSearchTerm('');
        setCategoryFilter('all');
        setStatusFilter('all');
    };

    const hasActiveFilters =
        searchTerm !== '' || categoryFilter !== 'all' || statusFilter !== 'all';

    const handleDeleteProduct = () => {
        if (!selectedProduct) return;
        setIsDeleting(true);
        router.delete(`/admin/products/${selectedProduct.id}`, {
            onSuccess: (page) => {
                const flash = page.props.flash as Record<string, string | null> | undefined;
                if (flash?.error) {
                    toast.error(flash.error, { duration: 5000 });
                } else {
                    toast.success(flash?.success || 'Product archived successfully');
                    setDeleteDialogOpen(false);
                    setSelectedProduct(null);
                }
                setIsDeleting(false);
            },
            onError: () => {
                toast.error('Failed to process request');
                setIsDeleting(false);
            },
        });
    };

    const handleRestoreProduct = (product: Product) => {
        setIsRestoring(true);
        router.post(`/admin/products/${product.id}/restore`, {}, {
            onSuccess: (page) => {
                const flash = page.props.flash as Record<string, string | null> | undefined;
                if (flash?.error) {
                    toast.error(flash.error, { duration: 5000 });
                } else {
                    toast.success(flash?.success || 'Product restored successfully');
                }
                setIsRestoring(false);
            },
            onError: () => {
                toast.error('Failed to restore product');
                setIsRestoring(false);
            },
        });
    };

    const handleToggleStatus = (product: Product, currentStatus: string) => {
        if (togglingId !== null) return; // prevent double-tap
        const newStatus = currentStatus === 'active' ? 'sold_out' : 'active';
        setTogglingId(product.id);
        router.patch(
            `/admin/products/${product.id}/toggle-status`,
            { status: newStatus },
            {
                preserveScroll: true,
                onSuccess: () => toast.success(`Product marked as ${newStatus}`),
                onFinish: () => setTogglingId(null),
            },
        );
    };

    const openCreateDialog = () => {
        setSelectedProduct(null);
        setDialogOpen(true);
    };

    const openEditDialog = (product: Product) => {
        setSelectedProduct(product);
        setDialogOpen(true);
    };

    const openDeleteDialog = (product: Product) => {
        setSelectedProduct(product);
        setDeleteDialogOpen(true);
    };

    const filters: FilterConfig[] = [
        {
            id: 'category',
            placeholder: 'Category',
            value: categoryFilter,
            onChange: setCategoryFilter,
            options: [
                { label: 'All Categories', value: 'all' },
                ...categories.map((c) => ({
                    label: c.name,
                    value: String(c.id),
                })),
            ],
        },
        {
            id: 'status',
            placeholder: 'Status',
            value: statusFilter,
            onChange: setStatusFilter,
            options: [
                { label: 'All Status', value: 'all' },
                { label: 'Active', value: 'active' },
                { label: 'Sold Out', value: 'sold_out' },
                { label: 'Archived', value: 'archived' },
            ],
        },
    ];

    const columns: ColumnDef<Product>[] = [
        {
            accessorKey: 'name',
            header: 'Product',
            cell: ({ row }) => {
                const product = row.original;
                const hasImages = product.images && product.images.length > 0;
                return (
                    <div className="flex items-center gap-3">
                        {hasImages ? (
                            <PreviewableImage
                                images={product.images!}
                                alt={product.name}
                            />
                        ) : (
                            <div className="h-10 w-10 shrink-0 overflow-hidden rounded border bg-muted">
                                <div className="flex h-full items-center justify-center">
                                    <PackageOpen className="h-4 w-4 text-muted-foreground opacity-50" />
                                    </div>
                                </div>
                            )}
                            <div
                                className="max-w-[200px] truncate font-medium"
                                title={product.name}
                            >
                                {product.name}
                            </div>
                        </div>
                    );
                },
            },
            {
                accessorKey: 'category_id',
                header: 'Category',
                cell: ({ row }) => {
                    const product = row.original;
                    const cat = categories.find(
                        (c) => c.id === product.category_id,
                    );
                    return (
                        <div className="flex items-center">
                            <Badge
                                variant="secondary"
                                className="flex items-center gap-1.5 bg-secondary/50 font-normal text-secondary-foreground"
                            >
                                <Tag className="h-3 w-3 opacity-70" />
                                {cat?.name || 'Uncategorized'}
                            </Badge>
                        </div>
                    );
                },
            },
            {
                accessorKey: 'base_price',
                header: () => <div className="text-right">Price</div>,
                cell: ({ row }) => (
                    <div className="text-right font-semibold text-primary">
                        <span className="mr-1 text-xs font-normal text-muted-foreground">
                            Rp
                        </span>
                        {Number(row.original.base_price).toLocaleString('id-ID', {
                            maximumFractionDigits: 0,
                        })}
                    </div>
                ),
            },
            {
                accessorKey: 'stock',
                header: () => <div className="text-right">Stock</div>,
                cell: ({ row }) => {
                    const stock = row.original.stock;
                    let stockColor = 'text-emerald-600';
                    let Icon = Package;

                    if (stock === 0) {
                        stockColor = 'text-destructive';
                        Icon = AlertTriangle;
                    } else if (stock < 10) {
                        stockColor = 'text-amber-600';
                    }

                    return (
                        <div
                            className={`flex items-center justify-end gap-1.5 font-medium ${stockColor}`}
                        >
                            <Icon className="h-3.5 w-3.5" />
                            <span>{stock}</span>
                        </div>
                    );
                },
            },
            {
                accessorKey: 'status',
                header: () => <div className="text-center">Status</div>,
                cell: ({ row }) => {
                    const status = row.original.status;
                    const isSoldOut = status === 'active' && row.original.stock <= 0;
                    return (
                        <div className="flex justify-center">
                            {status === 'active' && !isSoldOut && (
                                <Badge className="gap-1 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20 shadow-none">
                                    <CheckCircle2 className="h-3 w-3" />
                                    Active
                                </Badge>
                            )}
                            {isSoldOut && (
                                <Badge
                                    variant="outline"
                                    className="gap-1 bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-amber-500/20 shadow-none"
                                >
                                    <Clock className="h-3 w-3" />
                                    Sold Out
                                </Badge>
                            )}
                            {status === 'archived' && (
                                <Badge
                                    variant="outline"
                                    className="gap-1 bg-slate-500/10 text-slate-600 hover:bg-slate-500/20 border-slate-500/20 shadow-none"
                                >
                                    <Archive className="h-3 w-3" />
                                    Archived
                                </Badge>
                            )}
                        </div>
                    );
                },
            },
            {
                id: 'actions',
                header: () => <div className="text-right">Actions</div>,
                cell: ({ row }) => {
                    const product = row.original;
                    const isToggling = togglingId === product.id;
                    return (
                        <div className="text-right">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        disabled={isToggling}
                                    >
                                        {isToggling ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <MoreHorizontal className="h-4 w-4" />
                                        )}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>
                                        Actions
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        disabled={isToggling}
                                        onClick={() =>
                                            handleToggleStatus(
                                                product,
                                                product.status,
                                            )
                                        }
                                    >
                                        {isToggling ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />{' '}
                                                Updating…
                                            </>
                                        ) : product.status === 'active' ? (
                                            <>
                                                <X className="mr-2 h-4 w-4" />{' '}
                                                Mark as Sold Out
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle2 className="mr-2 h-4 w-4" />{' '}
                                                Mark as Active
                                            </>
                                        )}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => openEditDialog(product)}
                                    >
                                        <Edit2 className="mr-2 h-4 w-4" /> Edit
                                        Product
                                    </DropdownMenuItem>
                                    {product.status === 'archived' ? (
                                        <DropdownMenuItem
                                            onClick={() => handleRestoreProduct(product)}
                                            className="text-emerald-600"
                                            disabled={isRestoring}
                                        >
                                            <ArchiveRestore className="mr-2 h-4 w-4" />{' '}
                                            Restore & Activate
                                        </DropdownMenuItem>
                                    ) : (
                                        <DropdownMenuItem
                                            onClick={() => openDeleteDialog(product)}
                                            className="text-destructive"
                                            disabled={isDeleting}
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />{' '}
                                            Delete / Archive
                                        </DropdownMenuItem>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    );
                },
            },
    ];

    return (
        <>
            <Head title="Product Management" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4 md:p-6">
                <PageHeader
                    title="Product Management"
                    description="Manage inventory, categories, pricing, and stock"
                    actionLabel="Add Product"
                    onAction={openCreateDialog}
                />

                <SearchFilters
                    searchValue={searchTerm}
                    onSearchChange={setSearchTerm}
                    searchPlaceholder="Search by name..."
                    filters={filters}
                    hasActiveFilters={hasActiveFilters}
                    onClearFilters={handleClearFilters}
                />

                <DataTable
                    columns={columns}
                    data={filteredProducts}
                    emptyTitle="No products found"
                    emptyDescription="We couldn't find anything matching your filters."
                    action={
                        hasActiveFilters ? (
                            <Button variant="link" onClick={handleClearFilters}>
                                Clear all filters
                            </Button>
                        ) : undefined
                    }
                    pagination={{
                        total: products.total,
                        label: 'products',
                    }}
                />
            </div>

            {/* Create/Edit Product Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {selectedProduct
                                ? 'Edit Product'
                                : 'Add New Product'}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedProduct
                                ? 'Update product details and manage images.'
                                : 'Add a new product to your inventory. You can upload up to 5 images.'}
                        </DialogDescription>
                    </DialogHeader>

                    {/* The massive form has been component-ized! */}
                    <ProductForm
                        product={selectedProduct}
                        categories={categories}
                        onSuccess={() => setDialogOpen(false)}
                        onCancel={() => setDialogOpen(false)}
                    />
                </DialogContent>
            </Dialog>

            <ConfirmationDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                title="Delete Product"
                description={
                    <>
                        Are you sure you want to delete{' '}
                        <strong>{selectedProduct?.name}</strong>? This will
                        archive the product to preserve order history.
                    </>
                }
                confirmText="Archive Product"
                onConfirm={handleDeleteProduct}
                isProcessing={isDeleting}
            />
        </>
    );
}

Products.layout = (page: React.ReactNode) => (
    <AdminLayout breadcrumbs={breadcrumbs}>{page}</AdminLayout>
);
