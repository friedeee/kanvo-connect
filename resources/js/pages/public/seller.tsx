import { Head } from '@inertiajs/react';
import { MapPin, Scissors, Sparkles } from 'lucide-react';
import { Pagination } from '@/components/pagination';
import { ProductCard } from '@/components/product-card';
import { WovenPattern } from '@/components/woven-pattern';
import type {
    ProductCard as ProductCardData,
    ResourcePage,
    SellerPublic,
} from '@/types/kanvo';

export default function Seller({
    seller,
    products,
}: {
    seller: SellerPublic;
    products: ResourcePage<ProductCardData>;
}) {
    return (
        <>
            <Head title={seller.shop_name} />

            <section className="relative h-56 overflow-hidden sm:h-72">
                <WovenPattern
                    seed={seller.slug}
                    strips={16}
                    className="animate-slow-zoom"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/90" />
            </section>

            <div className="mx-auto max-w-7xl px-5">
                <header className="relative -mt-20 grid animate-rise gap-6 rounded-[2rem] border bg-card p-6 shadow-xl shadow-primary/10 sm:p-10 md:grid-cols-[auto_1fr]">
                    <span className="grid size-24 place-items-center rounded-3xl bg-indigo-deep font-display text-4xl text-gold shadow-lg">
                        {seller.shop_name.charAt(0)}
                    </span>
                    <div>
                        <h1 className="font-display text-4xl tracking-tight sm:text-5xl">
                            {seller.shop_name}
                        </h1>
                        <ul className="mt-3 flex flex-wrap gap-2 text-sm">
                            <li className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1">
                                <Scissors
                                    className="size-3.5 text-primary"
                                    aria-hidden
                                />
                                {seller.craft}
                            </li>
                            <li className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1">
                                <MapPin
                                    className="size-3.5 text-primary"
                                    aria-hidden
                                />
                                {seller.city}
                            </li>
                            {seller.member_since && (
                                <li className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1">
                                    <Sparkles
                                        className="size-3.5 text-primary"
                                        aria-hidden
                                    />
                                    Sur Kanvô depuis {seller.member_since}
                                </li>
                            )}
                        </ul>
                        <p className="mt-5 max-w-3xl text-lg leading-relaxed whitespace-pre-line text-foreground/85">
                            {seller.bio}
                        </p>
                    </div>
                </header>

                <section className="mt-16 space-y-8">
                    <div className="flex items-end justify-between gap-4">
                        <h2 className="font-display text-3xl tracking-tight sm:text-4xl">
                            Les pièces de l’atelier
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            {products.meta.total} pièce
                            {products.meta.total > 1 ? 's' : ''}
                        </p>
                    </div>
                    {products.data.length > 0 ? (
                        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
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
                        <p className="rounded-3xl border border-dashed p-10 text-center text-muted-foreground">
                            Aucun produit publié pour le moment.
                        </p>
                    )}
                    <Pagination links={products.meta.links} />
                </section>
            </div>
        </>
    );
}
