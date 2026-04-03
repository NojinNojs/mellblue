import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useState } from 'react';

interface ProductFiltersProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    categoryFilter: string;
    onCategoryChange: (value: string) => void;
    sortOption: string;
    onSortChange: (value: string) => void;
    showSoldOut: boolean;
    onShowSoldOutChange: (value: boolean) => void;
    onClearFilters: () => void;
    hasActiveFilters: boolean;
}

export function ProductFilters({
    searchQuery,
    onSearchChange,
    categoryFilter,
    onCategoryChange,
    sortOption,
    onSortChange,
    showSoldOut,
    onShowSoldOutChange,
    onClearFilters,
    hasActiveFilters,
}: ProductFiltersProps) {
    const [showFilters, setShowFilters] = useState(false);

    return (
        <div className="space-y-4 border-b pb-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                {/* Search Bar */}
                <div className="relative flex-1 md:max-w-sm">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Cari produk..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="h-10 pl-9"
                    />
                </div>

                {/* Filter Toggle (Mobile) */}
                <Button
                    variant="outline"
                    className="md:hidden"
                    onClick={() => setShowFilters(!showFilters)}
                >
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    Filter
                </Button>

                {/* Desktop Filters */}
                <div className="hidden flex-1 items-center justify-end gap-3 md:flex">
                    <Select
                        value={categoryFilter}
                        onValueChange={onCategoryChange}
                    >
                        <SelectTrigger className="h-10 w-[160px]">
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Kategori</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={sortOption} onValueChange={onSortChange}>
                        <SelectTrigger className="h-10 w-[160px]">
                            <SelectValue placeholder="Urutan" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">Terbaru</SelectItem>
                            <SelectItem value="price_asc">
                                Harga: Murah ke Mahal
                            </SelectItem>
                            <SelectItem value="price_desc">
                                Harga: Mahal ke Murah
                            </SelectItem>
                            <SelectItem value="name_asc">
                                Nama: A ke Z
                            </SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Show Sold Out Checkbox */}
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="show_sold_out"
                            checked={showSoldOut}
                            onCheckedChange={onShowSoldOutChange}
                        />
                        <label
                            htmlFor="show_sold_out"
                            className="cursor-pointer text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Tampilkan habis terjual
                        </label>
                    </div>

                    {/* Clear Filters Button */}
                    {hasActiveFilters && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClearFilters}
                            className="gap-1.5 text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-4 w-4" />
                            Hapus
                        </Button>
                    )}
                </div>
            </div>

            {/* Mobile Filters Expandable */}
            {showFilters && (
                <div className="grid grid-cols-1 gap-4 pt-4 md:hidden">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Kategori</label>
                        <Select
                            value={categoryFilter}
                            onValueChange={onCategoryChange}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Semua Kategori" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    Semua Kategori
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Urutkan</label>
                        <Select value={sortOption} onValueChange={onSortChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Urutkan" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="newest">Terbaru</SelectItem>
                                <SelectItem value="price_asc">
                                    Harga: Murah ke Mahal
                                </SelectItem>
                                <SelectItem value="price_desc">
                                    Harga: Mahal ke Murah
                                </SelectItem>
                                <SelectItem value="name_asc">
                                    Nama: A ke Z
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Show Sold Out Checkbox (Mobile) */}
                    <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="show_sold_out_mobile"
                                checked={showSoldOut}
                                onCheckedChange={onShowSoldOutChange}
                            />
                            <label
                                htmlFor="show_sold_out_mobile"
                                className="cursor-pointer text-sm leading-none font-medium"
                            >
                                Tampilkan produk habis terjual
                            </label>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
