import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
    disabled?: boolean;
    badge?: string;
    exact?: boolean;
}

export interface SharedData {
    appData: {
        name: string;
        phone: string;
        instagram: string;
        tiktok: string;
    };
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    flash: {
        success: string | null;
        error: string | null;
        warning: string | null;
        info: string | null;
    };
    [key: string]: unknown;
}

export interface User {
    id: number;
    public_id: string;
    name: string;
    email: string;
    phone: string | null;
    role: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    description: string | null;
}

export interface ProductVariant {
    id: number;
    name: string;
    price_adjustment: number;
    stock: number;
    status: 'active' | 'out_of_stock' | 'archived';
}

export interface Product {
    id: number;
    public_id: string;
    name: string;
    slug: string;
    description: string;
    base_price: number;
    available_stock: number;
    status: 'active' | 'sold_out' | 'archived';
    category?: string;
    created_at: string;
    updated_at?: string;
    images?: { id: number; url: string }[];
    variants?: ProductVariant[];
}

export interface OrderItem {
    id: number;
    product_name: string;
    variant_name: string | null;
    quantity: number;
    unit_price: number;
    subtotal: number;
    image: string | null;
    product_snapshot?: Record<string, unknown>;
}

export interface Payment {
    id: number;
    type: 'payment' | 'refund';
    method: string;
    proof_image_url: string | null;
    sender_account: string | null;
    amount: number;
    status: 'pending' | 'verified' | 'rejected';
    reject_reason: string | null;
    verified_at: string | null;
    verifier?: string;
    created_at?: string;
}

export interface Order {
    id: number;
    order_number: string;
    customer_id: number;
    order_date?: string;
    unique_code?: number;
    status:
        | 'pending'
        | 'pending_payment'
        | 'waiting_confirmation'
        | 'paid'
        | 'payment_rejected'
        | 'processing'
        | 'shipping'
        | 'completed'
        | 'cancelled';
    subtotal: number;
    shipping_cost: number;
    total: number;
    shipping_name: string;
    shipping_phone: string;
    shipping_address: string;
    shipping_city: string;
    shipping_method?: string | null;
    tracking_number?: string | null;
    payment_deadline: string;
    notes?: string | null;
    customer?: Partial<User>;
    items: OrderItem[];
    payment?: Partial<Payment> | null;
    latest_payment?: Partial<Payment> | null;
    created_at: string;
}
