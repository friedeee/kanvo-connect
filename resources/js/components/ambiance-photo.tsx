import { useState } from 'react';
import { AMBIANCE, ambianceUrl } from '@/lib/ambiance';
import type { AmbianceName } from '@/lib/ambiance';
import { cn } from '@/lib/utils';

/**
 * Photo d'ambiance avec son crédit (auteur, licence, source), obligatoire pour les licences libres.
 * Le crédit apparaît discrètement en bas à droite.
 */
export function AmbiancePhoto({
    name,
    small = false,
    className,
    imgClassName,
    eager = false,
    credit = true,
}: {
    name: AmbianceName;
    small?: boolean;
    className?: string;
    imgClassName?: string;
    eager?: boolean;
    credit?: boolean;
}) {
    const [loaded, setLoaded] = useState(false);
    const photo = AMBIANCE[name];

    return (
        <figure className={cn('relative overflow-hidden bg-ink', className)}>
            <img
                src={ambianceUrl(name, small)}
                alt={photo.caption}
                loading={eager ? 'eager' : 'lazy'}
                decoding="async"
                onLoad={() => setLoaded(true)}
                className={cn(
                    'h-full w-full object-cover transition-opacity duration-700',
                    loaded ? 'opacity-100' : 'opacity-0',
                    imgClassName,
                )}
            />
            {credit && (
                <figcaption className="absolute right-2 bottom-2 max-w-[85%] truncate rounded-full bg-black/45 px-2 py-0.5 text-[10px] text-white/85 backdrop-blur-sm">
                    <a
                        href={photo.source}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                    >
                        {photo.caption} · {photo.author} · {photo.license}
                    </a>
                </figcaption>
            )}
        </figure>
    );
}
