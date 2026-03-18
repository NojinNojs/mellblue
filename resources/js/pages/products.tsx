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
import { type Product } from '@/types';
import { Head } from '@inertiajs/react';
import { useMemo, useState } from 'react';

interface ProductsPageProps {
    products: { data: Product[] };
}

export default function Products({ products }: ProductsPageProps) {
    // Client-side filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [sortOption, setSortOption] = useState('newest');
    const [showSoldOut, setShowSoldOut] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const perPage = 12; // Products per page

    // Filter and sort
    const filteredAndSortedProducts = useMemo(() => {
        const filtered = products.data.filter((product) => {
            const matchesSearch =
                searchQuery === '' ||
                product.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                product.description
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase());

            const matchesCategory =
                categoryFilter === 'all' || product.category === categoryFilter;

            const matchesAvailability =
                showSoldOut || product.status === 'active';

            return matchesSearch && matchesCategory && matchesAvailability;
        });

        // Sort the results
        return [...filtered].sort((a, b) => {
            switch (sortOption) {
                case 'price_asc':
                    return a.base_price - b.base_price;
                case 'price_desc':
                    return b.base_price - a.base_price;
                case 'name_asc':
                    return a.name.localeCompare(b.name);
                case 'newest':
                default:
                    return (
                        new Date(b.created_at || 0).getTime() -
                        new Date(a.created_at || 0).getTime()
                    );
            }
        });
    }, [products.data, searchQuery, categoryFilter, sortOption, showSoldOut]);

    // Pagination
    const adjustedCurrentPage = useMemo(() => {
        const maxPage =
            Math.ceil(filteredAndSortedProducts.length / perPage) || 1;
        return currentPage > maxPage ? 1 : currentPage;
    }, [filteredAndSortedProducts.length, perPage, currentPage]);

    const paginatedProducts = useMemo(() => {
        const startIndex = (adjustedCurrentPage - 1) * perPage;
        const endIndex = startIndex + perPage;
        return filteredAndSortedProducts.slice(startIndex, endIndex);
    }, [filteredAndSortedProducts, adjustedCurrentPage, perPage]);

    const totalPages = Math.ceil(filteredAndSortedProducts.length / perPage);
    const from =
        filteredAndSortedProducts.length > 0
            ? (adjustedCurrentPage - 1) * perPage + 1
            : 0;
    const to = Math.min(
        adjustedCurrentPage * perPage,
        filteredAndSortedProducts.length,
    );

    const handleClearFilters = () => {
        setSearchQuery('');
        setCategoryFilter('all');
        setSortOption('newest');
        setShowSoldOut(false);
    };

    const hasActiveFilters =
        searchQuery !== '' ||
        categoryFilter !== 'all' ||
        sortOption !== 'newest' ||
        showSoldOut;

    return (
        <UserLayout>
            <Head title="Our Products" />

            <div className="container mx-auto px-4 py-8 sm:py-12">
                {/* Header */}
                <div className="mb-8 sm:mb-10">
                    <h1 className="mb-2 text-2xl font-bold tracking-tight text-foreground sm:mb-3 sm:text-3xl">
                        Our Products
                    </h1>
                    <p className="text-sm text-muted-foreground sm:text-base">
                        {filteredAndSortedProducts.length > 0
                            ? `Showing ${from}–${to} of ${filteredAndSortedProducts.length} items`
                            : 'No products found'}
                    </p>
                </div>

                {/* Filters */}
                <div className="mb-8 sm:mb-10">
                    <ProductFilters
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        categoryFilter={categoryFilter}
                        onCategoryChange={setCategoryFilter}
                        sortOption={sortOption}
                        onSortChange={setSortOption}
                        showSoldOut={showSoldOut}
                        onShowSoldOutChange={setShowSoldOut}
                        onClearFilters={handleClearFilters}
                        hasActiveFilters={hasActiveFilters}
                    />
                </div>

                {/* Product Grid */}
                <div className="mb-12">
                    <ProductGrid
                        products={paginatedProducts}
                        isLoading={false}
                    />
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
                                    let pageNum;
                                    if (totalPages <= 5) {
                                        pageNum = i + 1;
                                    } else if (adjustedCurrentPage <= 3) {
                                        pageNum = i + 1;
                                    } else if (
                                        adjustedCurrentPage >=
                                        totalPages - 2
                                    ) {
                                        pageNum = totalPages - 4 + i;
                                    } else {
                                        pageNum = adjustedCurrentPage - 2 + i;
                                    }
                                    return (
                                        <PaginationItem key={pageNum}>
                                            <PaginationLink
                                                onClick={() =>
                                                    setCurrentPage(pageNum)
                                                }
                                                isActive={
                                                    adjustedCurrentPage ===
                                                    pageNum
                                                }
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
