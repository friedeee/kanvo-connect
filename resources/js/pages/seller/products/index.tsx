import { Form, Head, Link } from '@inertiajs/react';
import {
    Camera,
    Eye,
    Minus,
    PackageOpen,
    Pencil,
    Plus,
    Search,
} from 'lucide-react';
import { useState } from 'react';
import Heading from '@/components/heading';
import { ProductImage } from '@/components/product-card';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatXof } from '@/lib/format';
import { cn } from '@/lib/utils';
import { show as preview } from '@/routes/catalog';
import { create, edit, index, stock } from '@/routes/seller/products';

type Row = {
    id: number;
    name: string;
    slug: string;
    price_xof: number;
    stock_quantity: number;
    lead_time_days: number | null;
    status: string;
    status_label: string;
    status_reason: string | null;
    image_url: string | null;
    images_count: number;
    colors: string[];
};

const FILTERS: { value: string; label: string; statuses: string[] }[] = [
    { value: 'all', label: 'Toutes', statuses: [] },
    { value: 'published', label: 'En ligne', statuses: ['published'] },
    {
        value: 'pending',
        label: 'En validation',
        statuses: ['pending_review'],
    },
    {
        value: 'todo',
        label: 'À reprendre',
        statuses: ['draft', 'rejected', 'disabled', 'withdrawn'],
    },
];

export default function SellerProducts({ products }: { products: Row[] }) {
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');

    const statuses = FILTERS.find((f) => f.value === filter)?.statuses ?? [];
    const visible = products.filter(
        (product) =>
            (statuses.length === 0 || statuses.includes(product.status)) &&
            product.name.toLowerCase().includes(search.trim().toLowerCase()),
    );
    const countFor = (value: string) => {
        const list = FILTERS.find((f) => f.value === value)?.statuses ?? [];

        return list.length === 0
            ? products.length
            : products.filter((p) => list.includes(p.status)).length;
    };

    return (
        <>
            <Head title="Mes produits" />
            <div className="space-y-6 p-4 lg:p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <Heading
                        title="Mes produits"
                        description="Le stock se met à jour tout de suite. Toute autre modification d’une pièce en ligne la renvoie en validation."
                    />
                    <Button asChild size="lg" className="rounded-full">
                        <Link href={create()}>
                            <Plus aria-hidden />
                            Ajouter une pièce
                        </Link>
                    </Button>
                </div>

                {products.length === 0 ? (
                    <Link
                        href={create()}
                        className="group grid place-items-center gap-3 rounded-3xl border-2 border-dashed p-14 text-center transition hover:border-primary hover:bg-primary/5"
                    >
                        <PackageOpen
                            className="size-12 text-muted-foreground transition group-hover:scale-110 group-hover:text-primary"
                            aria-hidden
                        />
                        <span className="font-display text-xl">
                            Ajoutez votre première pièce
                        </span>
                        <span className="text-sm text-muted-foreground">
                            Photos, prix, description : c’est rapide.
                        </span>
                    </Link>
                ) : (
                    <>
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div
                                className="flex gap-1 overflow-x-auto rounded-full bg-muted p-1"
                                role="tablist"
                                aria-label="Filtrer par statut"
                            >
                                {FILTERS.map((item) => (
                                    <button
                                        key={item.value}
                                        type="button"
                                        role="tab"
                                        aria-selected={filter === item.value}
                                        onClick={() => setFilter(item.value)}
                                        className={cn(
                                            'shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition',
                                            filter === item.value
                                                ? 'bg-background shadow-sm'
                                                : 'text-muted-foreground hover:text-foreground',
                                        )}
                                    >
                                        {item.label}
                                        <span className="ml-1.5 text-xs text-muted-foreground">
                                            {countFor(item.value)}
                                        </span>
                                    </button>
                                ))}
                            </div>
                            <label className="relative sm:w-64">
                                <span className="sr-only">
                                    Rechercher une pièce
                                </span>
                                <Search
                                    className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                                    aria-hidden
                                />
                                <Input
                                    type="search"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Rechercher…"
                                    className="rounded-full pl-9"
                                />
                            </label>
                        </div>

                        {visible.length === 0 ? (
                            <p className="rounded-2xl border border-dashed p-8 text-center text-muted-foreground">
                                Aucune pièce ne correspond.
                            </p>
                        ) : (
                            <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                {visible.map((product, i) => (
                                    <li
                                        key={product.id}
                                        className="animate-rise"
                                        style={{
                                            animationDelay: `${Math.min(i, 8) * 50}ms`,
                                        }}
                                    >
                                        <ProductRow product={product} />
                                    </li>
                                ))}
                            </ul>
                        )}
                    </>
                )}
            </div>
        </>
    );
}

function ProductRow({ product }: { product: Row }) {
    const [quantity, setQuantity] = useState(product.stock_quantity);
    const changed = quantity !== product.stock_quantity;

    return (
        <article className="group flex h-full flex-col overflow-hidden rounded-3xl border bg-card transition hover:shadow-xl hover:shadow-primary/10">
            <div className="flex gap-4 p-4">
                <Link
                    href={edit(product.id)}
                    className="relative size-24 shrink-0 overflow-hidden rounded-2xl ring-1 ring-border"
                >
                    <ProductImage
                        src={product.image_url}
                        alt={product.name}
                        seed={product.slug}
                        colors={product.colors}
                        className="transition duration-700 group-hover:scale-110"
                    />
                    <span className="absolute right-1 bottom-1 inline-flex items-center gap-0.5 rounded-full bg-black/60 px-1.5 py-0.5 text-[10px] text-white">
                        <Camera className="size-3" aria-hidden />
                        {product.images_count}
                    </span>
                </Link>
                <div className="min-w-0 flex-1 space-y-1">
                    <StatusBadge
                        status={product.status}
                        label={product.status_label}
                    />
                    <Link
                        href={edit(product.id)}
                        className="line-clamp-2 font-display text-lg leading-snug hover:text-primary"
                    >
                        {product.name}
                    </Link>
                    <p className="text-sm font-medium">
                        {formatXof(product.price_xof)}
                    </p>
                </div>
            </div>

            {product.status_reason && (
                <p className="mx-4 rounded-xl bg-red-500/10 px-3 py-2 text-xs text-red-700 dark:text-red-300">
                    Motif : {product.status_reason}
                </p>
            )}

            <div className="mt-auto flex items-center justify-between gap-2 border-t px-4 py-3">
                <Form
                    {...stock.form(product.id)}
                    options={{ preserveScroll: true }}
                    className="flex items-center gap-1.5"
                >
                    {({ processing }) => (
                        <>
                            <span className="mr-1 text-xs text-muted-foreground">
                                Stock
                            </span>
                            <button
                                type="button"
                                onClick={() =>
                                    setQuantity((q) => Math.max(0, q - 1))
                                }
                                className="grid size-8 place-items-center rounded-full border transition hover:bg-muted"
                                aria-label="Retirer une pièce du stock"
                            >
                                <Minus className="size-3.5" aria-hidden />
                            </button>
                            <input
                                name="stock_quantity"
                                type="number"
                                min={0}
                                inputMode="numeric"
                                value={quantity}
                                onChange={(e) =>
                                    setQuantity(
                                        Math.max(0, Number(e.target.value)),
                                    )
                                }
                                aria-label={`Stock de ${product.name}`}
                                className="h-8 w-12 [appearance:textfield] rounded-lg border bg-transparent text-center text-sm font-medium [&::-webkit-inner-spin-button]:appearance-none"
                            />
                            <button
                                type="button"
                                onClick={() => setQuantity((q) => q + 1)}
                                className="grid size-8 place-items-center rounded-full border transition hover:bg-muted"
                                aria-label="Ajouter une pièce au stock"
                            >
                                <Plus className="size-3.5" aria-hidden />
                            </button>
                            {product.lead_time_days && (
                                <input
                                    type="hidden"
                                    name="lead_time_days"
                                    value={product.lead_time_days}
                                />
                            )}
                            {changed && (
                                <Button
                                    size="sm"
                                    disabled={processing}
                                    className="ml-1 animate-rise rounded-full"
                                >
                                    OK
                                </Button>
                            )}
                        </>
                    )}
                </Form>
                <div className="flex gap-1">
                    <Button
                        asChild
                        size="icon"
                        variant="ghost"
                        className="rounded-full"
                    >
                        <Link
                            href={preview(product.slug)}
                            aria-label={`Aperçu de ${product.name}`}
                        >
                            <Eye aria-hidden />
                        </Link>
                    </Button>
                    <Button
                        asChild
                        size="icon"
                        variant="ghost"
                        className="rounded-full"
                    >
                        <Link
                            href={edit(product.id)}
                            aria-label={`Modifier ${product.name}`}
                        >
                            <Pencil aria-hidden />
                        </Link>
                    </Button>
                </div>
            </div>
        </article>
    );
}

SellerProducts.layout = {
    breadcrumbs: [{ title: 'Mes produits', href: index() }],
};
