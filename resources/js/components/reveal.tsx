import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Fait apparaître son contenu quand il entre à l'écran (une seule fois).
 * Les styles sont dans app.css ([data-reveal]) et respectent « mouvement réduit ».
 */
export function Reveal({
    children,
    className,
    effect = 'up',
    delay = 0,
    style,
}: {
    children: ReactNode;
    className?: string;
    effect?: 'up' | 'zoom' | 'curtain';
    delay?: number;
    style?: CSSProperties;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const [shown, setShown] = useState(false);

    useEffect(() => {
        const element = ref.current;

        if (!element || typeof IntersectionObserver === 'undefined') {
            setShown(true);

            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setShown(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
        );
        observer.observe(element);

        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            data-reveal={effect}
            data-shown={shown ? '' : undefined}
            className={cn(className)}
            style={
                { '--reveal-delay': `${delay}ms`, ...style } as CSSProperties
            }
        >
            {children}
        </div>
    );
}
