import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Clock,
    MessageCircle,
    PackageCheck,
    Ruler,
    ShieldCheck,
} from 'lucide-react';
import { useState } from 'react';
import { availabilityLabel, ProductImage } from '@/components/product-card';
import { colorHex } from '@/components/woven-pattern';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { formatDimensions, formatXof } from '@/lib/format';
import { cn } from '@/lib/utils';
import { whatsappUrl } from '@/lib/whatsapp';
import { index as catalog } from '@/routes/catalog';
import { show as sellerProfile } from '@/routes/sellers';
import type { ProductDetail } from '@/types/kanvo';

/**
 * Lien wa.me avec un message déjà rédigé : le client n'a plus qu'à appuyer sur « Envoyer ».
 */
function whatsappOrderUrl(number: string, product: ProductDetail): string {
    const intro = product.is_available
        ? 'Bonjour Kanvô ! Je souhaite commander cette pièce :'
        : 'Bonjour Kanvô ! Cette pièce m’intéresse, sera-t-elle de nouveau disponible ?';
    const message = [
        intro,
        `• ${product.name}`,
        `• ${formatXof(product.price_xof)} (${product.sale_unit.toLowerCase()})`,
        `• Atelier : ${product.seller.shop_name}`,
        typeof window !== 'undefined' ? window.location.href : '',
    ]
        .filter(Boolean)
        .join('\n');

    return whatsappUrl(number, message);
}

export default function Product({
    product,
    isPreview,
}: {
    product: ProductDetail;
    isPreview: boolean;
}) {
    const { whatsappNumber } = usePage().props;
    const [current, setCurrent] = useState(0);
    const image = product.images[current] ?? null;
    const dimensions = formatDimensions(product.length_cm, product.width_cm);

    const details: [string, string | null][] = [
        ['Catégorie', product.category],
        ['Unité de vente', product.sale_unit],
        ['Dimensions', dimensions],
        ['Matières déclarées', product.materials],
    ];

    const stockText =
        product.is_available && !product.lead_time_days
            ? `${product.stock_quantity} disponible${product.stock_quantity > 1 ? 's' : ''}`
            : null;

    return (
        <>
            <Head title={product.name} />

            <div className="mx-auto max-w-7xl px-5 py-8">
                <Link
                    href={catalog()}
                    className="group mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft
                        className="size-4 transition group-hover:-translate-x-1"
                        aria-hidden
                    />
                    Retour au catalogue
                </Link>

                {isPreview && (
                    <Alert className="mb-6">
                        <AlertDescription>
                            Aperçu : ce produit n’est pas visible dans le
                            catalogue (statut : {product.status_label}).
                        </AlertDescription>
                    </Alert>
                )}

                <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
                    <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
                        <div className="aspect-[4/5] animate-rise overflow-hidden rounded-[2rem] bg-muted shadow-xl ring-1 shadow-primary/10 ring-border/60">
                            <ProductImage
                                key={current}
                                src={image?.url ?? null}
                                alt={product.name}
                                seed={product.slug}
                                colors={product.colors}
                                badge
                                className="animate-rise"
                            />
                        </div>
                        {product.images.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto pb-1">
                                {product.images.map((item, index) => (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => setCurrent(index)}
                                        aria-label={`Photo ${index + 1}`}
                                        aria-pressed={index === current}
                                        className={cn(
                                            'size-20 shrink-0 overflow-hidden rounded-xl ring-2 transition',
                                            index === current
                                                ? 'ring-primary'
                                                : 'opacity-70 ring-transparent hover:opacity-100',
                                        )}
                                    >
                                        <img
                                            src={item.url}
                                            alt=""
                                            className="h-full w-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="animate-rise space-y-8 [animation-delay:120ms]">
                        <div>
                            <Link
                                href={sellerProfile(product.seller.slug)}
                                className="text-xs font-semibold tracking-[0.2em] text-gold-foreground uppercase hover:underline"
                            >
                                {product.seller.shop_name}
                            </Link>
                            <h1 className="mt-3 font-display text-4xl leading-tight tracking-tight sm:text-5xl">
                                {product.name}
                            </h1>
                            <p className="mt-5 flex items-baseline gap-2">
                                <span className="font-display text-3xl">
                                    {formatXof(product.price_xof)}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                    {product.sale_unit.toLowerCase()}
                                </span>
                            </p>
                            <p
                                className={cn(
                                    'mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm',
                                    product.is_available
                                        ? 'bg-primary/10 text-primary dark:bg-primary/15'
                                        : 'bg-muted text-muted-foreground',
                                )}
                            >
                                {product.lead_time_days ? (
                                    <Clock className="size-4" aria-hidden />
                                ) : (
                                    <PackageCheck
                                        className="size-4"
                                        aria-hidden
                                    />
                                )}
                                {availabilityLabel(product)}
                                {stockText && ` · ${stockText}`}
                            </p>
                        </div>

                        {product.colors.length > 0 && (
                            <div>
                                <p className="mb-3 text-sm font-medium">
                                    Couleurs
                                </p>
                                <ul className="flex flex-wrap gap-3">
                                    {product.colors.map((color) => (
                                        <li
                                            key={color}
                                            className="flex items-center gap-2 rounded-full border bg-card py-1 pr-3 pl-1 text-sm"
                                        >
                                            <span
                                                className="size-6 rounded-full ring-1 ring-black/10"
                                                style={{
                                                    background:
                                                        colorHex(color) ??
                                                        'conic-gradient(#26306b, #c9a03a, #b8322a, #2f6b45, #26306b)',
                                                }}
                                                aria-hidden
                                            />
                                            {color}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {whatsappNumber && !isPreview ? (
                            <div className="rounded-2xl border bg-card p-5 shadow-sm">
                                <a
                                    href={whatsappOrderUrl(
                                        whatsappNumber,
                                        product,
                                    )}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex h-13 w-full items-center justify-center gap-2.5 rounded-full bg-[#1f8f4e] px-6 font-medium text-white shadow-lg shadow-[#1f8f4e]/25 transition hover:-translate-y-0.5 hover:bg-[#187a41] focus-visible:ring-[3px] focus-visible:ring-[#1f8f4e]/40 focus-visible:outline-none"
                                >
                                    <MessageCircle
                                        className="size-5 transition group-hover:rotate-[-8deg]"
                                        aria-hidden
                                    />
                                    {product.is_available
                                        ? 'Commander sur WhatsApp'
                                        : 'Demander sur WhatsApp'}
                                </a>
                                <p className="mt-3 text-center text-sm text-muted-foreground">
                                    Le message est déjà rédigé avec cette pièce.
                                    L’équipe Kanvô vous répond et organise la
                                    livraison avec l’atelier.
                                </p>
                                <Link
                                    href={sellerProfile(product.seller.slug)}
                                    className="mt-3 block text-center text-sm font-medium text-primary hover:underline"
                                >
                                    Découvrir l’atelier de{' '}
                                    {product.seller.shop_name}
                                </Link>
                            </div>
                        ) : (
                            <div className="rounded-2xl border border-dashed bg-card p-5">
                                <p className="font-medium">
                                    La commande en ligne ouvre bientôt
                                </p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Les frais de livraison seront affichés avant
                                    le paiement. En attendant, découvrez
                                    l’atelier de {product.seller.shop_name}.
                                </p>
                                <Link
                                    href={sellerProfile(product.seller.slug)}
                                    className="mt-4 inline-flex h-11 items-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
                                >
                                    Voir l’atelier
                                </Link>
                            </div>
                        )}

                        <div className="text-base leading-relaxed whitespace-pre-line text-foreground/85">
                            {product.description}
                        </div>

                        <dl className="divide-y overflow-hidden rounded-2xl border bg-card text-sm">
                            {details
                                .filter(([, value]) => value)
                                .map(([label, value]) => (
                                    <div
                                        key={label}
                                        className="grid grid-cols-[150px_1fr] gap-3 px-5 py-3.5"
                                    >
                                        <dt className="text-muted-foreground">
                                            {label}
                                        </dt>
                                        <dd className="font-medium">{value}</dd>
                                    </div>
                                ))}
                        </dl>

                        {product.care_instructions && (
                            <div className="flex gap-4 rounded-2xl bg-muted p-5">
                                <Ruler
                                    className="mt-0.5 size-5 shrink-0 text-primary"
                                    aria-hidden
                                />
                                <div>
                                    <h2 className="font-display text-lg">
                                        Conseils d’entretien
                                    </h2>
                                    <p className="mt-1 text-sm whitespace-pre-line text-muted-foreground">
                                        {product.care_instructions}
                                    </p>
                                </div>
                            </div>
                        )}

                        <p className="flex items-start gap-2 text-xs text-muted-foreground">
                            <ShieldCheck
                                className="size-4 shrink-0"
                                aria-hidden
                            />
                            Les informations sur le produit (matières,
                            provenance) sont déclarées par le vendeur.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
