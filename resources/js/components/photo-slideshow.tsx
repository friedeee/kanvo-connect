import { useEffect, useState } from 'react';
import { AMBIANCE, ambianceUrl } from '@/lib/ambiance';
import type { AmbianceName } from '@/lib/ambiance';
import { cn } from '@/lib/utils';

/**
 * Diaporama en fondu enchaîné avec un lent zoom (effet « Ken Burns »).
 * Le crédit de la photo affichée reste visible en bas à droite.
 */
export function PhotoSlideshow({
    photos,
    interval = 6500,
    className,
    showDots = false,
}: {
    photos: AmbianceName[];
    interval?: number;
    className?: string;
    showDots?: boolean;
}) {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const reduced = window.matchMedia(
            '(prefers-reduced-motion: reduce)',
        ).matches;

        if (reduced || photos.length < 2) {
            return;
        }

        const timer = window.setInterval(
            () => setCurrent((index) => (index + 1) % photos.length),
            interval,
        );

        return () => window.clearInterval(timer);
    }, [photos.length, interval]);

    const photo = AMBIANCE[photos[current]];

    return (
        <div className={cn('relative overflow-hidden bg-ink', className)}>
            {photos.map((name, index) => (
                <img
                    key={name}
                    src={ambianceUrl(name)}
                    alt={index === current ? AMBIANCE[name].caption : ''}
                    aria-hidden={index !== current}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                    className={cn(
                        'absolute inset-0 h-full w-full object-cover transition-opacity duration-[1600ms] ease-in-out',
                        index === current
                            ? 'animate-ken-burns opacity-100'
                            : 'opacity-0',
                    )}
                />
            ))}
            <a
                href={photo.source}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute right-2 bottom-2 z-10 max-w-[85%] truncate rounded-full bg-black/45 px-2 py-0.5 text-[10px] text-white/85 backdrop-blur-sm hover:underline"
            >
                {photo.caption} · {photo.author} · {photo.license}
            </a>
            {showDots && (
                <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
                    {photos.map((name, index) => (
                        <button
                            key={name}
                            type="button"
                            onClick={() => setCurrent(index)}
                            aria-label={`Photo ${index + 1} : ${AMBIANCE[name].caption}`}
                            aria-current={index === current}
                            className={cn(
                                'h-1.5 rounded-full transition-all duration-500',
                                index === current
                                    ? 'w-8 bg-gold'
                                    : 'w-3 bg-white/50 hover:bg-white',
                            )}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
