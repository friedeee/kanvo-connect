import { Link } from '@inertiajs/react';
import { ArrowUpRight } from 'lucide-react';
import type { CSSProperties } from 'react';
import { WovenPattern } from '@/components/woven-pattern';
import { formatXof } from '@/lib/format';
import { cn } from '@/lib/utils';
import { show } from '@/routes/catalog';
import type { ProductCard as ProductCardData } from '@/types/kanvo';

export function availabilityLabel(product: {
    is_available: boolean;
    lead_time_days: number | null;
}): string {
    if (!product.is_available) {
        return 'Épuisé';
    }

    return product.lead_time_days
        ? `Fabriqué à la commande (${product.lead_time_days} j)`
        : 'En stock';
}

/**
 * Photo du produit. Sans photo, un motif de pagne tissé propre à chaque produit
 * remplace l'image vide ; un badge précise qu'il ne s'agit pas d'une vraie photo.
 */
export function ProductImage({
    src,
    alt,
    className,
    seed,
    colors,
    badge = false,
}: {
    src: string | null;
    alt: string;
    className?: string;
    seed?: string;
    colors?: string[];
    badge?: boolean;
}) {
    if (src) {
        return (
            <img
                src={src}
                alt={alt}
                loading="lazy"
                className={cn('h-full w-full object-cover', className)}
            />
        );
    }

    return (
        <div className="relative h-full w-full overflow-hidden">
            <WovenPattern
                seed={seed ?? alt}
                colors={colors}
                className={className}
            />
            {badge ? (
                <span className="absolute bottom-3 left-3 rounded-full bg-background/90 px-2.5 py-1 text-[11px] font-medium text-foreground backdrop-blur">
                    Photo à venir
                </span>
            ) : (
                <span className="sr-only">Pas encore de photo</span>
            )}
        </div>
    );
}

export function ProductCard({
    product,
    className,
    style,
}: {
    product: ProductCardData;
    className?: string;
    style?: CSSProperties;
}) {
    return (
        <Link
            href={show(product.slug)}
            style={style}
            className={cn(
                'group flex flex-col gap-3 rounded-2xl outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
                className,
            )}
        >
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted shadow-sm ring-1 ring-border/60 transition duration-500 group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-primary/15">
                <ProductImage
                    src={product.image_url}
                    alt={product.name}
                    seed={product.slug}
                    badge
                    className="transition duration-700 ease-out group-hover:scale-105"
                />
                {!product.is_available && (
                    <span className="absolute top-3 left-3 rounded-full bg-ink/85 px-2.5 py-1 text-[11px] font-medium tracking-wide text-white uppercase">
                        Épuisé
                    </span>
                )}
                <span className="absolute top-3 right-3 grid size-9 translate-y-1 place-items-center rounded-full bg-background/95 text-foreground opacity-0 shadow-sm transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                    <ArrowUpRight className="size-4" aria-hidden />
                </span>
            </div>
            <div className="flex flex-col gap-1 px-1">
                <p className="text-xs tracking-wide text-muted-foreground uppercase">
                    {product.seller.shop_name}
                </p>
                <h3 className="line-clamp-2 font-display text-lg leading-snug transition-colors group-hover:text-primary">
                    {product.name}
                </h3>
                <div className="mt-1 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                    <p className="font-semibold">
                        {formatXof(product.price_xof)}
                        <span className="ml-1 text-xs font-normal text-muted-foreground">
                            {product.sale_unit.toLowerCase()}
                        </span>
                    </p>
                    {product.is_available && (
                        <p className="text-xs text-gold-foreground">
                            {availabilityLabel(product)}
                        </p>
                    )}
                </div>
            </div>
        </Link>
    );
}
