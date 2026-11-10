import { Head, Link } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowRight,
    CheckCircle2,
    Clock,
    ExternalLink,
    FilePen,
    MapPin,
    Package,
    PackageOpen,
    Plus,
    Sparkles,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { AmbiancePhoto } from '@/components/ambiance-photo';
import { ProductImage } from '@/components/product-card';
import { Reveal } from '@/components/reveal';
import { StatusBadge } from '@/components/status-badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { WovenPattern } from '@/components/woven-pattern';
import { formatXof } from '@/lib/format';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes/seller';
import { create, edit, index } from '@/routes/seller/products';
import { show as sellerProfile } from '@/routes/sellers';

type ProductSummary = {
    id: number;
    name: string;
    slug: string;
    price_xof: number;
    stock_quantity: number;
    status: string;
    status_label: string;
    status_reason: string | null;
    colors: string[];
    image_url: string | null;
};

type Props = {
    seller: {
        shop_name: string;
        slug: string;
        craft: string;
        city: string;
        status: string;
        status_label: string;
        status_reason: string | null;
    };
    productCounts: Record<string, number>;
    stockInCatalog: number;
    recentProducts: ProductSummary[];
    toFix: ProductSummary[];
    lowStock: ProductSummary[];
};

const messages: Record<string, string> = {
    pending:
        'Votre boutique est en cours d’examen. Vous pourrez ajouter des produits dès sa validation.',
    rejected: 'Votre boutique n’a pas été acceptée.',
    suspended:
        'Votre boutique est suspendue : vos produits ne sont plus visibles dans le catalogue.',
};

function greeting(): string {
    return new Date().getHours() < 18 ? 'Bonjour' : 'Bonsoir';
}

export default function SellerDashboard({
    seller,
    productCounts,
    stockInCatalog,
    recentProducts,
    toFix,
    lowStock,
}: Props) {
    const approved = seller.status === 'approved';
    const count = (status: string) => productCounts[status] ?? 0;

    const stats: {
        label: string;
        value: number;
        icon: LucideIcon;
        tone: string;
    }[] = [
        {
            label: 'En ligne',
            value: count('published'),
            icon: CheckCircle2,
            tone: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
        },
        {
            label: 'En validation',
            value: count('pending_review'),
            icon: Clock,
            tone: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
        },
        {
            label: 'Brouillons',
            value: count('draft') + count('disabled'),
            icon: FilePen,
            tone: 'bg-primary/10 text-primary',
        },
        {
            label: 'Pièces en stock',
            value: stockInCatalog,
            icon: Package,
            tone: 'bg-gold/15 text-gold-foreground',
        },
    ];

    const todo = toFix.length + lowStock.length;

    return (
        <>
            <Head title="Espace vendeur" />
            <div className="space-y-8 p-4 lg:p-6">
                {/* ================= Bandeau ================= */}
                <section className="relative animate-rise overflow-hidden rounded-3xl bg-indigo-deep text-white shadow-xl shadow-primary/10">
                    <WovenPattern
                        seed={seller.slug}
                        strips={14}
                        className="absolute inset-0 animate-slow-zoom opacity-35"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-indigo-deep via-indigo-deep/90 to-indigo-deep/40" />
                    <div className="relative flex flex-col gap-6 p-6 sm:p-8 md:flex-row md:items-end md:justify-between">
                        <div className="flex items-center gap-5">
                            <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-gold font-display text-3xl text-ink shadow-lg sm:size-20 sm:text-4xl">
                                {seller.shop_name.charAt(0)}
                            </span>
                            <div>
                                <p className="text-sm text-white/70">
                                    {greeting()} !
                                </p>
                                <h1 className="font-display text-3xl leading-tight tracking-tight sm:text-4xl">
                                    {seller.shop_name}
                                </h1>
                                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/75">
                                    <span>{seller.craft}</span>
                                    <span className="inline-flex items-center gap-1">
                                        <MapPin
                                            className="size-3.5"
                                            aria-hidden
                                        />
                                        {seller.city}
                                    </span>
                                    <StatusBadge
                                        status={seller.status}
                                        label={seller.status_label}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {approved && (
                                <Link
                                    href={create()}
                                    className="group inline-flex h-11 items-center gap-2 rounded-full bg-gold px-5 text-sm font-medium text-ink shadow-lg transition hover:bg-white"
                                >
                                    <Plus
                                        className="size-4 transition group-hover:rotate-90"
                                        aria-hidden
                                    />
                                    Ajouter une pièce
                                </Link>
                            )}
                            <Link
                                href={sellerProfile(seller.slug)}
                                className="inline-flex h-11 items-center gap-2 rounded-full border border-white/30 px-5 text-sm font-medium transition hover:bg-white hover:text-ink"
                            >
                                <ExternalLink className="size-4" aria-hidden />
                                Ma page publique
                            </Link>
                        </div>
                    </div>
                </section>

                {!approved && (
                    <Alert>
                        <AlertTitle>{seller.status_label}</AlertTitle>
                        <AlertDescription>
                            <p>{messages[seller.status]}</p>
                            {seller.status_reason && (
                                <p>Motif : {seller.status_reason}</p>
                            )}
                        </AlertDescription>
                    </Alert>
                )}

                {approved && (
                    <>
                        {/* ================= Chiffres ================= */}
                        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                            {stats.map(
                                ({ label, value, icon: Icon, tone }, i) => (
                                    <Reveal
                                        key={label}
                                        delay={i * 80}
                                        className="rounded-2xl border bg-card p-5 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/5"
                                    >
                                        <span
                                            className={cn(
                                                'grid size-10 place-items-center rounded-xl',
                                                tone,
                                            )}
                                        >
                                            <Icon
                                                className="size-5"
                                                aria-hidden
                                            />
                                        </span>
                                        <p className="mt-4 font-display text-4xl tracking-tight">
                                            {value}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {label}
                                        </p>
                                    </Reveal>
                                ),
                            )}
                        </div>

                        <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
                            {/* ================= Dernières pièces ================= */}
                            <Reveal className="rounded-3xl border bg-card p-5 sm:p-6">
                                <div className="mb-5 flex items-center justify-between gap-3">
                                    <h2 className="font-display text-2xl">
                                        Mes dernières pièces
                                    </h2>
                                    <Link
                                        href={index()}
                                        className="group inline-flex items-center gap-1 text-sm font-medium text-primary"
                                    >
                                        Tout voir
                                        <ArrowRight
                                            className="size-4 transition group-hover:translate-x-1"
                                            aria-hidden
                                        />
                                    </Link>
                                </div>
                                {recentProducts.length > 0 ? (
                                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                                        {recentProducts.map((product) => (
                                            <Link
                                                key={product.id}
                                                href={edit(product.id)}
                                                className="group"
                                            >
                                                <div className="aspect-[4/5] overflow-hidden rounded-2xl ring-1 ring-border">
                                                    <ProductImage
                                                        src={product.image_url}
                                                        alt={product.name}
                                                        seed={product.slug}
                                                        colors={product.colors}
                                                        className="transition duration-700 group-hover:scale-105"
                                                    />
                                                </div>
                                                <p className="mt-2 line-clamp-1 text-sm font-medium group-hover:text-primary">
                                                    {product.name}
                                                </p>
                                                <div className="mt-1 flex flex-wrap items-center justify-between gap-1 text-xs text-muted-foreground">
                                                    {formatXof(
                                                        product.price_xof,
                                                    )}
                                                    <StatusBadge
                                                        status={product.status}
                                                        label={
                                                            product.status_label
                                                        }
                                                    />
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <Link
                                        href={create()}
                                        className="group grid place-items-center gap-3 rounded-2xl border-2 border-dashed p-10 text-center transition hover:border-primary hover:bg-primary/5"
                                    >
                                        <PackageOpen
                                            className="size-10 text-muted-foreground transition group-hover:scale-110 group-hover:text-primary"
                                            aria-hidden
                                        />
                                        <span className="font-medium">
                                            Ajoutez votre première pièce
                                        </span>
                                        <span className="max-w-sm text-sm text-muted-foreground">
                                            Quelques photos, un prix, une
                                            description : l’équipe Kanvô la
                                            valide et elle apparaît dans le
                                            catalogue.
                                        </span>
                                    </Link>
                                )}
                            </Reveal>

                            {/* ================= À faire ================= */}
                            <Reveal
                                delay={120}
                                className="rounded-3xl border bg-card p-5 sm:p-6"
                            >
                                <h2 className="mb-4 flex items-center gap-2 font-display text-2xl">
                                    À faire
                                    {todo > 0 && (
                                        <span className="grid size-6 place-items-center rounded-full bg-gold font-sans text-xs font-semibold text-ink">
                                            {todo}
                                        </span>
                                    )}
                                </h2>
                                {todo === 0 ? (
                                    <p className="flex items-center gap-3 rounded-2xl bg-emerald-500/10 p-4 text-sm text-emerald-800 dark:text-emerald-200">
                                        <Sparkles
                                            className="size-5 shrink-0"
                                            aria-hidden
                                        />
                                        Tout est en ordre. Bravo !
                                    </p>
                                ) : (
                                    <ul className="space-y-1">
                                        {toFix.map((product) => (
                                            <TodoItem
                                                key={`fix-${product.id}`}
                                                product={product}
                                                icon={
                                                    product.status ===
                                                    'rejected'
                                                        ? AlertTriangle
                                                        : FilePen
                                                }
                                                tone={
                                                    product.status ===
                                                    'rejected'
                                                        ? 'text-red-600 dark:text-red-400'
                                                        : 'text-primary'
                                                }
                                                text={
                                                    product.status ===
                                                    'rejected'
                                                        ? `Refusé : ${product.status_reason ?? 'à corriger'}`
                                                        : 'Brouillon à compléter et soumettre'
                                                }
                                            />
                                        ))}
                                        {lowStock.map((product) => (
                                            <TodoItem
                                                key={`stock-${product.id}`}
                                                product={product}
                                                icon={Package}
                                                tone="text-gold-foreground"
                                                text={
                                                    product.stock_quantity === 0
                                                        ? 'Épuisé : pensez à remettre du stock'
                                                        : `Plus que ${product.stock_quantity} en stock`
                                                }
                                            />
                                        ))}
                                    </ul>
                                )}
                            </Reveal>
                        </div>

                        {/* ================= Conseil ================= */}
                        <Reveal className="group relative overflow-hidden rounded-3xl bg-ink text-white">
                            <AmbiancePhoto
                                name="appliques"
                                small
                                className="absolute inset-0"
                                imgClassName="opacity-60 transition duration-[1500ms] group-hover:scale-105"
                            />
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-transparent" />
                            <div className="relative max-w-lg p-6 sm:p-8">
                                <p className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">
                                    Conseil
                                </p>
                                <p className="mt-2 font-display text-2xl leading-snug">
                                    Les pièces avec 3 photos ou plus, prises à
                                    la lumière du jour, attirent bien plus de
                                    clients.
                                </p>
                                <p className="mt-2 text-sm text-white/70">
                                    Montrez la pièce entière, un détail du
                                    motif, et la pièce portée ou pliée.
                                </p>
                            </div>
                        </Reveal>
                    </>
                )}
            </div>
        </>
    );
}

function TodoItem({
    product,
    icon: Icon,
    tone,
    text,
}: {
    product: ProductSummary;
    icon: LucideIcon;
    tone: string;
    text: string;
}) {
    return (
        <li>
            <Link
                href={edit(product.id)}
                className="group flex items-center gap-3 rounded-2xl p-2 transition hover:bg-muted"
            >
                <span className="size-12 shrink-0 overflow-hidden rounded-xl ring-1 ring-border">
                    <ProductImage
                        src={product.image_url}
                        alt=""
                        seed={product.slug}
                        colors={product.colors}
                    />
                </span>
                <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">
                        {product.name}
                    </span>
                    <span
                        className={cn('flex items-center gap-1 text-xs', tone)}
                    >
                        <Icon className="size-3.5 shrink-0" aria-hidden />
                        <span className="truncate">{text}</span>
                    </span>
                </span>
                <ArrowRight
                    className="size-4 shrink-0 text-muted-foreground transition group-hover:translate-x-1"
                    aria-hidden
                />
            </Link>
        </li>
    );
}

SellerDashboard.layout = {
    breadcrumbs: [{ title: 'Espace vendeur', href: dashboard() }],
};
