import { Link, usePage } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import AppLogoIcon from '@/components/app-logo-icon';
import { ThemeToggle } from '@/components/theme-toggle';
import { cn } from '@/lib/utils';
import { dashboard, home, login } from '@/routes';
import { index as catalog } from '@/routes/catalog';

/** Les boutiques sont ouvertes par l'équipe Kanvô : les artisans la contactent depuis l'accueil. */
const joinUrl = `${home.url()}#rejoindre`;

export function BrandMark({ light = false }: { light?: boolean }) {
    const { name } = usePage().props;

    return (
        <Link
            href={home()}
            className={cn(
                'flex items-center gap-2.5 rounded-md outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
                light ? 'text-white' : 'text-foreground',
            )}
        >
            <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                <AppLogoIcon className="size-6 fill-current" />
            </span>
            <span className="font-display text-2xl leading-none tracking-tight">
                {String(name)}
                <span className={light ? 'text-gold' : 'text-gold-foreground'}>
                    .
                </span>
            </span>
        </Link>
    );
}

export default function PublicLayout({ children }: { children: ReactNode }) {
    const { auth, name } = usePage().props;
    const { url } = usePage();
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 12);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });

        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => setOpen(false), [url]);

    /* Accueil et catalogue commencent par une grande photo sombre : l'en-tête passe en clair par-dessus. */
    const path = url.split('?')[0];
    const overlay =
        !scrolled && !open && (path === '/' || path === '/catalogue');
    const linkClass = cn(
        'rounded-full px-4 py-2 text-sm font-medium transition',
        overlay
            ? 'text-white/85 hover:bg-white/10 hover:text-white'
            : 'text-foreground/80 hover:bg-accent hover:text-foreground',
    );
    const ctaClass = cn(
        'ml-2 rounded-full px-5 py-2 text-sm font-medium shadow-sm transition',
        overlay
            ? 'bg-gold text-ink hover:bg-white'
            : 'bg-primary text-primary-foreground hover:bg-primary/90',
    );

    return (
        <div className="flex min-h-svh flex-col bg-background text-foreground">
            <a
                href="#contenu"
                className="sr-only z-50 rounded-md bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
            >
                Aller au contenu
            </a>
            <header
                className={cn(
                    'sticky top-0 z-30 border-b transition-[background-color,border-color,box-shadow] duration-300',
                    scrolled || open
                        ? 'border-border bg-background/90 shadow-sm backdrop-blur-xl'
                        : 'border-transparent bg-background/0',
                )}
            >
                <div className="mx-auto flex h-18 max-w-7xl items-center gap-4 px-5">
                    <BrandMark light={overlay} />
                    <nav
                        aria-label="Navigation principale"
                        className="ml-auto hidden items-center gap-1 md:flex"
                    >
                        <Link href={catalog()} className={linkClass}>
                            Catalogue
                        </Link>
                        <Link href={joinUrl} className={linkClass}>
                            Devenir vendeur
                        </Link>
                        <ThemeToggle
                            className={
                                overlay
                                    ? 'text-white/85 hover:bg-white/10 hover:text-white'
                                    : 'text-foreground/80 hover:bg-accent hover:text-foreground'
                            }
                        />
                        {auth.user ? (
                            <Link href={dashboard()} className={ctaClass}>
                                Mon espace
                            </Link>
                        ) : (
                            <Link href={login()} className={ctaClass}>
                                Connexion
                            </Link>
                        )}
                    </nav>
                    <ThemeToggle
                        className={cn(
                            'ml-auto md:hidden',
                            overlay
                                ? 'text-white hover:bg-white/10'
                                : 'text-foreground hover:bg-accent',
                        )}
                    />
                    <button
                        type="button"
                        className={cn(
                            'grid size-11 place-items-center rounded-full md:hidden',
                            overlay
                                ? 'text-white hover:bg-white/10'
                                : 'text-foreground hover:bg-accent',
                        )}
                        aria-expanded={open}
                        aria-controls="menu-mobile"
                        aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
                        onClick={() => setOpen(!open)}
                    >
                        {open ? (
                            <X className="size-5" />
                        ) : (
                            <Menu className="size-5" />
                        )}
                    </button>
                </div>
                {open && (
                    <nav
                        id="menu-mobile"
                        aria-label="Navigation principale"
                        className="grid gap-1 border-t px-5 pt-3 pb-5 md:hidden"
                    >
                        <Link
                            href={catalog()}
                            className="rounded-xl px-4 py-3 font-medium hover:bg-accent"
                        >
                            Catalogue
                        </Link>
                        <Link
                            href={joinUrl}
                            className="rounded-xl px-4 py-3 font-medium hover:bg-accent"
                        >
                            Devenir vendeur
                        </Link>
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="mt-2 rounded-full bg-primary px-5 py-3 text-center font-medium text-primary-foreground"
                            >
                                Mon espace
                            </Link>
                        ) : (
                            <Link
                                href={login()}
                                className="mt-2 rounded-full bg-primary px-5 py-3 text-center font-medium text-primary-foreground"
                            >
                                Connexion
                            </Link>
                        )}
                    </nav>
                )}
            </header>

            <main id="contenu" className="flex-1">
                {children}
            </main>

            <footer className="mt-24 bg-ink text-white/75">
                <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
                    <div className="space-y-4">
                        <BrandMark light />
                        <p className="max-w-sm text-sm leading-relaxed">
                            Le pagne tissé béninois, de l’artisan à vous. Chaque
                            pièce est proposée directement par le tisserand ou
                            l’atelier qui l’a fabriquée.
                        </p>
                    </div>
                    <div>
                        <h2 className="mb-4 text-xs font-semibold tracking-[0.18em] text-white uppercase">
                            Découvrir
                        </h2>
                        <ul className="grid gap-2 text-sm">
                            <li>
                                <Link
                                    href={catalog()}
                                    className="hover:text-white"
                                >
                                    Le catalogue
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={catalog({
                                        query: { available: '1' },
                                    })}
                                    className="hover:text-white"
                                >
                                    Disponible tout de suite
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={catalog({
                                        query: { sort: 'price_asc' },
                                    })}
                                    className="hover:text-white"
                                >
                                    Les petits prix
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h2 className="mb-4 text-xs font-semibold tracking-[0.18em] text-white uppercase">
                            Artisans
                        </h2>
                        <ul className="grid gap-2 text-sm">
                            <li>
                                <Link
                                    href={joinUrl}
                                    className="hover:text-white"
                                >
                                    Vendre sur Kanvô
                                </Link>
                            </li>
                            <li>
                                {auth.user ? (
                                    <Link
                                        href={dashboard()}
                                        className="hover:text-white"
                                    >
                                        Mon espace
                                    </Link>
                                ) : (
                                    <Link
                                        href={login()}
                                        className="hover:text-white"
                                    >
                                        Connexion
                                    </Link>
                                )}
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-white/10">
                    <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-6 text-xs sm:flex-row sm:justify-between">
                        <p>
                            © {new Date().getFullYear()} {name}. Prix affichés
                            en FCFA (XOF).
                        </p>
                        <p>
                            Photos d’ambiance : Wikimedia Commons, licences
                            libres (auteurs cités sur chaque photo).
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
