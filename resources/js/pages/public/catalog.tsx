import { Form, Head, Link } from '@inertiajs/react';
import { SlidersHorizontal } from 'lucide-react';
import { PhotoSlideshow } from '@/components/photo-slideshow';
import { Pagination } from '@/components/pagination';
import { ProductCard } from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { selectClassName } from '@/lib/format';
import { index as catalog } from '@/routes/catalog';
import type {
    CategoryOption,
    ProductCard as ProductCardData,
    ResourcePage,
} from '@/types/kanvo';

type Filters = Partial<
    Record<
        | 'q'
        | 'category'
        | 'color'
        | 'seller'
        | 'price_min'
        | 'price_max'
        | 'min_length_cm'
        | 'available'
        | 'sort',
        string
    >
>;

export default function Catalog({
    products,
    filters,
    categories,
    sellers,
    colors,
}: {
    products: ResourcePage<ProductCardData>;
    filters: Filters;
    categories: CategoryOption[];
    sellers: { shop_name: string; slug: string }[];
    colors: Record<string, string>;
}) {
    return (
        <>
            <Head title="Catalogue" />

            <section className="relative -mt-18 overflow-hidden bg-ink pt-18 text-white">
                <PhotoSlideshow
                    photos={['etals', 'ouidah', 'kente-ewe-2', 'bandes-tafi']}
                    className="absolute inset-0"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/30" />
                <div className="relative mx-auto max-w-7xl px-5 py-16 sm:py-20">
                    <p className="animate-rise text-xs font-semibold tracking-[0.22em] text-gold uppercase">
                        {products.meta.total} pièce
                        {products.meta.total > 1 ? 's' : ''} au catalogue
                    </p>
                    <h1 className="mt-3 animate-rise font-display text-5xl tracking-tight [animation-delay:100ms] sm:text-6xl">
                        Le catalogue
                    </h1>
                    <p className="mt-4 max-w-xl animate-rise text-lg text-white/80 [animation-delay:200ms]">
                        Kanvô, pagnes d’apparat et créations textiles, filtrés
                        par couleur, prix, longueur ou atelier.
                    </p>
                </div>
            </section>

            <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 md:grid-cols-[260px_1fr]">
                <aside className="md:sticky md:top-24 md:self-start">
                    <details
                        className="group rounded-2xl border bg-card p-5 shadow-sm md:[&_summary]:pointer-events-none"
                        open
                    >
                        <summary className="flex cursor-pointer items-center gap-2 font-display text-lg md:cursor-default">
                            <SlidersHorizontal
                                className="size-4 text-primary"
                                aria-hidden
                            />
                            Affiner
                        </summary>
                        <Form
                            {...catalog.form()}
                            options={{ preserveScroll: true }}
                            transform={(data) =>
                                Object.fromEntries(
                                    Object.entries(data).filter(
                                        ([, value]) => value !== '',
                                    ),
                                )
                            }
                            className="mt-4 space-y-4"
                        >
                            <div className="grid gap-1.5">
                                <Label htmlFor="q">Recherche</Label>
                                <Input
                                    id="q"
                                    name="q"
                                    type="search"
                                    defaultValue={filters.q}
                                    placeholder="kanvô, indigo…"
                                />
                            </div>
                            <div className="grid gap-1.5">
                                <Label htmlFor="category">Catégorie</Label>
                                <select
                                    id="category"
                                    name="category"
                                    defaultValue={filters.category ?? ''}
                                    className={selectClassName}
                                >
                                    <option value="">Toutes</option>
                                    {categories.map((category) => (
                                        <option
                                            key={category.id}
                                            value={category.slug}
                                        >
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid gap-1.5">
                                <Label htmlFor="color">Couleur</Label>
                                <select
                                    id="color"
                                    name="color"
                                    defaultValue={filters.color ?? ''}
                                    className={selectClassName}
                                >
                                    <option value="">Toutes</option>
                                    {Object.entries(colors).map(
                                        ([value, label]) => (
                                            <option key={value} value={value}>
                                                {label}
                                            </option>
                                        ),
                                    )}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="grid gap-1.5">
                                    <Label htmlFor="price_min">Prix min.</Label>
                                    <Input
                                        id="price_min"
                                        name="price_min"
                                        type="number"
                                        min={0}
                                        step={500}
                                        inputMode="numeric"
                                        defaultValue={filters.price_min}
                                    />
                                </div>
                                <div className="grid gap-1.5">
                                    <Label htmlFor="price_max">Prix max.</Label>
                                    <Input
                                        id="price_max"
                                        name="price_max"
                                        type="number"
                                        min={0}
                                        step={500}
                                        inputMode="numeric"
                                        defaultValue={filters.price_max}
                                    />
                                </div>
                            </div>
                            <div className="grid gap-1.5">
                                <Label htmlFor="min_length_cm">
                                    Longueur minimale (cm)
                                </Label>
                                <Input
                                    id="min_length_cm"
                                    name="min_length_cm"
                                    type="number"
                                    min={0}
                                    inputMode="numeric"
                                    defaultValue={filters.min_length_cm}
                                />
                            </div>
                            <div className="grid gap-1.5">
                                <Label htmlFor="seller">Artisan</Label>
                                <select
                                    id="seller"
                                    name="seller"
                                    defaultValue={filters.seller ?? ''}
                                    className={selectClassName}
                                >
                                    <option value="">Tous</option>
                                    {sellers.map((seller) => (
                                        <option
                                            key={seller.slug}
                                            value={seller.slug}
                                        >
                                            {seller.shop_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <label className="flex items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    name="available"
                                    value="1"
                                    defaultChecked={filters.available === '1'}
                                    className="size-4"
                                />
                                Disponible uniquement
                            </label>
                            <div className="grid gap-1.5">
                                <Label htmlFor="sort">Trier par</Label>
                                <select
                                    id="sort"
                                    name="sort"
                                    defaultValue={filters.sort ?? 'recent'}
                                    className={selectClassName}
                                >
                                    <option value="recent">Plus récents</option>
                                    <option value="price_asc">
                                        Prix croissant
                                    </option>
                                    <option value="price_desc">
                                        Prix décroissant
                                    </option>
                                </select>
                            </div>
                            <div className="flex gap-2">
                                <Button className="flex-1 rounded-full">
                                    Filtrer
                                </Button>
                                <Button
                                    asChild
                                    variant="ghost"
                                    className="rounded-full"
                                >
                                    <Link href={catalog()}>Effacer</Link>
                                </Button>
                            </div>
                        </Form>
                    </details>
                </aside>

                <section className="space-y-8">
                    <p
                        className="text-sm text-muted-foreground"
                        aria-live="polite"
                    >
                        {products.meta.total} produit
                        {products.meta.total > 1 ? 's' : ''}
                        {Object.keys(filters).some((key) => key !== 'sort') &&
                            ' correspondent à vos critères'}
                    </p>

                    {products.data.length > 0 ? (
                        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-3">
                            {products.data.map((product, index) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    className="animate-rise"
                                    style={{
                                        animationDelay: `${index * 50}ms`,
                                    }}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-3xl border border-dashed p-12 text-center">
                            <p className="font-display text-2xl">
                                Aucune pièce trouvée
                            </p>
                            <p className="mt-2 text-muted-foreground">
                                Essayez d’élargir vos critères.
                            </p>
                            <Button
                                asChild
                                variant="outline"
                                className="mt-6 rounded-full"
                            >
                                <Link href={catalog()}>
                                    Voir tout le catalogue
                                </Link>
                            </Button>
                        </div>
                    )}

                    <Pagination links={products.meta.links} />
                </section>
            </div>
        </>
    );
}
