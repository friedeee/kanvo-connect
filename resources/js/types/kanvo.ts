export type Option = { value: string; label: string };

export type CategoryOption = { id: number; name: string; slug?: string };

export type ProductCard = {
    id: number;
    slug: string;
    name: string;
    price_xof: number;
    sale_unit: string;
    is_available: boolean;
    lead_time_days: number | null;
    image_url: string | null;
    category: string;
    seller: { shop_name: string; slug: string };
};

export type SellerPublic = {
    shop_name: string;
    slug: string;
    craft: string;
    city: string;
    bio: string;
    member_since: number | null;
    products_count?: number;
};

export type ProductDetail = Omit<ProductCard, 'seller'> & {
    description: string;
    stock_quantity: number;
    length_cm: number | null;
    width_cm: number | null;
    colors: string[];
    materials: string | null;
    care_instructions: string | null;
    images: { id: number; url: string }[];
    seller: SellerPublic;
    status: string;
    status_label: string;
};

export type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

/** Collection paginée renvoyée par une API Resource Laravel. */
export type ResourcePage<T> = {
    data: T[];
    links: { prev: string | null; next: string | null };
    meta: {
        current_page: number;
        last_page: number;
        total: number;
        links: PaginationLink[];
    };
};

/** Paginateur Laravel sérialisé directement (sans API Resource). */
export type Paginator<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    total: number;
    links: PaginationLink[];
};

export type SellerSummary = {
    shop_name: string;
    slug: string;
    status: string;
} | null;
