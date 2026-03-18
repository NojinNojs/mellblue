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
import { Edit2, FolderTree, MoreHorizontal, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

// Generic Components
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { DataTable } from '@/components/ui/data-table';
import { PageHeader } from '@/components/ui/page-header';
import { SearchFilters } from '@/components/ui/search-filters';

// Features
import {
    CategoryForm,
    type Category,
} from '@/components/admin/categories/category-form';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Dashboard', href: '/admin' },
    { title: 'Categories', href: '/admin/categories' },
];

interface PaginatedCategories {
    data: Category[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface CategoriesPageProps {
    categories: PaginatedCategories;
}

export default function Categories({ categories }: CategoriesPageProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(
        null,
    );

    // Client-side filtering
    const filteredCategories = useMemo(() => {
        return categories.data.filter((category) => {
            return (
                searchTerm === '' ||
                category.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        });
    }, [categories.data, searchTerm]);

    const handleClearFilters = () => {
        setSearchTerm('');
    };

    const hasActiveFilters = searchTerm !== '';

    const handleDeleteCategory = () => {
        if (!selectedCategory) return;
        setIsDeleting(true);
        router.delete(`/admin/categories/${selectedCategory.id}`, {
            onSuccess: () => {
                toast.success('Category deleted successfully');
                setDeleteDialogOpen(false);
                setSelectedCategory(null);
                setIsDeleting(false);
            },
            onError: () => {
                toast.error('Failed to delete category');
                setIsDeleting(false);
            },
        });
    };

    const openCreateDialog = () => {
        setSelectedCategory(null);
        setDialogOpen(true);
    };

    const openEditDialog = (category: Category) => {
        setSelectedCategory(category);
        setDialogOpen(true);
    };

    const openDeleteDialog = (category: Category) => {
        setSelectedCategory(category);
        setDeleteDialogOpen(true);
    };

    const columns: ColumnDef<Category>[] = useMemo(
        () => [
            {
                accessorKey: 'name',
                header: 'Category',
                cell: ({ row }) => {
                    const category = row.original;
                    return (
                        <div className="flex items-center gap-3">
                            <FolderTree className="h-6 w-6 text-muted-foreground" />
                            <span className="font-medium">{category.name}</span>
                        </div>
                    );
                },
            },
            {
                accessorKey: 'slug',
                header: 'Slug',
                cell: ({ row }) => (
                    <span className="text-muted-foreground">
                        {row.original.slug}
                    </span>
                ),
            },
            {
                accessorKey: 'products_count',
                header: 'Products Count',
                cell: ({ row }) => (
                    <span className="text-muted-foreground">
                        {row.original.products_count}
                    </span>
                ),
            },
            {
                accessorKey: 'created_at',
                header: 'Created At',
                cell: ({ row }) => {
                    const date = row.original.created_at;
                    if (!date) return '-';
                    return (
                        <span className="text-muted-foreground">
                            {new Date(date).toLocaleDateString()}
                        </span>
                    );
                },
            },
            {
                id: 'actions',
                header: () => <div className="text-right">Actions</div>,
                cell: ({ row }) => {
                    const category = row.original;
                    return (
                        <div className="text-right">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                    >
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>
                                        Actions
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={() => openEditDialog(category)}
                                    >
                                        <Edit2 className="mr-2 h-4 w-4" /> Edit
                                        Category
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() =>
                                            openDeleteDialog(category)
                                        }
                                        className="text-destructive"
                                        disabled={
                                            (category.products_count ?? 0) > 0
                                        }
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />{' '}
                                        Delete Category
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    );
                },
            },
        ],
        [],
    );

    return (
        <>
            <Head title="Categories" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4 md:p-6">
                <PageHeader
                    title="Category Management"
                    description="Manage product categories"
                    actionLabel="Create Category"
                    onAction={openCreateDialog}
                />

                <SearchFilters
                    searchValue={searchTerm}
                    onSearchChange={setSearchTerm}
                    searchPlaceholder="Search by category name..."
                    hasActiveFilters={hasActiveFilters}
                    onClearFilters={handleClearFilters}
                />

                <DataTable
                    columns={columns}
                    data={filteredCategories}
                    emptyTitle="No categories found"
                    emptyDescription="We couldn't find any categories matching your filters."
                    action={
                        hasActiveFilters ? (
                            <Button variant="link" onClick={handleClearFilters}>
                                Clear all filters
                            </Button>
                        ) : undefined
                    }
                    pagination={{
                        total: categories.total,
                        label: 'categories',
                    }}
                />
            </div>

            {/* Create/Edit Category Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {selectedCategory
                                ? 'Edit Category'
                                : 'Create New Category'}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedCategory
                                ? 'Update category information.'
                                : 'Add a new product category.'}
                        </DialogDescription>
                    </DialogHeader>

                    <CategoryForm
                        category={selectedCategory}
                        onSuccess={() => {
                            setDialogOpen(false);
                            toast.success(
                                `Category ${selectedCategory ? 'updated' : 'created'} successfully`,
                            );
                        }}
                        onCancel={() => setDialogOpen(false)}
                    />
                </DialogContent>
            </Dialog>

            <ConfirmationDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                title="Delete Category"
                description={
                    <>
                        Are you sure you want to delete{' '}
                        <strong>{selectedCategory?.name}</strong>? This action
                        cannot be undone.
                    </>
                }
                confirmText="Delete Category"
                onConfirm={handleDeleteCategory}
                isProcessing={isDeleting}
            />
        </>
    );
}

Categories.layout = (page: React.ReactNode) => (
    <AdminLayout breadcrumbs={breadcrumbs}>{page}</AdminLayout>
);
