import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Search, X } from 'lucide-react';

export interface FilterOption {
    label: string;
    value: string;
}

export interface FilterConfig {
    id: string;
    placeholder: string;
    value: string;
    options: FilterOption[];
    onChange: (value: string) => void;
}

interface SearchFiltersProps {
    searchValue: string;
    onSearchChange: (value: string) => void;
    searchPlaceholder?: string;
    filters?: FilterConfig[];
    onClearFilters?: () => void;
    hasActiveFilters?: boolean;
}

export function SearchFilters({
    searchValue,
    onSearchChange,
    searchPlaceholder = 'Search...',
    filters = [],
    onClearFilters,
    hasActiveFilters = false,
}: SearchFiltersProps) {
    return (
        <div className="flex flex-col gap-4 rounded-lg border bg-card p-4 shadow-sm md:flex-row md:items-center">
            <div className="relative flex-1">
                <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder={searchPlaceholder}
                    value={searchValue}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="bg-background pl-9"
                />
            </div>
            
            {(filters.length > 0 || hasActiveFilters) && (
                <div className="flex flex-wrap items-center gap-3">
                    {filters.map((filter) => (
                        <Select
                            key={filter.id}
                            value={filter.value}
                            onValueChange={filter.onChange}
                        >
                            <SelectTrigger className="w-[140px] bg-background">
                                <SelectValue placeholder={filter.placeholder} />
                            </SelectTrigger>
                            <SelectContent>
                                {filter.options.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    ))}

                    {hasActiveFilters && onClearFilters && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClearFilters}
                            className="gap-1.5 text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-4 w-4" />
                            Clear
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}
