import { ProductFilters } from '@/components/sections/products/product-filters';
import { ProductGrid } from '@/components/sections/products/product-grid';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import UserLayout from '@/layouts/user-layout';
import { formatCurrency } from '@/lib/format';
import { type Product } from '@/types';
import { Head } from '@inertiajs/react';
import { LayoutGrid, List, PackageOpen, SlidersHorizontal, X } from 'lucide-react';
import { useMemo, useState } from 'react';

interface ProductsPageProps {
    products: { data: Product[] };
}

const SORT_LABELS: Record<string, string> = {
    newest: 'Terbaru',
    price_asc: 'Harga: Murah ke Mahal',
    price_desc: 'Harga: Mahal ke Murah',
    name_asc: 'Nama: A–Z',
};

export default function Products({ products }: ProductsPageProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [sortOption, setSortOption] = useState('newest');
    const [showSoldOut, setShowSoldOut] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [currentPage, setCurrentPage] = useState(1);
    const perPage = 12;

    const filteredAndSortedProducts = useMemo(() => {
        const filtered = products.data.filter((product) => {
            const matchesSearch =
                searchQuery === '' ||
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.description?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory =
                categoryFilter === 'all' || product.category === categoryFilter;
            const matchesAvailability =
                showSoldOut || (product.status === 'active' && product.available_stock > 0);
            return matchesSearch && matchesCategory && matchesAvailability;
        });

        return [...filtered].sort((a, b) => {
            switch (sortOption) {
                case 'price_asc':
                    return a.base_price - b.base_price;
                case 'price_desc':
                    return b.base_price - a.base_price;
                case 'name_asc':
                    return a.name.localeCompare(b.name);
                default:
                    return (
                        new Date(b.created_at || 0).getTime() -
                        new Date(a.created_at || 0).getTime()
                    );
            }
        });
    }, [products.data, searchQuery, categoryFilter, sortOption, showSoldOut]);

    const adjustedCurrentPage = useMemo(() => {
        const maxPage = Math.ceil(filteredAndSortedProducts.length / perPage) || 1;
        return currentPage > maxPage ? 1 : currentPage;
    }, [filteredAndSortedProducts.length, currentPage]);

    const paginatedProducts = useMemo(() => {
        const start = (adjustedCurrentPage - 1) * perPage;
        return filteredAndSortedProducts.slice(start, start + perPage);
    }, [filteredAndSortedProducts, adjustedCurrentPage]);

    const totalPages = Math.ceil(filteredAndSortedProducts.length / perPage);
    const total = filteredAndSortedProducts.length;
    const from = total > 0 ? (adjustedCurrentPage - 1) * perPage + 1 : 0;
    const to = Math.min(adjustedCurrentPage * perPage, total);

    const handleClearFilters = () => {
        setSearchQuery('');
        setCategoryFilter('all');
        setSortOption('newest');
        setShowSoldOut(false);
        setCurrentPage(1);
    };

    const hasActiveFilters =
        searchQuery !== '' ||
        categoryFilter !== 'all' ||
        sortOption !== 'newest' ||
        showSoldOut;

    // Active filter chips
    const activeChips: { label: string; onRemove: () => void }[] = [];
    if (searchQuery)
        activeChips.push({ label: `"${searchQuery}"`, onRemove: () => setSearchQuery('') });
    if (categoryFilter !== 'all')
        activeChips.push({ label: categoryFilter, onRemove: () => setCategoryFilter('all') });
    if (sortOption !== 'newest')
        activeChips.push({ label: SORT_LABELS[sortOption], onRemove: () => setSortOption('newest') });
    if (showSoldOut)
        activeChips.push({ label: 'Tampilkan yang habis', onRemove: () => setShowSoldOut(false) });

    return (
        <UserLayout>
            <Head title="Menu Kami" />

            <div className="container mx-auto px-4 py-8 sm:py-12">
                {/* Header */}
                <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                            Produk Kami
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {total > 0
                                ? `Menampilkan ${from}–${to} dari ${total} produk`
                                : 'Produk tidak ditemukan'}
                        </p>
                    </div>

                    {/* View toggle */}
                    <div className="flex items-center gap-1 self-start rounded-lg border bg-background p-1 shadow-sm sm:self-auto">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                                viewMode === 'grid'
                                    ? 'bg-primary text-primary-foreground shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            <LayoutGrid className="h-3.5 w-3.5" />
                            Grid
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                                viewMode === 'list'
                                    ? 'bg-primary text-primary-foreground shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            <List className="h-3.5 w-3.5" />
                            List
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="mb-4">
                    <ProductFilters
                        searchQuery={searchQuery}
                        onSearchChange={(v) => { setSearchQuery(v); setCurrentPage(1); }}
                        categoryFilter={categoryFilter}
                        onCategoryChange={(v) => { setCategoryFilter(v); setCurrentPage(1); }}
                        sortOption={sortOption}
                        onSortChange={(v) => { setSortOption(v); setCurrentPage(1); }}
                        showSoldOut={showSoldOut}
                        onShowSoldOutChange={(v) => { setShowSoldOut(v as boolean); setCurrentPage(1); }}
                        onClearFilters={handleClearFilters}
                        hasActiveFilters={hasActiveFilters}
                    />
                </div>

                {/* Active filter chips */}
                {activeChips.length > 0 && (
                    <div className="mb-5 flex flex-wrap items-center gap-2">
                        <span className="flex items-center gap-1 text-xs text-brand-blue-dark font-semibold">
                            <SlidersHorizontal className="h-3 w-3" />
                            Filter aktif:
                        </span>
                        {activeChips.map((chip) => (
                            <button
                                key={chip.label}
                                onClick={chip.onRemove}
                                className="flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
                            >
                                {chip.label}
                                <X className="h-3 w-3 text-muted-foreground" />
                            </button>
                        ))}
                        <button
                            onClick={handleClearFilters}
                            className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
                        >
                            Hapus semua
                        </button>
                    </div>
                )}

                {/* Product Grid or List */}
                <div className="mb-10">
                    {paginatedProducts.length === 0 ? (
                        <div className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12">
                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                                <PackageOpen className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold">Yah, Belum Ketemu Nih</h3>
                            <p className="mt-1 text-center text-sm text-muted-foreground">
                                Produk yang kamu cari belum ada atau coba ganti kata kuncinya ya.
                            </p>
                            {hasActiveFilters && (
                                <button
                                    onClick={handleClearFilters}
                                    className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
                                >
                                    Hapus filter
                                </button>
                            )}
                        </div>
                    ) : viewMode === 'grid' ? (
                        <ProductGrid products={paginatedProducts} isLoading={false} />
                    ) : (
                        /* List view */
                        <div className="flex flex-col gap-3">
                            {paginatedProducts.map((product) => {
                                const img = product.images?.[0]?.url;
                                const isAvailable = product.status === 'active';
                                return (
                                    <a
                                        key={product.id}
                                        href={`/products/${product.public_id || product.slug}`}
                                        className="group flex items-center gap-4 rounded-2xl border bg-card p-3 shadow-sm transition-all hover:border-primary/30 hover:shadow-md"
                                    >
                                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border bg-muted">
                                            {img ? (
                                                <img
                                                    src={img}
                                                    alt={product.name}
                                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center">
                                                    <PackageOpen className="h-6 w-6 text-muted-foreground" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-1 flex-col gap-0.5 min-w-0">
                                            {product.category && (
                                                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                                    {product.category}
                                                </span>
                                            )}
                                            <p className="truncate text-sm font-bold text-foreground group-hover:text-primary">
                                                {product.name}
                                            </p>
                                            <span
                                                className={`text-xs font-medium ${
                                                    isAvailable && product.available_stock > 0
                                                        ? 'text-green-600'
                                                        : 'text-red-500'
                                                }`}
                                            >
                                                {isAvailable && product.available_stock > 0
                                                    ? `${product.available_stock} tersedia`
                                                    : 'Habis'}
                                            </span>
                                        </div>
                                        <div className="shrink-0 text-right">
                                            <p className="text-base font-bold tabular-nums">
                                                {formatCurrency(product.base_price)}
                                            </p>
                                        </div>
                                    </a>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() =>
                                        adjustedCurrentPage > 1 &&
                                        setCurrentPage(adjustedCurrentPage - 1)
                                    }
                                    className={
                                        adjustedCurrentPage === 1
                                            ? 'pointer-events-none opacity-50'
                                            : 'cursor-pointer'
                                    }
                                />
                            </PaginationItem>
                            {Array.from(
                                { length: Math.min(totalPages, 5) },
                                (_, i) => {
                                    let pageNum: number;
                                    if (totalPages <= 5) pageNum = i + 1;
                                    else if (adjustedCurrentPage <= 3) pageNum = i + 1;
                                    else if (adjustedCurrentPage >= totalPages - 2)
                                        pageNum = totalPages - 4 + i;
                                    else pageNum = adjustedCurrentPage - 2 + i;
                                    return (
                                        <PaginationItem key={pageNum}>
                                            <PaginationLink
                                                onClick={() => setCurrentPage(pageNum)}
                                                isActive={adjustedCurrentPage === pageNum}
                                                className="cursor-pointer"
                                            >
                                                {pageNum}
                                            </PaginationLink>
                                        </PaginationItem>
                                    );
                                },
                            )}
                            <PaginationItem>
                                <PaginationNext
                                    onClick={() =>
                                        adjustedCurrentPage < totalPages &&
                                        setCurrentPage(adjustedCurrentPage + 1)
                                    }
                                    className={
                                        adjustedCurrentPage === totalPages
                                            ? 'pointer-events-none opacity-50'
                                            : 'cursor-pointer'
                                    }
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                )}
            </div>
        </UserLayout>
    );
}
