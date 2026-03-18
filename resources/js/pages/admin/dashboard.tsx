import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import * as admin from '@/routes/admin';
import { type BreadcrumbItem, type Product } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowRight,
    CheckCircle2,
    DollarSign,
    Package,
    PackageOpen,
    ShoppingCart,
    Sparkles,
    Users,
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin Dashboard',
        href: admin.dashboard().url,
    },
];

interface Order {
    id: number;
    order_number: string;
    status: string;
    total_amount: number;
    created_at: string;
    user: {
        name: string;
    } | null;
}

interface AdminDashboardProps {
    stats: {
        total_users: number;
        total_customers: number;
        total_products: number;
        available_products: number;
        total_orders: number;
        pending_orders: number;
        completed_orders: number;
        total_revenue: number;
    };
    recentOrders: Order[];
    recentProducts: Product[];
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
};

const formatPrice = (price: number) => {
    return `Rp ${Math.round(price).toLocaleString('id-ID').replace(/,/g, '.')}`;
};

export default function AdminDashboard({
    stats,
    recentOrders,
    recentProducts,
}: AdminDashboardProps) {
    const statCards = [
        {
            title: 'Total Users',
            value: stats.total_users,
            icon: Users,
            description: `${stats.total_customers} customers`,
            color: 'text-blue-600',
            bgColor: 'bg-blue-500/10',
            iconBg: 'bg-blue-500/20',
        },
        {
            title: 'Total Products',
            value: stats.total_products,
            icon: PackageOpen,
            description: `${stats.available_products} active`,
            color: 'text-emerald-600',
            bgColor: 'bg-emerald-500/10',
            iconBg: 'bg-emerald-500/20',
        },
        {
            title: 'Total Orders',
            value: stats.total_orders,
            icon: ShoppingCart,
            description: `${stats.completed_orders} completed`,
            color: 'text-violet-600',
            bgColor: 'bg-violet-500/10',
            iconBg: 'bg-violet-500/20',
        },
        {
            title: 'Revenue',
            value: formatPrice(stats.total_revenue || 0),
            icon: DollarSign,
            description: 'From completed orders',
            color: 'text-amber-600',
            bgColor: 'bg-amber-500/10',
            iconBg: 'bg-amber-500/20 shadow-inner',
        },
    ];

    const getStatusBadge = (status: string) => {
        const variants: Record<string, string> = {
            pending_payment: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            waiting_confirmation: 'bg-orange-100 text-orange-800 border-orange-200',
            paid: 'bg-blue-100 text-blue-800 border-blue-200',
            processing: 'bg-indigo-100 text-indigo-800 border-indigo-200',
            shipped: 'bg-cyan-100 text-cyan-800 border-cyan-200',
            completed: 'bg-green-100 text-green-800 border-green-200',
            cancelled: 'bg-red-100 text-red-800 border-red-200',
            payment_rejected: 'bg-red-200 text-red-900 border-red-300',
        };
        return (
            <Badge
                variant="outline"
                className={`${variants[status] || 'bg-gray-100 text-gray-800'} text-xs capitalize`}
            >
                {status.replace('_', ' ')}
            </Badge>
        );
    };

    const getProductStatusBadge = (status: string) => {
        const variants: Record<string, string> = {
            active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
            draft: 'bg-amber-50 text-amber-700 border-amber-200',
            archived: 'bg-slate-50 text-slate-700 border-slate-200',
        };
        return (
            <Badge
                variant="outline"
                className={`${variants[status] || 'bg-slate-50 text-slate-700'} border-opacity-50 text-[10px] font-semibold tracking-wider uppercase px-2 py-0`}
            >
                {status}
            </Badge>
        );
    };

    return (
        <>
            <Head title="Admin Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4 sm:gap-6 sm:p-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                    {statCards.map((card) => {
                        const Icon = card.icon;
                        return (
                            <Card
                                key={card.title}
                                className={`overflow-hidden border-0 ${card.bgColor} shadow-sm`}
                            >
                                <CardContent className="p-4 sm:p-5">
                                    <div className="flex items-center gap-3 sm:gap-4">
                                        <div
                                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:h-12 sm:w-12 ${card.iconBg}`}
                                        >
                                            <Icon
                                                className={`h-5 w-5 sm:h-6 sm:w-6 ${card.color}`}
                                            />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-xs font-medium text-muted-foreground sm:text-sm">
                                                {card.title}
                                            </p>
                                            <p className="truncate text-lg font-bold sm:text-2xl">
                                                {card.value}
                                            </p>
                                            <p className="hidden text-xs text-muted-foreground sm:block">
                                                {card.description}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Pending Orders Alert */}
                {stats.pending_orders > 0 ? (
                    <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50">
                        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-start gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-500/20">
                                    <AlertCircle className="h-5 w-5 text-orange-600" />
                                </div>
                                <div>
                                    <p className="font-semibold text-orange-800">
                                        {stats.pending_orders} Pending Order
                                        {stats.pending_orders > 1 ? 's' : ''}
                                    </p>
                                    <p className="text-sm text-orange-600">
                                        Review and verify these orders
                                    </p>
                                </div>
                            </div>
                            <Link href="/admin/orders">
                                <Button
                                    size="sm"
                                    className="w-full bg-orange-600 hover:bg-orange-700 sm:w-auto"
                                >
                                    Review Now
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
                        <CardContent className="flex items-center justify-center gap-2 p-4">
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                            <p className="font-medium text-green-800">
                                All orders are verified!
                            </p>
                        </CardContent>
                    </Card>
                )}

                {/* Main Content Grid */}
                <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
                    {/* Recent Orders */}
                    <Card className="flex flex-col">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 px-5 pt-5 pb-4">
                            <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/20">
                                    <ShoppingCart className="h-4 w-4 text-violet-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-base">
                                        Recent Orders
                                    </CardTitle>
                                    <CardDescription className="text-xs">
                                        Latest order activity
                                    </CardDescription>
                                </div>
                            </div>
                            <Link href="/admin/orders">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 px-2 text-xs"
                                >
                                    View All
                                    <ArrowRight className="ml-1 h-3 w-3" />
                                </Button>
                            </Link>
                        </CardHeader>
                        <CardContent className="flex-1 pb-4">
                            {recentOrders && recentOrders.length > 0 ? (
                                <div className="space-y-3">
                                    {recentOrders.map((order) => (
                                        <div
                                            key={order.id}
                                            className="flex items-center justify-between gap-3 rounded-lg border bg-card/50 p-3 transition-colors hover:bg-muted/50"
                                        >
                                            <div className="min-w-0 flex-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <p className="text-sm font-semibold">
                                                        #{order.order_number}
                                                    </p>
                                                    {getStatusBadge(
                                                        order.status,
                                                    )}
                                                </div>
                                                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                                                    {order.user?.name ||
                                                        'Unknown'}{' '}
                                                    •{' '}
                                                    {formatDate(
                                                        order.created_at,
                                                    )}
                                                </p>
                                            </div>
                                            <p className="shrink-0 text-sm font-bold">
                                                {formatPrice(
                                                    order.total_amount,
                                                )}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex h-full min-h-[200px] flex-col items-center justify-center py-6 text-center">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                                        <Package className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                    <p className="mt-3 text-sm text-muted-foreground">
                                        No orders yet
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Recent Products */}
                    <Card className="flex flex-col">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 px-5 pt-5 pb-4">
                            <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20">
                                    <PackageOpen className="h-4 w-4 text-emerald-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-base">
                                        Recent Products
                                    </CardTitle>
                                    <CardDescription className="text-xs">
                                        Latest inventory additions
                                    </CardDescription>
                                </div>
                            </div>
                            <Link href="/admin/products">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 px-2 text-xs"
                                >
                                    View All
                                    <ArrowRight className="ml-1 h-3 w-3" />
                                </Button>
                            </Link>
                        </CardHeader>
                        <CardContent className="flex-1 pb-4">
                            {recentProducts && recentProducts.length > 0 ? (
                                <div className="space-y-3">
                                    {recentProducts.map((product) => (
                                        <div
                                            key={product.id}
                                            className="group flex items-center gap-4 rounded-xl border border-transparent bg-muted/30 p-3 transition-all hover:border-emerald-200 hover:bg-emerald-50/30 hover:shadow-sm"
                                        >
                                            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border bg-white shadow-sm ring-offset-background transition-transform duration-300 group-hover:scale-105">
                                                {product.images &&
                                                product.images.length > 0 ? (
                                                    <img
                                                        src={product.images[0].url}
                                                        alt={product.name}
                                                        className="h-full w-full object-cover"
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            target.style.display = 'none';
                                                            const fallback = target.nextElementSibling as HTMLDivElement;
                                                            if (fallback) fallback.style.display = 'flex';
                                                        }}
                                                    />
                                                ) : null}
                                                <div className={`absolute inset-0 flex items-center justify-center bg-muted/50 ${product.images?.length ? 'hidden' : 'flex'}`}>
                                                    <PackageOpen className="h-5 w-5 text-muted-foreground/50" />
                                                </div>
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-bold text-foreground">
                                                    {product.name}
                                                </p>
                                                <div className="mt-1 flex items-center gap-3">
                                                    {getProductStatusBadge(
                                                        product.status,
                                                    )}
                                                    <span className="text-xs font-semibold tabular-nums text-muted-foreground">
                                                        {formatPrice(
                                                            product.base_price,
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex h-full min-h-[200px] flex-col items-center justify-center py-6 text-center">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                                        <PackageOpen className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                    <p className="mt-3 text-sm text-muted-foreground">
                                        No products added yet
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <Card>
                    <CardHeader className="px-5 pt-5 pb-3">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                                <Sparkles className="h-4 w-4 text-primary" />
                            </div>
                            <CardTitle className="text-base">
                                Quick Actions
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="pb-4">
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3">
                            <Link href="/admin/products" className="block">
                                <Button
                                    variant="outline"
                                    className="h-auto w-full justify-start gap-3 p-3 sm:p-4"
                                >
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20">
                                        <PackageOpen className="h-4 w-4 text-emerald-600" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-medium">
                                            Manage Products
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Add, edit, or remove products
                                        </p>
                                    </div>
                                </Button>
                            </Link>
                            <Link href="/admin/orders" className="block">
                                <Button
                                    variant="outline"
                                    className="h-auto w-full justify-start gap-3 p-3 sm:p-4"
                                >
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-500/20">
                                        <ShoppingCart className="h-4 w-4 text-violet-600" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-medium">
                                            View Orders
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Process customer orders
                                        </p>
                                    </div>
                                </Button>
                            </Link>
                            <Link href="/admin/users" className="block">
                                <Button
                                    variant="outline"
                                    className="h-auto w-full justify-start gap-3 p-3 sm:p-4"
                                >
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/20">
                                        <Users className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-medium">
                                            Manage Users
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Handle user accounts
                                        </p>
                                    </div>
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

AdminDashboard.layout = (page: React.ReactNode) => (
    <AdminLayout breadcrumbs={breadcrumbs}>{page}</AdminLayout>
);
