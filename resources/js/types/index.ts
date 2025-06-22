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
    url: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

type FlashProps = {
    success?: string;
    error?: string;
};

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    [key: string]: unknown;
    flash: FlashProps;
}

export type Role = {
    id: number;
    name: 'admin' | 'kasir' | 'owner'; // atau cukup string
};

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    roles: Role[];
    [key: string]: unknown; // This allows for additional properties...
}

export interface Customer {
    id: number;
    name: string;
    phone: string;
    created_at: string;
    updated_at: string;
}

export interface Category {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
}

export interface Product {
    id: number;
    category: Category;
    category_id: number;
    name: string;
    price: number;
    stock: number;
    image: string;
    created_at: string;
    updated_at: string;
}

export interface Transaction {
    id: number;
    user_id: number;
    customer: string;
    total_price: number;
    payment_method: string;
    status: string;
    user: User;
    transaction_details: TransactionDetail[];
    created_at: string;
    updated_at: string;
}

export interface TransactionDetail {
    transaction_id: number;
    product_id: number;
    product: Product;
    price: number;
    qty: number;
    subtotal: number;
    created_at: string;
    updated_at: string;
}

export interface Supplier {
    id: number;
    name: string;
    phone: string;
    created_at: string;
    updated_at: string;
}

export interface Purchase {
    id: number;
    supplier_id: number;
    product_id: number;
    qty: number;
    price: number;
    subtotal: number;
    supplier: Supplier;
    product: Product;
    created_at: string;
    updated_at: string;
}

export type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

export type PaginatedData<T> = {
    current_page: number;
    data: T[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: PaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
};
