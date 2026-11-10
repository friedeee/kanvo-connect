import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    BadgeCheck,
    Handshake,
    MessageCircle,
    MousePointerClick,
    Scissors,
    Sparkles,
    Truck,
} from 'lucide-react';
import { AmbiancePhoto } from '@/components/ambiance-photo';
import { PhotoMarquee } from '@/components/photo-marquee';
import { PhotoSlideshow } from '@/components/photo-slideshow';
import { ProductCard } from '@/components/product-card';
import { Reveal } from '@/components/reveal';
import { WovenPattern } from '@/components/woven-pattern';
import type { AmbianceName } from '@/lib/ambiance';
import { whatsappUrl } from '@/lib/whatsapp';
import { index as catalog } from '@/routes/catalog';
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
        text: 'Chaque boutique est ouverte par l’équipe Kanvô, après rencontre avec l’artisan.',
    },
    {
        icon: Scissors,
        title: 'Sur commande',
        text: 'Une couleur, une longueur ? Certains ateliers fabriquent à la demande.',
    },
];

const HERO_PHOTOS: AmbianceName[] = [
    'bandes',
    'appliques',
    'kente-volta',
    'metier',
    'ouidah',
];

/** Du fil au pagne : les grandes étapes, chacune illustrée. */
const JOURNEY: { photo: AmbianceName; title: string; text: string }[] = [
    {
        photo: 'coton',
        title: 'Le fil',
        text: 'Le coton est filé, souvent encore à la main, puis préparé en écheveaux.',
    },
    {
        photo: 'teinture',
        title: 'La teinture',
        text: 'Indigo, ocre, rouge : les fils prennent leurs couleurs avant le tissage.',
    },
    {
        photo: 'tisserand',
        title: 'Le tissage',
        text: 'Sur un métier étroit, le tisserand monte de longues bandes à motifs.',
    },
    {
        photo: 'pagne-tisse',
        title: 'Le pagne',
        text: 'Les bandes sont cousues côte à côte : la pièce est prête à être portée.',
    },
];

const MARQUEE_TOP: AmbianceName[] = [
    'appliques',
    'kente-ewe',
    'fils',
    'souvenirs-abomey',
    'bandes-tafi',
    'navettes',
    'ouidah',
];
const MARQUEE_BOTTOM: AmbianceName[] = [
    'kente-volta',
    'etals',
    'teinture',
    'kente-ewe-2',
    'indigo',
    'bandes-tafi-2',
    'coton',
];

/** Une photo par catégorie, choisie dans l'ordre (les catégories sont gérées par l'admin). */
const CATEGORY_PHOTOS: AmbianceName[] = [
    'kente-volta',
    'appliques',
    'pagne-tisse',
    'kente-ewe-2',
    'etals',
    'fils',
];

const ORDER_STEPS = [
    {
        icon: MousePointerClick,
        title: 'Choisissez',
        text: 'Parcourez le catalogue et ouvrez la pièce qui vous plaît.',
    },
    {
        icon: MessageCircle,
        title: 'Écrivez-nous',
        text: 'Un bouton ouvre WhatsApp avec le message déjà rédigé.',
    },
    {
        icon: Truck,
        title: 'Recevez',
        text: 'L’équipe Kanvô organise la livraison avec l’atelier.',
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
    const { whatsappNumber } = usePage().props;
    const featured = products.slice(0, 8);

    return (
        <>
            <Head title="Le pagne tissé béninois, de l’artisan à vous" />

            {/* ================= Héros ================= */}
            <section className="relative -mt-18 overflow-hidden bg-ink pt-18 text-white">
                <PhotoSlideshow
                    photos={HERO_PHOTOS}
                    className="absolute inset-0"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/95 via-ink/80 to-ink/55 lg:from-ink lg:to-ink/20" />
                <div className="pointer-events-none absolute inset-0 bg-weave opacity-50" />
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
                            <a
                                href="#savoir-faire"
                                className="inline-flex h-12 items-center rounded-full border border-white/40 px-7 font-medium text-white transition hover:bg-white hover:text-ink"
                            >
                                Notre savoir-faire
                            </a>
                        </div>
                    </div>

                    {featured[0] && (
                        <Link
                            href={`/produits/${featured[0].slug}`}
                            className="group relative mx-auto hidden w-full max-w-sm animate-rise [animation-delay:350ms] lg:block"
                        >
                            <div className="animate-float">
                                <div className="absolute -inset-4 rotate-3 rounded-[2rem] border border-gold/40 transition duration-700 group-hover:rotate-6" />
                                <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] shadow-2xl ring-1 shadow-black/40 ring-white/15">
                                    {featured[0].image_url ? (
                                        <img
                                            src={featured[0].image_url}
                                            alt={featured[0].name}
                                            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                                        />
                                    ) : (
                                        <WovenPattern
                                            seed={featured[0].slug}
                                            className="transition duration-700 group-hover:scale-105"
                                        />
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
                            </div>
                        </Link>
                    )}
                </div>
            </section>

            {/* ================= Engagements ================= */}
            <section className="border-b bg-card">
                <ul className="mx-auto grid max-w-7xl gap-8 px-5 py-10 md:grid-cols-3">
                    {PROMISES.map(({ icon: Icon, title, text }, index) => (
                        <li key={title}>
                            <Reveal delay={index * 120} className="flex gap-4">
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
                            </Reveal>
                        </li>
                    ))}
                </ul>
            </section>

            {/* ================= Univers (catégories) ================= */}
            {categories.length > 0 && (
                <section className="mx-auto max-w-7xl px-5 pt-20">
                    <Reveal>
                        <p className="text-xs font-semibold tracking-[0.22em] text-gold-foreground uppercase">
                            Les univers
                        </p>
                        <h2 className="mt-2 mb-10 font-display text-4xl tracking-tight sm:text-5xl">
                            Trouvez votre étoffe
                        </h2>
                    </Reveal>
                    <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
                        {categories.slice(0, 4).map((category, index) => (
                            <Reveal
                                key={category.id}
                                effect="curtain"
                                delay={index * 120}
                            >
                                <Link
                                    href={catalog({
                                        query: { category: category.slug },
                                    })}
                                    className="group relative block h-56 overflow-hidden rounded-3xl sm:h-72 lg:h-96"
                                >
                                    <AmbiancePhoto
                                        name={
                                            CATEGORY_PHOTOS[
                                                index % CATEGORY_PHOTOS.length
                                            ]
                                        }
                                        small
                                        credit={false}
                                        className="absolute inset-0"
                                        imgClassName="transition duration-[1200ms] ease-out group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent transition duration-500 group-hover:from-indigo-deep/90" />
                                    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 text-white sm:p-6">
                                        <span className="font-display text-2xl leading-tight sm:text-3xl">
                                            {category.name}
                                        </span>
                                        <span className="grid size-10 shrink-0 translate-x-2 place-items-center rounded-full bg-gold text-ink opacity-0 transition duration-500 group-hover:translate-x-0 group-hover:opacity-100">
                                            <ArrowRight
                                                className="size-4"
                                                aria-hidden
                                            />
                                        </span>
                                    </div>
                                </Link>
                            </Reveal>
                        ))}
                    </div>
                </section>
            )}

            {/* ================= Nouveautés ================= */}
            <section className="mx-auto max-w-7xl px-5 pt-24">
                <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
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
                </Reveal>
                {featured.length > 0 ? (
                    <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
                        {featured.map((product, index) => (
                            <Reveal key={product.id} delay={(index % 4) * 90}>
                                <ProductCard product={product} />
                            </Reveal>
                        ))}
                    </div>
                ) : (
                    <p className="rounded-2xl border border-dashed p-10 text-center text-muted-foreground">
                        Le catalogue est en cours de constitution.
                    </p>
                )}
            </section>

            {/* ================= Du fil au pagne ================= */}
            <section
                id="savoir-faire"
                className="relative mt-28 scroll-mt-20 overflow-hidden bg-indigo-deep py-24 text-white"
            >
                <div className="pointer-events-none absolute inset-0 bg-weave opacity-30" />
                <div className="pointer-events-none absolute -top-40 -right-40 size-[28rem] animate-spin-slow rounded-full border border-dashed border-gold/25" />
                <div className="relative mx-auto max-w-7xl px-5">
                    <Reveal className="max-w-2xl">
                        <p className="text-xs font-semibold tracking-[0.22em] text-gold uppercase">
                            Le savoir-faire
                        </p>
                        <h2 className="mt-2 font-display text-4xl leading-tight tracking-tight sm:text-5xl">
                            Du fil au pagne,{' '}
                            <em className="text-gold">
                                des semaines de travail
                            </em>
                        </h2>
                        <p className="mt-5 text-lg leading-relaxed text-white/75">
                            Couleurs, motifs et longueur racontent l’atelier qui
                            a créé chaque pièce. Sur Kanvô, vous achetez au
                            créateur.
                        </p>
                    </Reveal>
                    <ol className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {JOURNEY.map((step, index) => (
                            <li key={step.title}>
                                <Reveal
                                    effect="curtain"
                                    delay={index * 150}
                                    className="group"
                                >
                                    <div className="relative aspect-[3/4] overflow-hidden rounded-3xl">
                                        <AmbiancePhoto
                                            name={step.photo}
                                            small
                                            className="absolute inset-0"
                                            imgClassName="transition duration-[1200ms] ease-out group-hover:scale-110"
                                        />
                                        <span className="absolute top-4 left-4 grid size-11 place-items-center rounded-full bg-gold font-display text-lg text-ink shadow-lg transition duration-500 group-hover:rotate-[360deg]">
                                            {index + 1}
                                        </span>
                                    </div>
                                    <h3 className="mt-5 font-display text-2xl">
                                        {step.title}
                                    </h3>
                                    <p className="mt-2 text-sm leading-relaxed text-white/70">
                                        {step.text}
                                    </p>
                                </Reveal>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            {/* ================= Galerie défilante ================= */}
            <section className="mt-24 space-y-4" aria-label="Galerie">
                <Reveal className="mx-auto mb-8 max-w-7xl px-5 text-center">
                    <p className="text-xs font-semibold tracking-[0.22em] text-gold-foreground uppercase">
                        En images
                    </p>
                    <h2 className="mt-2 font-display text-4xl tracking-tight sm:text-5xl">
                        Couleurs d’Afrique de l’Ouest
                    </h2>
                </Reveal>
                <PhotoMarquee photos={MARQUEE_TOP} />
                <PhotoMarquee photos={MARQUEE_BOTTOM} reverse />
            </section>

            {/* ================= Comment commander ================= */}
            <section className="mx-auto mt-28 grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-2">
                <Reveal effect="zoom" className="relative">
                    <AmbiancePhoto
                        name="souvenirs-abomey"
                        className="aspect-[4/3] rounded-[2rem] shadow-2xl shadow-primary/15"
                    />
                    <div className="absolute -bottom-6 -left-2 hidden animate-float items-center gap-3 rounded-2xl border bg-card p-4 shadow-xl sm:flex">
                        <span className="grid size-11 place-items-center rounded-full bg-[#1f8f4e] text-white">
                            <MessageCircle className="size-5" aria-hidden />
                        </span>
                        <span className="text-sm">
                            <strong className="block">
                                Commande par WhatsApp
                            </strong>
                            <span className="text-muted-foreground">
                                Réponse rapide de l’équipe
                            </span>
                        </span>
                    </div>
                </Reveal>
                <div>
                    <Reveal>
                        <p className="text-xs font-semibold tracking-[0.22em] text-gold-foreground uppercase">
                            Commander
                        </p>
                        <h2 className="mt-2 font-display text-4xl leading-tight tracking-tight sm:text-5xl">
                            Simple comme un message
                        </h2>
                    </Reveal>
                    <ol className="mt-8 space-y-4">
                        {ORDER_STEPS.map(
                            ({ icon: Icon, title, text }, index) => (
                                <li key={title}>
                                    <Reveal
                                        delay={index * 140}
                                        className="flex gap-4 rounded-2xl border bg-card p-5 transition duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10"
                                    >
                                        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary dark:bg-primary/15">
                                            <Icon
                                                className="size-5"
                                                aria-hidden
                                            />
                                        </span>
                                        <span>
                                            <strong className="block font-display text-lg">
                                                {index + 1}. {title}
                                            </strong>
                                            <span className="text-sm text-muted-foreground">
                                                {text}
                                            </span>
                                        </span>
                                    </Reveal>
                                </li>
                            ),
                        )}
                    </ol>
                </div>
            </section>

            {/* ================= Artisans ================= */}
            {sellers.length > 0 && (
                <section className="mx-auto mt-28 max-w-7xl px-5">
                    <Reveal>
                        <p className="text-xs font-semibold tracking-[0.22em] text-gold-foreground uppercase">
                            Les artisans
                        </p>
                        <h2 className="mt-2 mb-10 font-display text-4xl tracking-tight sm:text-5xl">
                            Les mains derrière les pagnes
                        </h2>
                    </Reveal>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {sellers.map((seller, index) => (
                            <Reveal key={seller.slug} delay={(index % 3) * 120}>
                                <Link
                                    href={sellerProfile(seller.slug)}
                                    className="group block h-full overflow-hidden rounded-3xl border bg-card transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10"
                                >
                                    <div className="relative h-36 overflow-hidden">
                                        <WovenPattern
                                            seed={seller.slug}
                                            strips={10}
                                            className="transition duration-700 group-hover:scale-110"
                                        />
                                        <span className="absolute -bottom-7 left-6 grid size-14 place-items-center rounded-2xl border-4 border-card bg-primary font-display text-xl text-primary-foreground transition duration-500 group-hover:-rotate-6">
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
                            </Reveal>
                        ))}
                    </div>
                </section>
            )}

            {/* ================= Appel aux artisans ================= */}
            <section
                id="rejoindre"
                className="mx-auto mt-28 max-w-7xl scroll-mt-24 px-5"
            >
                <Reveal
                    effect="zoom"
                    className="relative overflow-hidden rounded-[2rem] bg-indigo-deep text-white"
                >
                    <PhotoSlideshow
                        photos={['metier', 'navettes', 'fils']}
                        interval={5000}
                        className="absolute inset-y-0 right-0 hidden w-1/2 md:block"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-indigo-deep via-indigo-deep/95 to-indigo-deep/20" />
                    <div className="relative max-w-xl p-10 sm:p-14">
                        <h2 className="font-display text-4xl leading-tight tracking-tight sm:text-5xl">
                            Vous tissez ?{' '}
                            <em className="text-gold">Rejoignez Kanvô.</em>
                        </h2>
                        <p className="mt-5 text-lg leading-relaxed opacity-85">
                            L’équipe Kanvô ouvre les boutiques des artisans
                            qu’elle rencontre. Écrivez-nous pour présenter votre
                            atelier : nous créons votre compte et vous publiez
                            vos pièces.
                        </p>
                        {whatsappNumber && (
                            <a
                                href={whatsappUrl(
                                    whatsappNumber,
                                    'Bonjour Kanvô ! Je suis artisan et je souhaite ouvrir une boutique sur Kanvô.',
                                )}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-gold px-7 font-medium text-ink transition hover:bg-white"
                            >
                                <MessageCircle className="size-4" aria-hidden />
                                Présenter mon atelier
                                <ArrowRight
                                    className="size-4 transition group-hover:translate-x-1"
                                    aria-hidden
                                />
                            </a>
                        )}
                    </div>
                </Reveal>
            </section>
        </>
    );
}
