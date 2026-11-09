import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    BadgeCheck,
    Handshake,
    Scissors,
    Sparkles,
} from 'lucide-react';
import { AmbiancePhoto } from '@/components/ambiance-photo';
import { ProductCard } from '@/components/product-card';
import { WovenPattern } from '@/components/woven-pattern';
import { index as catalog } from '@/routes/catalog';
import { apply } from '@/routes/seller';
import { show as sellerProfile } from '@/routes/sellers';
import type {
    CategoryOption,
    ProductCard as ProductCardData,
    SellerPublic,
} from '@/types/kanvo';

const PROMISES = [
    {
        icon: Handshake,
        title: 'En direct de l’atelier',
        text: 'Chaque pièce est proposée par le tisserand ou l’atelier qui l’a fabriquée, sans intermédiaire.',
    },
    {
        icon: BadgeCheck,
        title: 'Artisans vérifiés',
        text: 'Les vendeurs sont validés par l’équipe Kanvô avant de pouvoir publier.',
    },
    {
        icon: Scissors,
        title: 'Sur commande',
        text: 'Une couleur, une longueur ? Certains ateliers fabriquent à la demande.',
    },
];

export default function Home({
    products,
    sellers,
    categories,
}: {
    products: ProductCardData[];
    sellers: SellerPublic[];
    categories: CategoryOption[];
}) {
    const featured = products.slice(0, 8);

    return (
        <>
            <Head title="Le pagne tissé béninois, de l’artisan à vous" />

            {/* ================= Héros ================= */}
            <section className="relative -mt-18 overflow-hidden bg-ink pt-18 text-white">
                <AmbiancePhoto
                    name="bandes"
                    eager
                    className="absolute inset-0"
                    imgClassName="animate-slow-zoom"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/30" />
                <div className="absolute inset-0 bg-weave opacity-60" />
                <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-24 sm:py-32 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
                    <div className="max-w-2xl">
                        <p className="mb-6 inline-flex animate-rise items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium tracking-[0.2em] uppercase backdrop-blur">
                            <Sparkles
                                className="size-3.5 text-gold"
                                aria-hidden
                            />
                            Tissé à la main au Bénin
                        </p>
                        <h1 className="animate-rise font-display text-5xl leading-[1.02] font-semibold tracking-tight [animation-delay:100ms] sm:text-7xl">
                            Le pagne tissé,
                            <br />
                            <em className="font-normal text-gold">
                                de l’artisan à vous.
                            </em>
                        </h1>
                        <p className="mt-6 max-w-xl animate-rise text-lg leading-relaxed text-white/80 [animation-delay:200ms]">
                            Kanvô, pagnes d’apparat et créations textiles,
                            proposés directement par les tisserands, ateliers et
                            créateurs qui les fabriquent.
                        </p>
                        <div className="mt-9 flex animate-rise flex-wrap gap-3 [animation-delay:300ms]">
                            <Link
                                href={catalog()}
                                className="group inline-flex h-12 items-center gap-2 rounded-full bg-gold px-7 font-medium text-ink shadow-lg shadow-black/20 transition hover:bg-white"
                            >
                                Explorer le catalogue
                                <ArrowRight
                                    className="size-4 transition group-hover:translate-x-1"
                                    aria-hidden
                                />
                            </Link>
                            <Link
                                href={apply()}
                                className="inline-flex h-12 items-center rounded-full border border-white/40 px-7 font-medium text-white transition hover:bg-white hover:text-ink"
                            >
                                Vendre sur Kanvô
                            </Link>
                        </div>
                        {categories.length > 0 && (
                            <div className="mt-10 flex animate-rise flex-wrap gap-2 [animation-delay:400ms]">
                                {categories.map((category) => (
                                    <Link
                                        key={category.id}
                                        href={catalog({
                                            query: { category: category.slug },
                                        })}
                                        className="rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-sm text-white/85 backdrop-blur transition hover:border-gold hover:text-white"
                                    >
                                        {category.name}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {featured[0] && (
                        <Link
                            href={`/produits/${featured[0].slug}`}
                            className="group relative mx-auto hidden w-full max-w-sm animate-rise [animation-delay:350ms] lg:block"
                        >
                            <div className="absolute -inset-4 rotate-3 rounded-[2rem] border border-gold/40" />
                            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] shadow-2xl ring-1 shadow-black/40 ring-white/15">
                                {featured[0].image_url ? (
                                    <img
                                        src={featured[0].image_url}
                                        alt={featured[0].name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <WovenPattern seed={featured[0].slug} />
                                )}
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/95 to-transparent p-6 pt-20">
                                    <p className="text-xs tracking-[0.2em] text-gold uppercase">
                                        À la une
                                    </p>
                                    <p className="mt-1 font-display text-2xl">
                                        {featured[0].name}
                                    </p>
                                    <p className="mt-1 text-sm text-white/75">
                                        {featured[0].seller.shop_name}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    )}
                </div>
            </section>

            {/* ================= Engagements ================= */}
            <section className="border-b bg-card">
                <ul className="mx-auto grid max-w-7xl gap-8 px-5 py-10 md:grid-cols-3">
                    {PROMISES.map(({ icon: Icon, title, text }) => (
                        <li key={title} className="flex gap-4">
                            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary dark:bg-primary/15">
                                <Icon className="size-5" aria-hidden />
                            </span>
                            <span>
                                <strong className="block font-display text-lg">
                                    {title}
                                </strong>
                                <span className="text-sm leading-relaxed text-muted-foreground">
                                    {text}
                                </span>
                            </span>
                        </li>
                    ))}
                </ul>
            </section>

            {/* ================= Nouveautés ================= */}
            <section className="mx-auto max-w-7xl px-5 pt-20">
                <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold tracking-[0.22em] text-gold-foreground uppercase">
                            Nouveautés
                        </p>
                        <h2 className="mt-2 font-display text-4xl tracking-tight sm:text-5xl">
                            Fraîchement sortis du métier
                        </h2>
                    </div>
                    <Link
                        href={catalog()}
                        className="group inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition hover:border-primary hover:text-primary"
                    >
                        Tout le catalogue
                        <ArrowRight
                            className="size-4 transition group-hover:translate-x-1"
                            aria-hidden
                        />
                    </Link>
                </div>
                {featured.length > 0 ? (
                    <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
                        {featured.map((product, index) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                className="animate-rise"
                                style={{ animationDelay: `${index * 60}ms` }}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="rounded-2xl border border-dashed p-10 text-center text-muted-foreground">
                        Le catalogue est en cours de constitution.
                    </p>
                )}
            </section>

            {/* ================= Le savoir-faire ================= */}
            <section className="mx-auto mt-28 grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-2">
                <div className="grid grid-cols-6 grid-rows-6 gap-4 sm:h-[560px]">
                    <AmbiancePhoto
                        name="tisserand"
                        small
                        className="col-span-4 row-span-4 aspect-[4/3] rounded-3xl sm:aspect-auto"
                    />
                    <AmbiancePhoto
                        name="navettes"
                        small
                        credit={false}
                        className="col-span-2 row-span-3 hidden rounded-3xl sm:block"
                    />
                    <AmbiancePhoto
                        name="kente-ewe"
                        small
                        credit={false}
                        className="col-span-2 row-span-3 hidden rounded-3xl sm:block"
                    />
                    <div className="col-span-4 row-span-2 hidden items-center gap-4 rounded-3xl bg-indigo-deep p-6 text-white sm:flex">
                        <span className="font-display text-5xl text-gold">
                            1
                        </span>
                        <span className="text-sm leading-relaxed">
                            bande étroite après l’autre, cousues côte à côte
                            pour former le pagne.
                        </span>
                    </div>
                </div>
                <div>
                    <p className="text-xs font-semibold tracking-[0.22em] text-gold-foreground uppercase">
                        Le savoir-faire
                    </p>
                    <h2 className="mt-2 font-display text-4xl leading-tight tracking-tight sm:text-5xl">
                        Des semaines de travail,{' '}
                        <em className="text-primary">dans chaque pièce</em>
                    </h2>
                    <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                        Le pagne tissé se fabrique sur un métier étroit : le
                        tisserand monte des bandes de quelques centimètres, en
                        alternant rayures et motifs, puis les assemble à la
                        main. Couleurs, motifs et longueur racontent l’atelier
                        qui l’a créé.
                    </p>
                    <p className="mt-4 leading-relaxed text-muted-foreground">
                        Sur Kanvô, vous achetez au créateur : les informations
                        sur les matières et la provenance sont déclarées par
                        chaque vendeur.
                    </p>
                    <Link
                        href={catalog()}
                        className="group mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-primary px-7 font-medium text-primary-foreground transition hover:bg-primary/90"
                    >
                        Découvrir les pièces
                        <ArrowRight
                            className="size-4 transition group-hover:translate-x-1"
                            aria-hidden
                        />
                    </Link>
                </div>
            </section>

            {/* ================= Bandeau défilant ================= */}
            <div
                className="mt-28 overflow-hidden border-y bg-card py-5"
                aria-hidden
            >
                <div className="flex w-max animate-marquee gap-10 font-display text-2xl text-foreground/70 italic">
                    {Array.from({ length: 2 }, (_, round) => (
                        <span key={round} className="flex gap-10">
                            {[
                                'Kanvô',
                                'Tissé à la main',
                                'Abomey',
                                'Porto-Novo',
                                'Cotonou',
                                'Indigo',
                                'Fil d’or',
                                'Pièces uniques',
                                'Sur commande',
                            ].map((word) => (
                                <span
                                    key={word}
                                    className="flex items-center gap-10"
                                >
                                    {word}
                                    <span className="size-2 rotate-45 bg-gold" />
                                </span>
                            ))}
                        </span>
                    ))}
                </div>
            </div>

            {/* ================= Artisans ================= */}
            {sellers.length > 0 && (
                <section className="mx-auto mt-24 max-w-7xl px-5">
                    <p className="text-xs font-semibold tracking-[0.22em] text-gold-foreground uppercase">
                        Les artisans
                    </p>
                    <h2 className="mt-2 mb-10 font-display text-4xl tracking-tight sm:text-5xl">
                        Les mains derrière les pagnes
                    </h2>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {sellers.map((seller) => (
                            <Link
                                key={seller.slug}
                                href={sellerProfile(seller.slug)}
                                className="group overflow-hidden rounded-3xl border bg-card transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10"
                            >
                                <div className="relative h-36 overflow-hidden">
                                    <WovenPattern
                                        seed={seller.slug}
                                        strips={10}
                                        className="transition duration-700 group-hover:scale-110"
                                    />
                                    <span className="absolute -bottom-7 left-6 grid size-14 place-items-center rounded-2xl border-4 border-card bg-primary font-display text-xl text-primary-foreground">
                                        {seller.shop_name.charAt(0)}
                                    </span>
                                </div>
                                <div className="p-6 pt-10">
                                    <p className="font-display text-xl">
                                        {seller.shop_name}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {seller.craft} · {seller.city}
                                    </p>
                                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed">
                                        {seller.bio}
                                    </p>
                                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                                        Voir l’atelier
                                        <ArrowRight
                                            className="size-4 transition group-hover:translate-x-1"
                                            aria-hidden
                                        />
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* ================= Appel aux artisans ================= */}
            <section className="mx-auto mt-28 max-w-7xl px-5">
                <div className="relative overflow-hidden rounded-[2rem] bg-indigo-deep text-white">
                    <AmbiancePhoto
                        name="metier"
                        className="absolute inset-y-0 right-0 hidden w-1/2 md:block"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-deep via-indigo-deep/95 to-indigo-deep/30" />
                    <div className="relative max-w-xl p-10 sm:p-14">
                        <h2 className="font-display text-4xl leading-tight tracking-tight sm:text-5xl">
                            Vous tissez ?{' '}
                            <em className="text-gold">Vendez sur Kanvô.</em>
                        </h2>
                        <p className="mt-5 text-lg leading-relaxed opacity-85">
                            Créez votre boutique, publiez vos pièces et touchez
                            des clients partout, sans intermédiaire.
                        </p>
                        <Link
                            href={apply()}
                            className="group mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-gold px-7 font-medium text-ink transition hover:bg-white"
                        >
                            Ouvrir ma boutique
                            <ArrowRight
                                className="size-4 transition group-hover:translate-x-1"
                                aria-hidden
                            />
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
