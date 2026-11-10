import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { AmbiancePhoto } from '@/components/ambiance-photo';
import { PhotoSlideshow } from '@/components/photo-slideshow';
import { BrandMark } from '@/layouts/public-layout';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

/**
 * Connexion, inscription, mot de passe : photo de tissage à gauche, formulaire à droite.
 * Sur téléphone, la photo devient un bandeau en haut.
 */
export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="grid min-h-svh bg-background lg:grid-cols-[1.05fr_1fr]">
            <aside className="relative hidden overflow-hidden bg-ink text-white lg:block">
                <PhotoSlideshow
                    photos={['metier', 'appliques', 'kente-volta', 'coton']}
                    className="absolute inset-0"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/30" />
                <div className="relative flex h-full flex-col justify-between p-12">
                    <BrandMark light />
                    <div className="max-w-md animate-rise">
                        <p className="text-xs font-semibold tracking-[0.22em] text-gold uppercase">
                            Pagnes tissés du Bénin
                        </p>
                        <p className="mt-4 font-display text-5xl leading-[1.05] tracking-tight">
                            Chaque fil raconte
                            <em className="block text-gold">un atelier.</em>
                        </p>
                        <p className="mt-5 text-white/75">
                            Pagnes tissés et créations textiles, vendus
                            directement par les artisans qui les fabriquent.
                        </p>
                    </div>
                </div>
            </aside>

            <main className="flex flex-col">
                <div className="relative h-40 overflow-hidden lg:hidden">
                    <AmbiancePhoto
                        name="metier"
                        eager
                        credit={false}
                        className="absolute inset-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-ink/30 to-ink/80" />
                    <div className="absolute bottom-4 left-5">
                        <BrandMark light />
                    </div>
                </div>
                <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-10">
                    <div className="w-full max-w-md animate-rise">
                        <Link
                            href={home()}
                            className="group mb-10 hidden items-center gap-2 text-sm text-muted-foreground hover:text-foreground lg:inline-flex"
                        >
                            <ArrowLeft
                                className="size-4 transition group-hover:-translate-x-1"
                                aria-hidden
                            />
                            Retour au site
                        </Link>
                        <div className="mb-8 space-y-2">
                            <h1 className="font-display text-4xl tracking-tight">
                                {title}
                            </h1>
                            {description && (
                                <p className="text-muted-foreground">
                                    {description}
                                </p>
                            )}
                        </div>
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
