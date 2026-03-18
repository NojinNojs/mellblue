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
import { Edit2, MoreHorizontal, Trash2, UserCircle2 } from 'lucide-react';
import { useMemo, useState } from 'react';
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
import { UserForm, type User } from '@/components/admin/users/user-form';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Dashboard', href: '/admin' },
    { title: 'Users', href: '/admin/users' },
];

interface PaginatedUsers {
    data: User[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface UsersPageProps {
    users: PaginatedUsers;
}

export default function Users({ users }: UsersPageProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');

    const [isDeleting, setIsDeleting] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    // Client-side filtering
    const filteredUsers = useMemo(() => {
        return users.data.filter((user) => {
            const matchesSearch =
                searchTerm === '' ||
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesRole =
                roleFilter === 'all' || user.role === roleFilter;

            return matchesSearch && matchesRole;
        });
    }, [users.data, searchTerm, roleFilter]);

    const handleClearFilters = () => {
        setSearchTerm('');
        setRoleFilter('all');
    };

    const hasActiveFilters = searchTerm !== '' || roleFilter !== 'all';

    const handleDeleteUser = () => {
        if (!selectedUser) return;
        setIsDeleting(true);
        router.delete(`/admin/users/${selectedUser.id}`, {
            onSuccess: () => {
                toast.success('User deleted successfully');
                setDeleteDialogOpen(false);
                setSelectedUser(null);
                setIsDeleting(false);
            },
            onError: () => {
                toast.error('Failed to delete user');
                setIsDeleting(false);
            },
        });
    };

    const openCreateDialog = () => {
        setSelectedUser(null);
        setDialogOpen(true);
    };

    const openEditDialog = (user: User) => {
        setSelectedUser(user);
        setDialogOpen(true);
    };

    const openDeleteDialog = (user: User) => {
        setSelectedUser(user);
        setDeleteDialogOpen(true);
    };

    const filters: FilterConfig[] = [
        {
            id: 'role',
            placeholder: 'Filter by role',
            value: roleFilter,
            onChange: setRoleFilter,
            options: [
                { label: 'All Roles', value: 'all' },
                { label: 'Admin', value: 'admin' },
                { label: 'Customer', value: 'customer' },
            ],
        },
    ];

    const columns: ColumnDef<User>[] = useMemo(
        () => [
            {
                accessorKey: 'name',
                header: 'User',
                cell: ({ row }) => {
                    const user = row.original;
                    return (
                        <div className="flex items-center gap-3">
                            <UserCircle2 className="h-8 w-8 text-muted-foreground" />
                            <span className="font-medium">{user.name}</span>
                        </div>
                    );
                },
            },
            {
                accessorKey: 'email',
                header: 'Email',
                cell: ({ row }) => (
                    <span className="text-muted-foreground">
                        {row.original.email}
                    </span>
                ),
            },
            {
                accessorKey: 'role',
                header: 'Role',
                cell: ({ row }) => {
                    const role = row.original.role;
                    return (
                        <Badge
                            variant="outline"
                            className={
                                role === 'admin'
                                    ? 'border-purple-200 bg-purple-50 text-purple-700'
                                    : 'border-blue-200 bg-blue-50 text-blue-700'
                            }
                        >
                            {role}
                        </Badge>
                    );
                },
            },
            {
                accessorKey: 'created_at',
                header: 'Created At',
                cell: ({ row }) => (
                    <span className="text-muted-foreground">
                        {new Date(row.original.created_at).toLocaleDateString()}
                    </span>
                ),
            },
            {
                id: 'actions',
                header: () => <div className="text-right">Actions</div>,
                cell: ({ row }) => {
                    const user = row.original;
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
                                        onClick={() => openEditDialog(user)}
                                    >
                                        <Edit2 className="mr-2 h-4 w-4" /> Edit
                                        User
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => openDeleteDialog(user)}
                                        className="text-destructive"
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />{' '}
                                        Delete User
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
            <Head title="User Management" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4 md:p-6">
                <PageHeader
                    title="User Management"
                    description="Manage users and their roles"
                    actionLabel="Create User"
                    onAction={openCreateDialog}
                />

                <SearchFilters
                    searchValue={searchTerm}
                    onSearchChange={setSearchTerm}
                    searchPlaceholder="Search by name or email..."
                    filters={filters}
                    hasActiveFilters={hasActiveFilters}
                    onClearFilters={handleClearFilters}
                />

                <DataTable
                    columns={columns}
                    data={filteredUsers}
                    emptyTitle="No users found"
                    emptyDescription="We couldn't find any users matching your filters."
                    action={
                        hasActiveFilters ? (
                            <Button variant="link" onClick={handleClearFilters}>
                                Clear all filters
                            </Button>
                        ) : undefined
                    }
                    pagination={{
                        total: users.total,
                        label: 'users',
                    }}
                />
            </div>

            {/* Create/Edit User Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {selectedUser ? 'Edit User' : 'Create New User'}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedUser
                                ? 'Update user information and role. Leave password empty to keep current password.'
                                : 'Add a new user to the system. They will be able to log in with the credentials provided.'}
                        </DialogDescription>
                    </DialogHeader>

                    <UserForm
                        user={selectedUser}
                        onSuccess={() => {
                            setDialogOpen(false);
                            toast.success(
                                `User ${selectedUser ? 'updated' : 'created'} successfully`,
                            );
                        }}
                        onCancel={() => setDialogOpen(false)}
                    />
                </DialogContent>
            </Dialog>

            <ConfirmationDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                title="Delete User"
                description={
                    <>
                        Are you sure you want to delete{' '}
                        <strong>{selectedUser?.name}</strong>? This action
                        cannot be undone.
                    </>
                }
                confirmText="Delete User"
                onConfirm={handleDeleteUser}
                isProcessing={isDeleting}
            />
        </>
    );
}

Users.layout = (page: React.ReactNode) => (
    <AdminLayout breadcrumbs={breadcrumbs}>{page}</AdminLayout>
);
