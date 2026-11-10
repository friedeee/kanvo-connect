import { AMBIANCE, ambianceUrl } from '@/lib/ambiance';
import type { AmbianceName } from '@/lib/ambiance';
import { cn } from '@/lib/utils';

/**
 * Bande de photos qui défile en continu ; elle se met en pause au survol.
 * Les photos sont doublées pour que la boucle soit invisible.
 */
export function PhotoMarquee({
    photos,
    reverse = false,
    className,
}: {
    photos: AmbianceName[];
    reverse?: boolean;
    className?: string;
}) {
    return (
        <div className={cn('group overflow-hidden', className)}>
            <div
                className={cn(
                    'flex w-max animate-marquee-slow gap-4 group-hover:[animation-play-state:paused]',
                    reverse && '[animation-direction:reverse]',
                )}
            >
                {[0, 1].map((round) =>
                    photos.map((name, index) => (
                        <figure
                            key={`${round}-${name}`}
                            aria-hidden={round === 1}
                            className={cn(
                                'relative h-44 shrink-0 overflow-hidden rounded-2xl sm:h-56',
                                index % 3 === 1
                                    ? 'w-36 sm:w-44'
                                    : 'w-60 sm:w-80',
                            )}
                        >
                            <img
                                src={ambianceUrl(name, true)}
                                alt={round === 0 ? AMBIANCE[name].caption : ''}
                                loading="lazy"
                                decoding="async"
                                className="h-full w-full object-cover transition duration-700 hover:scale-110"
                            />
                            <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-3 pt-10 text-white">
                                <span className="block truncate text-xs font-medium">
                                    {AMBIANCE[name].caption}
                                </span>
                                <span className="block truncate text-[10px] text-white/70">
                                    {AMBIANCE[name].author} ·{' '}
                                    {AMBIANCE[name].license}
                                </span>
                            </figcaption>
                        </figure>
                    )),
                )}
            </div>
        </div>
    );
}
